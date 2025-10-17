const express = require("express");

module.exports = (profileController) => {
  const router = express.Router();

  /**
   * @route   POST /api/profiles
   * @desc    Create a new profile
   * @access  Public
   * @body    { name: string }
   */
  router.post("/", (req, res, next) => 
    profileController.createProfile(req, res, next)
  );

  /**
   * @route   GET /api/profiles
   * @desc    Get all profiles
   * @access  Public
   */
  router.get("/", (req, res, next) => 
    profileController.getAllProfiles(req, res, next)
  );

  /**
   * @route   PATCH /api/profiles/:id/timezone
   * @desc    Update profile timezone
   * @access  Public
   * @params  id - Profile ID
   * @body    { timezone: string }
   */
  router.patch("/:id/timezone", (req, res, next) => 
    profileController.updateProfileTimezone(req, res, next)
  );

  return router;
};
