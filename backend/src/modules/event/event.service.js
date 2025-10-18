const { MESSAGES } = require("../../config/constants");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

class EventService {
  constructor(eventRepository, profileRepository, eventLogService) {
    this.eventRepository = eventRepository;
    this.profileRepository = profileRepository;
    this.eventLogService = eventLogService;
  }
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

  const start = dayjs.utc(startDate);
  const end = dayjs.utc(endDate);

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

  if (start.isBefore(dayjs.utc())) {
    const err = new Error(MESSAGES.START_DATE_CANT_BE_PAST);
    err.statusCode = 400;
    throw err;
  }

  return await this.eventRepository.create({
    profiles,
    timezone, 
    startDate: start.toDate(), 
    endDate: end.toDate(), 
  });
}


  async getEventsByProfile(profileId) {
    return await this.eventRepository.findByProfileId(profileId);
  }

  async updateEvent(id, updateData) {
    const existingEvent = await this.eventRepository.findById(id);

    if (!existingEvent) {
      const error = new Error(MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = 404;
      throw error;
    }
    if (updateData.startDate || updateData.endDate) {
      const start = dayjs(updateData.startDate || existingEvent.startDate);
      const end = dayjs(updateData.endDate || existingEvent.endDate);
      if (end.isBefore(start) || end.isSame(start)) {
        const err = new Error(MESSAGES.END_DATE_AFTER_START);
        err.statusCode = 400;
        throw err;
      }
    }
    let profileNames = [];
    if (updateData.profiles) {
      const profiles = await Promise.all(
        updateData.profiles.map((id) => this.profileRepository.findById(id))
      );
      profileNames = profiles.map((p) => p.name);
    }

    await this.eventLogService.createLogsForUpdate(
      existingEvent,
      updateData,
      profileNames
    );

    return await this.eventRepository.update(id, updateData);
  }
}

module.exports = EventService
