const Event = require("./event.model");

class EventRepository {
  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async findByProfileId(profileId) {
    return await Event.find({ profiles: profileId })
      .populate("profiles", "name timezone")
      .sort({ startDate: 1 });
  }

  async update(id, updateData) {
    return await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("profiles", "name timezone");
  }
}

module.exports = EventRepository
