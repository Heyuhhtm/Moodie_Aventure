 const Venue = require('../models/Venue');

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/venues
// @desc    Get all venues (with filters)
// @access  Public
// Query params: mood, city, category, priceRange, page, limit
// ─────────────────────────────────────────────────────────────────
exports.getVenues = async (req, res) => {
  try {
    const { mood, city, category, priceRange, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (mood)       query.moods = mood.toLowerCase();
    if (city)       query.city = { $regex: city, $options: 'i' };
    if (category)   query.category = category;
    if (priceRange) query.priceRange = priceRange;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [venues, total] = await Promise.all([
      Venue.find(query)
        .sort({ averageRating: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Venue.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: venues.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      venues,
    });
  } catch (error) {
    console.error('getVenues error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/venues/mood/:mood
// @desc    Get venues by mood (core DilJourney feature)
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.getVenuesByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const { city, limit = 12 } = req.query;

    const validMoods = ['family', 'foodie', 'romantic', 'nature', 'lonely', 'club', 'motivation', 'movies', 'library', 'therapy', 'gym', 'shopping'];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid mood. Choose from: ${validMoods.join(', ')}`,
      });
    }

    const query = {
      isActive: true,
      moods: mood.toLowerCase(),
      [`moodScores.${mood.toLowerCase()}`]: { $gte: 0.7 },
    };

    if (city) query.city = { $regex: city, $options: 'i' };

    // Sort by mood affinity score then by rating
    const venues = await Venue.find(query)
      .sort({ [`moodScores.${mood.toLowerCase()}`]: -1, averageRating: -1 })
      .limit(parseInt(limit));

    // Attach activity & seeking guide for this mood
    const moodGuides = getMoodGuide(mood.toLowerCase());

    res.status(200).json({
      success: true,
      mood: mood.toLowerCase(),
      guide: moodGuides,
      count: venues.length,
      venues,
    });
  } catch (error) {
    console.error('getVenuesByMood error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/venues/:id
// @desc    Get single venue by ID
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue || !venue.isActive) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }
    res.status(200).json({ success: true, venue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   POST /api/venues
// @desc    Create a new venue (Admin use)
// @access  Private
// ─────────────────────────────────────────────────────────────────
exports.createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ success: true, venue });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @route   GET /api/venues/cities
// @desc    Get list of all available cities
// @access  Public
// ─────────────────────────────────────────────────────────────────
exports.getCities = async (req, res) => {
  try {
    const cities = await Venue.distinct('city', { isActive: true });
    res.status(200).json({ success: true, cities: cities.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────────
// Helper: Get mood-specific activity & seeking guide
// ─────────────────────────────────────────────────────────────────
const getMoodGuide = (mood) => {
  const guides = {
    family: {
      title: 'Family Mode 👨‍👩‍👧‍👦',
      whatToDo: 'Engage in group activities, share a big meal, let the kids lead some choices, play games together.',
      whatToSeek: 'Look for shared laughter, child-friendly menus, open spaces, and moments that create memories.',
    },
    foodie: {
      title: 'Foodie Mode 🍕',
      whatToDo: 'Ask about the chef\'s specials, explore unfamiliar dishes, try the tasting menu, photograph the presentation.',
      whatToSeek: 'Seek authentic flavors, unique ingredients, the story behind each dish, and a menu that surprises you.',
    },
    romantic: {
      title: 'Romantic Mode 💕',
      whatToDo: 'Order sharing plates, linger over dessert, take a walk after dinner, put your phone away.',
      whatToSeek: 'Look for dim lighting, quiet corners, a view, and conversation that goes deeper than usual.',
    },
    nature: {
      title: 'Nature Mode 🌿',
      whatToDo: 'Walk slowly, breathe deeply, observe your surroundings, unplug from your phone for at least 20 minutes.',
      whatToSeek: 'Seek stillness, the sound of wind or water, green spaces, and the feeling of mental restoration.',
    },
    lonely: {
      title: 'Comfort Mode 😔',
      whatToDo: 'Settle into a cozy corner, order something warm, journal or read, allow yourself to simply be.',
      whatToSeek: 'Look for warmth, a welcoming atmosphere, comfort food, and the quiet companionship of a busy but unhurried place.',
    },
    club: {
      title: 'Club Mode 🎉',
      whatToDo: 'Dance, explore the cocktail menu, start conversations with strangers, let go of the plan.',
      whatToSeek: 'Seek high energy, great music, spontaneous connections, and the feeling of being fully alive in the moment.',
    },
  };
  return guides[mood] || {};
};
