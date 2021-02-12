const mongoose = require('mongoose');

const CohortsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  internNumber: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },

});

module.exports = User = mongoose.model('cohort', CohortsSchema);