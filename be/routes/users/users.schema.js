const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  backgroundImage: {
    type: String
  },
  mobile_number: {
    type: String
  },
  gender: {
    type: String
  },
  age: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  confirmed: {
    type: Boolean
  }

});

module.exports = User = mongoose.model('user', UserSchema);