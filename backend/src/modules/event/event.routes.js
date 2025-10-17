const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/profile/:profileId', eventController.getEventsByProfile);
router.put('/:id', eventController.updateEvent);

module.exports = router;
