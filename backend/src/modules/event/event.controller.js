const { successResponse } = require("../../utils/response.util");
const { MESSAGES } = require("../../config/constants");

class EventController {
  constructor(eventService) {
    this.eventService = eventService;
  }
  async createEvent(req, res, next) {
    try {
      const event = await this.eventService.createEvent(req.body);
      return successResponse(res, event, MESSAGES.EVENT_CREATED, 201);
    } catch (error) {
      next(error);
    }
  }

  async getEventsByProfile(req, res, next) {
    try {
      const { profileId } = req.params;
      const events = await this.eventService.getEventsByProfile(profileId);
      return successResponse(res, events, MESSAGES.EVENTS_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const event = await this.eventService.updateEvent(id, req.body);
      return successResponse(res, event, MESSAGES.EVENT_UPDATED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports =  EventController
