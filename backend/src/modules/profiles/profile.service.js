const { MESSAGES } = require("../../config/constants");

class ProfileService {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }
  async createProfile(name) {
    let trimmedName = name.trim();
    if (!name || name.trim() === "") {
      const err = new Error(MESSAGES.PROFILE_NAME_REQUIRED);
      err.statusCode = 400;
      throw err;
    }
let nameRegex = /^[A-Za-z]{2}[A-Za-z0-9\s]*$/;
    if (!nameRegex.test(trimmedName)) {
      const error = new Error(MESSAGES.PROFILE_NAME_NOT_VALID);
      error.statusCode = 400;
      throw error;
    }
    if (trimmedName.length < 2) {
      const error = new Error(MESSAGES.PROFILE_NAME_TOO_SMALL);
      error.statusCode = 400;
      throw error;
    }

    const existingProfile = await this.profileRepository.findByName(
      trimmedName
    );
    if (existingProfile) {
      const error = new Error(MESSAGES.PROFILE_NAME_EXISTS);
      error.statusCode = 400;
      throw error;
    }
    return await this.profileRepository.create({ name });
  }
  async getAllProfiles(name) {
    return await this.profileRepository.findAll(name);
  }
  async updateProfileTimezone(id, timezone) {
    if (!timezone || timezone.trim() === "") {
      const err = new Error(MESSAGES.TIMEZONE_REQUIRED);
      err.statusCode = 400;
      throw err;
    }
    const profile = await this.profileRepository.updateTimezone(id, timezone);
    if (!profile) {
      const error = new Error(MESSAGES.PROFILE_NOT_FOUND);
      error.statusCode = 404;
      throw error;
    }
    return profile;
  }
}

module.exports = ProfileService;
