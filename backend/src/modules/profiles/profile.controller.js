const { successResponse } = require("../../utils/response.util");
const { MESSAGES } = require("../../config/constants");

class ProfileController {
  constructor(profileService) {
    this.profileService = profileService;
  }
  async createProfile(req, res, next) {
    try {
      const { name } = req.body;
      const profile = await this.profileService.createProfile(name);
      return successResponse(res, profile, MESSAGES.PROFILE_CREATED, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(req, res, next) {
    try {
      const { name } = req.query;
      const profiles = await this.profileService.getAllProfiles(name);
      return successResponse(res, profiles, MESSAGES.PROFILES_FETCHED);
    } catch (error) {
      next(error);
    }
  }
  async updateProfileTimezone(req, res, next) {
    try {
      const { id } = req.params;
      const { timezone } = req.body;
      const profile = await this.profileService.updateProfileTimezone(
        id,
        timezone
      );
      return successResponse(res, profile, MESSAGES.PROFILE_UPDATED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
