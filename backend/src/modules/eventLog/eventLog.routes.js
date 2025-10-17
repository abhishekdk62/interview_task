const express = require('express');

module.exports = (eventLogController) => {
  const router = express.Router();

  /**
   * @route   GET /api/logs/event/:eventId
   * @desc    Get all event logs by event ID
   * @access  Public
   * @params  eventId - Event ID
   */
  router.get('/event/:eventId', (req, res, next) => 
    eventLogController.getEventLogs(req, res, next)
  );

  return router;
};
