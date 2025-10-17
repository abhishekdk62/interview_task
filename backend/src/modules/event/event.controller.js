const eventService = require('./event.service');
const { successResponse } = require('../../utils/response.util');
const { MESSAGES } = require('../../config/constants');

class EventController {
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body);
      return successResponse(res, event, MESSAGES.EVENT_CREATED, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllEvents(req, res, next) {
    try {
      const events = await eventService.getAllEvents();
      return successResponse(res, events, MESSAGES.EVENTS_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  async getEventsByProfile(req, res, next) {
    try {
      const { profileId } = req.params;
      const events = await eventService.getEventsByProfile(profileId);
      return successResponse(res, events, MESSAGES.EVENTS_FETCHED);
    } catch (error) {
      next(error);
    }
  }



  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const { updatedBy, ...updateData } = req.body;
      const event = await eventService.updateEvent(id, updateData, updatedBy);
      return successResponse(res, event, MESSAGES.EVENT_UPDATED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
