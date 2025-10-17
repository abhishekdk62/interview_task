const Profile = require("./profile.model");

class ProfileRepository {
  async create(profileData) {
    const profile = new Profile(profileData);
    return await profile.save();
  }
  async findAll() {
    return await Profile.find().sort({ createdAt: -1 });
  }
  async findByName(name) {
    return await Profile.findOne({ name: name.trim() });
  }
  async findById(id) {
    return await Profile.findById(id);
  }
  async updateTimezone(id, timezone) {
    return await Profile.findByIdAndUpdate(
      id,
      { timezone },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new ProfileRepository();
