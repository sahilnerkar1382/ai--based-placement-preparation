const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'coding'],
    default: 'multiple-choice'
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topic: {
    type: String,
    required: true
  }
});

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Aptitude', 'Technical', 'Behavioral', 'Mock Interview'],
    required: true
  },
  company: {
    type: String,
    default: ''
  },
  questions: [questionSchema],
  duration: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  results: {
    score: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    percentile: {
      type: Number,
      default: 0
    },
    timeTaken: {
      type: Number,
      default: 0
    },
    topicBreakdown: [{
      topic: String,
      score: Number,
      totalQuestions: Number,
      correctAnswers: Number
    }]
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Abandoned'],
    default: 'Not Started'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
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

testSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Test', testSchema);
