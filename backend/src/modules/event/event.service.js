const eventRepository = require("./event.repository");
const eventLogService = require("../eventLog/eventLog.service");
const { MESSAGES } = require("../../config/constants");
const dayjs = require("dayjs");
const profileRepository = require("../profiles/profile.repository");

class EventService {
  async createEvent(eventData) {
    const { profiles, timezone, startDate, endDate } = eventData;
    if (!profiles || profiles.length === 0) {
      const err = new Error(MESSAGES.PROFILE_REQUIRED);
      err.statusCode = 400;
      throw err;
    }

    if (!timezone) {
      const err = new Error(MESSAGES.TIMEZONE_REQUIRED);
      err.statusCode = 400;
      throw err;
    }

    if (!startDate || !endDate) {
      const err = new Error(MESSAGES.TIME_REQUIRED);
      err.statusCode = 400;
      throw err;
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      const err = new Error(MESSAGES.INVALID_DATE);
      err.statusCode = 400;
      throw err;
    }

    if (end.isBefore(start) || end.isSame(start)) {
      const err = new Error(MESSAGES.END_DATE_AFTER_START);
      err.statusCode = 400;
      throw err;
    }

    if (start.isBefore(dayjs())) {
      const err = new Error(MESSAGES.START_DATE_CANT_BE_PAST);
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
        const err=new Error(MESSAGES.END_DATE_AFTER_START);
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
