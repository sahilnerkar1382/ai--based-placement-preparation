const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = { user: req.user.userId };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const tests = await Test.find(filter)
      .sort({ createdAt: -1 })
      .select('-questions');
    
    res.json({ tests });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const testData = {
      ...req.body,
      user: req.user.userId,
      totalQuestions: req.body.questions?.length || 0,
      maxScore: req.body.questions?.length * 10 || 0
    };
    
    const test = new Test(testData);
    await test.save();
    
    res.status(201).json({
      message: 'Test created successfully',
      test
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json({ test });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/start', auth, async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    if (test.status === 'In Progress') {
      return res.status(400).json({ message: 'Test already in progress' });
    }
    
    test.status = 'In Progress';
    test.startedAt = new Date();
    await test.save();
    
    res.json({
      message: 'Test started successfully',
      test
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    if (test.status !== 'In Progress') {
      return res.status(400).json({ message: 'Test is not in progress' });
    }
    
    let correctAnswers = 0;
    let score = 0;
    const topicBreakdown = {};
    
    test.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        score += 10;
      }
      
      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = {
          topic: question.topic,
          score: 0,
          totalQuestions: 0,
          correctAnswers: 0
        };
      }
      
      topicBreakdown[question.topic].totalQuestions++;
      if (isCorrect) {
        topicBreakdown[question.topic].correctAnswers++;
        topicBreakdown[question.topic].score += 10;
      }
    });
    
    test.results = {
      score,
      maxScore: test.maxScore,
      correctAnswers,
      incorrectAnswers: test.totalQuestions - correctAnswers,
      percentile: Math.floor((score / test.maxScore) * 100),
      timeTaken: timeTaken || (Date.now() - test.startedAt) / 1000,
      topicBreakdown: Object.values(topicBreakdown)
    };
    
    test.status = 'Completed';
    test.completedAt = new Date();
    await test.save();
    
    res.json({
      message: 'Test submitted successfully',
      results: test.results
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
