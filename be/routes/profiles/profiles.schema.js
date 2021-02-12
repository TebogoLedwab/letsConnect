const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
  },
  skills: [
    {
      skill: {
        type: String,
        required: true,
      },
      scale: {
        type: Number,
        required: true,
      },
    },
  ],
  interests: [String],
  bio: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  experience: [
    {
      title: {
        type: String,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  notifications: [
    {
      notificationType: {
        type: String,
        required: true,
      },
      postId: {
        type: String,
        required: false,
      },
      notification: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now().toString(),
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
