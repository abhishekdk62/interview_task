const profileRepository = require("./profile.repository");
const { MESSAGES } = require("../../config/constants");

class ProfileService {
  constructor (private readonly)
  {

  }
  async createProfile(name) {
    if (!name || name.trim() === "") {
      const err = new Error(MESSAGES.PROFILE_NAME_REQUIRED);
      err.statusCode = 400;
      throw err;
    }
    const existingProfile = await profileRepository.findByName(name);
    if (existingProfile) {
      const error = new Error(MESSAGES.PROFILE_NAME_EXISTS);
      error.statusCode = 400;
      throw error;
    }

    return await profileRepository.create({ name: name.trim() });
  }
  async getAllProfiles() {
    return await profileRepository.findAll();
  }
  async updateProfileTimezone(id, timezone) {
    if (!timezone || timezone.trim() === "") {
      const err = new Error(MESSAGES.TIMEZONE_REQUIRED);
      err.statusCode = 400;
      throw err;
    }
    const profile = await profileRepository.updateTimezone(id, timezone);
    if (!profile) {
      const error = new Error(MESSAGES.PROFILE_NOT_FOUND);
      error.statusCode = 404;
      throw error;
    }
    return profile;
  }
}

module.exports = new ProfileService();
