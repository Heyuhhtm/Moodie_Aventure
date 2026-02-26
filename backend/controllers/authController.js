const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Helper: Generate JWT ──────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Helper: Send token response ──────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      avatar:        user.avatar,
      bio:           user.bio,
      city:          user.city,
      age:           user.age,
      gender:        user.gender,
      preferences:   user.preferences,
      favoriteMoods: user.favoriteMoods,
      savedVenues:   user.savedVenues,
      createdAt:     user.createdAt,
    },
  });
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { name, email, password, age, gender, primaryMood, preferences } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

// Build user data object
    const userData = { name, email, password };
    
    // Add optional fields if provided
    if (age) userData.age = age;
    if (gender) userData.gender = gender;
    if (primaryMood) userData.favoriteMoods = [primaryMood];
    if (preferences && Array.isArray(preferences)) userData.preferences = preferences;

    // Create user
    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { email, password } = req.body;

  try {
    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedVenues', 'name category city moods averageRating');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @desc    Logout (client should discard token)
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
