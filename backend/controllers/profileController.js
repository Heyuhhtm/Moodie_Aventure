const User = require('../models/User');
const Review = require('../models/Review');

// ─────────────────────────────────────────────────────────────────
// @route   PUT /api/profile/update
// @desc    Update user profile
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, city, avatar, favoriteMoods } = req.body;

    const updatedFields = {};
    if (name)          updatedFields.name = name;
    if (bio !== undefined) updatedFields.bio = bio;
    if (city !== undefined) updatedFields.city = city;
    if (avatar)        updatedFields.avatar = avatar;
    if (favoriteMoods) updatedFields.favoriteMoods = favoriteMoods;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   PUT /api/profile/change-password
// @desc    Change user password
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/profile/save-venue/:venueId
// @desc    Save (bookmark) a venue
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.saveVenue = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const alreadySaved = user.savedVenues.includes(req.params.venueId);
    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'Venue already saved.',
      });
    }

    user.savedVenues.push(req.params.venueId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Venue saved successfully.',
      savedVenues: user.savedVenues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   DELETE /api/profile/save-venue/:venueId
// @desc    Remove a saved venue
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.removeSavedVenue = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.savedVenues = user.savedVenues.filter(
      (id) => id.toString() !== req.params.venueId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Venue removed from saved.',
      savedVenues: user.savedVenues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/profile/saved-venues
// @desc    Get all saved venues for the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.getSavedVenues = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedVenues',
      match: { isActive: true },
      select: 'name category city moods averageRating totalReviews images priceRange ambiance',
    });

    res.status(200).json({
      success: true,
      count: user.savedVenues.length,
      savedVenues: user.savedVenues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/profile/my-reviews
// @desc    Get all reviews written by the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('venue', 'name category city')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
