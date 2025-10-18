const { MESSAGES } = require("../../config/constants");

class EventLogService {
  constructor(eventLogRepository) {
    this.eventLogRepository = eventLogRepository;
  }
  async createLogsForUpdate(existingEvent, updateData, profileNames) {
    const logs = [];

    if (updateData.timezone && updateData.timezone !== existingEvent.timezone) {
      logs.push({
        eventId: existingEvent._id,
        message: `Timezone changed from "${existingEvent.timezone}" to "${updateData.timezone}"`,
        metadata: {
          field: "timezone",
          oldValue: existingEvent.timezone,
          newValue: updateData.timezone,
        },
      });
    }

    if (updateData.profiles) {
      const oldIds = existingEvent.profiles.map((p) => p._id.toString()).sort();
      const newIds = updateData.profiles.map((p) => p.toString()).sort();

      if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
        const oldProfileNames = existingEvent.profiles
          .map((p) => p.name || p._id.toString())
          .join(", ");

        const newProfileNames =
          profileNames && profileNames.length > 0
            ? profileNames.join(", ")
            : "updated profiles";

        logs.push({
          eventId: existingEvent._id,
          message: `Profiles changed from "${oldProfileNames}" to "${newProfileNames}"`,
          metadata: {
            field: "profiles",
            oldValue: oldProfileNames,
            newValue: newProfileNames,
          },
        });
      }
    }

    if (updateData.startDate) {
      const oldDate = existingEvent.startDate.toISOString();
      const newDate = new Date(updateData.startDate).toISOString();

      if (oldDate !== newDate) {
        const oldFormatted = this.formatDateTime(
          existingEvent.startDate,
          existingEvent.timezone
        );
        const newFormatted = this.formatDateTime(
          new Date(updateData.startDate),
          updateData.timezone || existingEvent.timezone
        );

        logs.push({
          eventId: existingEvent._id,
          message: `Start time changed from "${oldFormatted}" to "${newFormatted}"`,
          metadata: {
            field: "startDate",
            oldValue: oldDate,
            newValue: newDate,
          },
        });
      }
    }

    if (updateData.endDate) {
      const oldDate = existingEvent.endDate.toISOString();
      const newDate = new Date(updateData.endDate).toISOString();

      if (oldDate !== newDate) {
        const oldFormatted = this.formatDateTime(
          existingEvent.endDate,
          existingEvent.timezone
        );
        const newFormatted = this.formatDateTime(
          new Date(updateData.endDate),
          updateData.timezone || existingEvent.timezone
        );

        logs.push({
          eventId: existingEvent._id,
          message: `End time changed from "${oldFormatted}" to "${newFormatted}"`,
          metadata: {
            field: "endDate",
            oldValue: oldDate,
            newValue: newDate,
          },
        });
      }
    }

    if (logs.length > 0) {
      await Promise.all(logs.map((log) => this.eventLogRepository.create(log)));
    }

    return logs;
  }

  formatDateTime(date, timezone) {
    const options = {
      timeZone: timezone || "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  }

  async getEventLogs(eventId) {
    return await this.eventLogRepository.findByEventId(eventId);
  }
}

module.exports = EventLogService;
