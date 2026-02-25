const Review = require('../models/Review');
const Venue = require('../models/Venue');

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/reviews/venue/:venueId
// @desc    Get all reviews for a venue (optionally filter by mood)
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.getVenueReviews = async (req, res) => {
  try {
    const { mood, page = 1, limit = 10 } = req.query;

    const query = { venue: req.params.venueId };
    if (mood) query.mood = mood.toLowerCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/reviews/venue/:venueId
// @desc    Add a review for a venue
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.addReview = async (req, res) => {
  try {
    const { mood, rating, moodMatch, title, body, visitDate } = req.body;

    // Check venue exists
    const venue = await Venue.findById(req.params.venueId);
    if (!venue || !venue.isActive) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    // Check if user already reviewed this venue
    const existing = await Review.findOne({
      user: req.user.id,
      venue: req.params.venueId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this venue. You can edit your existing review.',
      });
    }

    const review = await Review.create({
      user: req.user.id,
      venue: req.params.venueId,
      mood,
      rating,
      moodMatch,
      title,
      body,
      visitDate,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Make sure the review belongs to the logged-in user
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this review.',
      });
    }

    const { rating, moodMatch, title, body } = req.body;
    const updates = {};
    if (rating !== undefined)    updates.rating = rating;
    if (moodMatch !== undefined) updates.moodMatch = moodMatch;
    if (title !== undefined)     updates.title = title;
    if (body !== undefined)      updates.body = body;

    review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    // Recalculate venue rating
    await Review.calcAverageRating(review.venue);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    const venueId = review.venue;
    await review.deleteOne();
    await Review.calcAverageRating(venueId);

    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/reviews/venue/:venueId/summary
// @desc    Get review summary for a venue (per mood breakdown)
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.getVenueReviewSummary = async (req, res) => {
  try {
    const summary = await Review.aggregate([
      { $match: { venue: require('mongoose').Types.ObjectId.createFromHexString(req.params.venueId) } },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          moodMatchCount: { $sum: { $cond: ['$moodMatch', 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
