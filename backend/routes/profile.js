const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  saveVenue,
  removeSavedVenue,
  getSavedVenues,
  getMyReviews,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// All profile routes are protected
router.use(protect);

// PUT /api/profile/update
router.put('/update', updateProfile);

// PUT /api/profile/change-password
router.put('/change-password', changePassword);

// GET /api/profile/saved-venues
router.get('/saved-venues', getSavedVenues);

// POST /api/profile/save-venue/:venueId
router.post('/save-venue/:venueId', saveVenue);

// DELETE /api/profile/save-venue/:venueId
router.delete('/save-venue/:venueId', removeSavedVenue);

// GET /api/profile/my-reviews
router.get('/my-reviews', getMyReviews);

module.exports = router;
