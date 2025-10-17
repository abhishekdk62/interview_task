const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
/**
 * @route   POST /api/profiles
 * @desc    Create a new profile
 * @access  Public
 */
router.post("/", profileController.createProfile);
/**
 * @route   GET /api/profiles
 * @desc    Get all profiles
 * @access  Public
 */
router.get("/", profileController.getAllProfiles);
/**
 * @route   PATCH /api/profiles/:id/timezone
 * @desc    Update profile timezone
 * @access  Public
 */
router.patch("/:id/timezone", profileController.updateProfileTimezone);

module.exports = router;
