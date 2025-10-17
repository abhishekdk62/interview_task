const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
/**
 * @route POST /api/events
 * @desc Create a new event
 * @access Public
 */
router.post('/', eventController.createEvent);

/**
 * @route GET /api/events
 * @desc Get all events
 * @access Public
 */
router.get('/', eventController.getAllEvents);
/**
 * @route GET /api/profile/:profileId
 * @desc Get events by profile id
 * @access Public
 */
router.get('/profile/:profileId', eventController.getEventsByProfile);
/**
 * @route PUT /api/events/:id
 * @desc Update event by event id
 * @access Public
 */
router.put('/:id', eventController.updateEvent);

module.exports = router;
