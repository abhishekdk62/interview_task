const { MESSAGES } = require("../../config/constants");

class EventLogService {
  constructor(eventLogRepository)
  {
    this.eventLogRepository=eventLogRepository
  }
  async createLogsForUpdate(existingEvent, updateData, profileNames) {
    const logs = [];
    if (updateData.timezone && updateData.timezone !== existingEvent.timezone) {
      logs.push({
        eventId: existingEvent._id,
        message: MESSAGES.TIMEZONE_UPDATED,
      });
    }
    if (updateData.profiles) {
      const oldIds = existingEvent.profiles.map((p) => p._id.toString()).sort();
      const newIds = updateData.profiles.map((p) => p.toString()).sort();
      if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
        const names =
          profileNames && profileNames.length > 0
            ? profileNames.join(", ")
            : "updated profiles";

        logs.push({
          eventId: existingEvent._id,
          message: MESSAGES.PROFILES_CHANGED + names,
        });
      }
    }
    if (updateData.startDate) {
      const oldDate = existingEvent.startDate.toISOString();
      const newDate = new Date(updateData.startDate).toISOString();

      if (oldDate !== newDate) {
        logs.push({
          eventId: existingEvent._id,
          message: MESSAGES.START_TIME_UPDATED,
        });
      }
    }
    if (updateData.endDate) {
      const oldDate = existingEvent.endDate.toISOString();
      const newDate = new Date(updateData.endDate).toISOString();

      if (oldDate !== newDate) {
        logs.push({
          eventId: existingEvent._id,
          message: MESSAGES.END_TIME_UPDATED,
        });
      }
    }
    if (logs.length > 0) {
      await Promise.all(logs.map((log) => this.eventLogRepository.create(log)));
    }

    return logs;
  }

  async getEventLogs(eventId) {
    return await this.eventLogRepository.findByEventId(eventId);
  }
}

module.exports =  EventLogService
