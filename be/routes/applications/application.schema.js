const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now().toString()
  }
});

module.exports = Application = mongoose.model('application', ApplicationSchema);