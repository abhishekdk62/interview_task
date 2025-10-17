const express = require('express');
const router = express.Router();
const profileRoutes = require('../modules/profile/profile.routes');
const eventRoutes = require('../modules/event/event.routes');
const eventLogRoutes = require('../modules/eventLog/eventLog.routes');
router.use('/profiles', profileRoutes);
router.use('/events', eventRoutes);
router.use('/logs', eventLogRoutes);

module.exports = router;
