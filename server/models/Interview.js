const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      default: ''
    }
  },
  position: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Intern', 'Full-time', 'Contract'],
      default: 'Full-time'
    },
    level: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior'],
      default: 'Entry'
    }
  },
  details: {
    date: {
      type: Date,
      required: true
    },
    package: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      enum: ['On-campus', 'Off-campus', 'Remote'],
      default: 'On-campus'
    }
  },
  status: {
    type: String,
    enum: ['Applied', 'OA', 'Technical Round', 'Behavioral Round', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  rounds: [{
    type: {
      type: String,
      enum: ['Aptitude', 'Technical', 'Behavioral', 'System Design', 'HR']
    },
    date: Date,
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Scheduled', 'Cancelled'],
      default: 'Pending'
    },
    feedback: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  topics: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Core', 'Important', 'Optional'],
      default: 'Important'
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

interviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Interview', interviewSchema);
