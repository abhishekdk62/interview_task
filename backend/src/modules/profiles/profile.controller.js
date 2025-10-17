const profileService = require("./profile.service");
const { successResponse } = require("../../utils/response.util");
const { MESSAGES } = require("../../config/constants");

class ProfileController {
  async createProfile(req, res, next) {
    try {
      const { name } = req.body;
      const profile = await profileService.createProfile(name);
      return successResponse(res, profile, MESSAGES.PROFILE_CREATED, 201);
    } catch (error) {
      next(error);
    }
  }
  async getAllProfiles(req, res, next) {
    try {
      const profiles = await profileService.getAllProfiles();
      return successResponse(res, profiles, MESSAGES.PROFILES_FETCHED);
    } catch (error) {
      next(error);
    }
  }
  async updateProfileTimezone(req, res, next) {
    try {
      const { id } = req.params;
      const { timezone } = req.body;
      const profile = await profileService.updateProfileTimezone(id, timezone);
      return successResponse(res, profile, MESSAGES.PROFILE_UPDATED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
