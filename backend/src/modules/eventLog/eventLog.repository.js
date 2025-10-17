const EventLog = require('./eventLog.model');

class EventLogRepository {
  async create(logData) {
    const log = new EventLog(logData);
    return await log.save();
  }

  async findByEventId(eventId) {
    return await EventLog.find({ eventId })
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });
  }
}

module.exports =  EventLogRepository
