const eventRepository = require("./event.repository");
const eventLogService = require("../eventLog/eventLog.service");
const { MESSAGES } = require("../../config/constants");
const dayjs = require("dayjs");

class EventService {
  async createEvent(eventData) {
    const { profiles, timezone, startDate, endDate } = eventData;
    if (!profiles || profiles.length === 0) {
      const err = new Error("At least one profile is required");
      err.statusCode = 400;
      throw err;
    }

    if (!timezone) {
      const err = new Error("Timezone is required");
      err.statusCode = 400;
      throw err;
    }

    if (!startDate || !endDate) {
      const err = new Error("Start date and end date are required");
      err.statusCode = 400;
      throw err;
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      const err = new Error("Invalid date format");
      err.statusCode = 400;
      throw err;
    }

    if (end.isBefore(start) || end.isSame(start)) {
      const err = new Error("End date must be after start date");
      err.statusCode = 400;
      throw err;
    }

    if (start.isBefore(dayjs())) {
      const err = new Error("Start date cannot be in the past");
      err.statusCode = 400;
      throw err;
    }

    return await eventRepository.create({
      profiles,
      timezone,
      startDate,
      endDate,
    });
  }

  async getEventsByProfile(profileId) {
    return await eventRepository.findByProfileId(profileId);
  }

  async updateEvent(id, updateData) {
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
        const err=new Error("End date must be after start date");
        err.statusCode=400
        throw err
      }
    }
    let profileNames = [];
    if (updateData.profiles) {
      const profiles = await Promise.all(
        updateData.profiles.map((id) => profileRepository.findById(id))
      );
      profileNames = profiles.map((p) => p.name);
    }

    await eventLogService.createLogsForUpdate(
      existingEvent,
      updateData,
      profileNames
    );

    return await eventRepository.update(id, updateData);
  }
}

module.exports = new EventService();
