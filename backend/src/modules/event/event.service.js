const eventRepository = require("./event.repository");
const eventLogService = require("../eventLog/eventLog.service");
const { MESSAGES } = require("../../config/constants");
const dayjs = require("dayjs");

class EventService {
  async createEvent(eventData) {
    const { profiles, timezone, startDate, endDate } = eventData;
    if (!profiles || profiles.length === 0) {
      throw new Error("At least one profile is required");
    }

    if (!timezone) {
      throw new Error("Timezone is required");
    }

    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new Error("Invalid date format");
    }

    if (end.isBefore(start) || end.isSame(start)) {
      throw new Error("End date must be after start date");
    }

    if (start.isBefore(dayjs())) {
      throw new Error("Start date cannot be in the past");
    }

    return await eventRepository.create({
      profiles,
      timezone,
      startDate,
      endDate,
    });
  }

  async getAllEvents() {
    return await eventRepository.findAll();
  }

  async getEventsByProfile(profileId) {
    return await eventRepository.findByProfileId(profileId);
  }

  async updateEvent(id, updateData, updatedBy) {
    const existingEvent = await eventRepository.findById(id);

    if (!existingEvent) {
      const error = new Error(MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = 404;
      throw error;
    }
    if (updateData.startDate || updateData.endDate) {
      const start = dayjs(updateData.startDate || existingEvent.startDate);
      const end = dayjs(updateData.endDate || existingEvent.endDate);

      if (end.isBefore(start) || end.isSame(start)) {
        throw new Error("End date must be after start date");
      }
    }

    await eventLogService.createLogsForUpdate(
      existingEvent,
      updateData,
      updatedBy
    );

    return await eventRepository.update(id, updateData);
  }
}

module.exports = new EventService();
