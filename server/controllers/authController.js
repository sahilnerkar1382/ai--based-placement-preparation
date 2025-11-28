const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, profile } = req.body;
      
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (profile) {
        user.profile = { ...user.profile, ...profile };
      }

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          stats: user.stats
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;
