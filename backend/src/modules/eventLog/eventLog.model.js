const mongoose = require("mongoose");
const eventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    field: String,        
    oldValue: String, 
    newValue: String 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports= mongoose.model('EventLog', eventLogSchema);
