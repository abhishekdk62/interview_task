const eventLogService = require('./eventLog.service');
const { successResponse } = require('../../utils/response.util');
const { MESSAGES } = require('../../config/constants');

class EventLogController {
  async getEventLogs(req, res, next) {
    try {
      const { eventId } = req.params;
      const logs = await eventLogService.getEventLogs(eventId);
      return successResponse(res, logs, MESSAGES.LOGS_FETCHED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventLogController();
