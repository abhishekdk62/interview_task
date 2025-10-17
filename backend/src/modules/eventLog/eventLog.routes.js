const express = require('express');
const router = express.Router();
const eventLogController = require('./eventLog.controller');

/**
 * @route GET /api/event/:eventId
 * @desc Get all the event logs by event id
 * @access Public
 */
router.get('/event/:eventId', eventLogController.getEventLogs);

module.exports = router;
