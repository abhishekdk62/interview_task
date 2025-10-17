const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

eventLogSchema.index({ eventId: 1 });

module.exports = mongoose.model('EventLog', eventLogSchema);
