const express = require('express');

module.exports = (eventController) => {
  const router = express.Router();

  /**
   * @route   POST /api/events
   * @desc    Create a new event
   * @access  Public
   * @body    { profiles: string[], timezone: string, startDate: Date, endDate: Date }
   */
  router.post('/', (req, res, next) => 
    eventController.createEvent(req, res, next)
  );

  /**
   * @route   GET /api/events/profile/:profileId
   * @desc    Get events by profile ID
   * @access  Public
   * @params  profileId - Profile ID
   */
  router.get('/profile/:profileId', (req, res, next) => 
    eventController.getEventsByProfile(req, res, next)
  );

  /**
   * @route   PUT /api/events/:id
   * @desc    Update event by event ID
   * @access  Public
   * @params  id - Event ID
   * @body    { profiles?: string[], timezone?: string, startDate?: Date, endDate?: Date }
   */
  router.put('/:id', (req, res, next) => 
    eventController.updateEvent(req, res, next)
  );

  return router;
};
