const express = require("express");
const corsMiddleware = require("./middlewares/cors.middleware");
const errorHandler = require("./middlewares/errorHandler");
const ProfileService = require("./modules/profiles/profile.service");
const EventLogService = require("./modules/eventLog/eventLog.service");
const EventService = require("./modules/event/event.service");
const ProfileController = require("./modules/profiles/profile.controller");
const EventController = require("./modules/event/event.controller");
const EventLogController = require("./modules/eventLog/eventLog.controller");
const EventRepository = require("./modules/event/event.repository");
const ProfileRepository = require("./modules/profiles/profile.repository");
const EventLogRepository = require("./modules/eventLog/eventLog.repository");
const profileRoutes = require("./modules/profiles/profile.routes");
const eventRoutes = require("./modules/event/event.routes");
const eventLogRoutes = require("./modules/eventLog/eventLog.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

const profileRepository = new ProfileRepository();
const eventRepository = new EventRepository();
const eventLogRepository = new EventLogRepository();

const profileService = new ProfileService(profileRepository);
const eventLogService = new EventLogService(eventLogRepository);
const eventService = new EventService(
  eventRepository,
  profileRepository,
  eventLogService
);
const profileController = new ProfileController(profileService);
const eventController = new EventController(eventService);
const eventLogController = new EventLogController(eventLogService);

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get("/health", (req, res) => {
  res.sendStatus(200);
});


app.use("/api/profiles", profileRoutes(profileController));
app.use("/api/events", eventRoutes(eventController));
app.use("/api/logs", eventLogRoutes(eventLogController));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);
module.exports = app;
