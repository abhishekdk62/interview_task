const Profile = require("./profile.model");

class ProfileRepository {
  async create(profileData) {
    const profile = new Profile(profileData);
    return await profile.save();
  }
  async findAll(name) {
    let query={}
    if (name) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escapedName, $options: "i" };
    }

    return await Profile.find(query).sort({ createdAt: -1 });
  }
  async findByName(name) {
    return await Profile.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
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

module.exports = ProfileRepository;
