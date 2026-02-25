const express = require('express');
const router = express.Router();
const {
  getVenueReviews,
  getVenueReviewSummary,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// GET  /api/reviews/venue/:venueId
router.get('/venue/:venueId', getVenueReviews);

// GET  /api/reviews/venue/:venueId/summary
router.get('/venue/:venueId/summary', getVenueReviewSummary);

// POST /api/reviews/venue/:venueId
router.post('/venue/:venueId', protect, addReview);

// PUT  /api/reviews/:reviewId
router.put('/:reviewId', protect, updateReview);

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
