const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({ interviews });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const interviewData = {
      ...req.body,
      user: req.user.userId
    };
    
    const interview = new Interview(interviewData);
    await interview.save();
    
    res.status(201).json({
      message: 'Interview added successfully',
      interview
    });
  } catch (error) {
    console.error('Add interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json({ interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json({
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    interview.notes.push({ content });
    await interview.save();
    
    res.status(201).json({
      message: 'Note added successfully',
      notes: interview.notes
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
