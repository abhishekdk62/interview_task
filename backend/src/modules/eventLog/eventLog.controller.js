const { successResponse } = require('../../utils/response.util');
const { MESSAGES } = require('../../config/constants');

class EventLogController {
  constructor(eventLogService)
  {
    this.eventLogService=eventLogService
  }
  async getEventLogs(req, res, next) {
    try {
      const { eventId } = req.params;
      const logs = await this.eventLogService.getEventLogs(eventId);
      return successResponse(res, logs, MESSAGES.LOGS_FETCHED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports =  EventLogController
