const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    skills: [{
      type: String
    }],
    experience: {
      type: String,
      default: ''
    }
  },
  stats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    completedTests: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
