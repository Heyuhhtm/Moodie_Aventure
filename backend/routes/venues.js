const express = require('express');
const router = express.Router();
const {
  getVenues,
  getVenuesByMood,
  getVenueById,
  createVenue,
  getCities,
} = require('../controllers/venueController');
const { protect } = require('../middleware/auth');

// GET /api/venues/cities
router.get('/cities', getCities);

// GET /api/venues/mood/:mood  ← Core DilJourney route
router.get('/mood/:mood', getVenuesByMood);

// GET /api/venues
router.get('/', getVenues);

// GET /api/venues/:id
router.get('/:id', getVenueById);

// POST /api/venues  (protected - admin use)
router.post('/', protect, createVenue);

module.exports = router;
