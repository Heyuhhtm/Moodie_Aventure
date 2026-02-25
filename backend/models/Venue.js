const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    // Which moods this venue is suitable for
    moods: {
      type: [String],
      enum: ['family', 'foodie', 'romantic', 'nature', 'lonely', 'club', 'motivation', 'movies', 'library', 'therapy', 'gym', 'shopping'],
      required: [true, 'At least one mood is required'],
    },
    // Mood affinity scores (0.0 - 1.0)
    moodScores: {
      family:   { type: Number, default: 0, min: 0, max: 1 },
      foodie:   { type: Number, default: 0, min: 0, max: 1 },
      romantic: { type: Number, default: 0, min: 0, max: 1 },
      nature:   { type: Number, default: 0, min: 0, max: 1 },
      lonely:   { type: Number, default: 0, min: 0, max: 1 },
      club:     { type: Number, default: 0, min: 0, max: 1 },
      motivation: { type: Number, default: 0, min: 0, max: 1 },
      movies:   { type: Number, default: 0, min: 0, max: 1 },
      library:  { type: Number, default: 0, min: 0, max: 1 },
      therapy:  { type: Number, default: 0, min: 0, max: 1 },
      gym:      { type: Number, default: 0, min: 0, max: 1 },
      shopping: { type: Number, default: 0, min: 0, max: 1 },
    },
    category: {
      type: String,
      enum: ['restaurant', 'cafe', 'park', 'club', 'bar', 'museum', 'activity', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    images: [{ type: String }],
    // Ambiance Intelligence
    ambiance: {
      lighting:    { type: String, enum: ['dim', 'warm', 'bright', 'natural'], default: 'warm' },
      noiseLevel:  { type: String, enum: ['quiet', 'moderate', 'loud', 'vibrant'], default: 'moderate' },
      seating:     { type: String, enum: ['private', 'communal', 'mixed'], default: 'mixed' },
      outdoorArea: { type: Boolean, default: false },
      decor:       { type: String, enum: ['rustic', 'modern', 'elegant', 'minimalist', 'vibrant'], default: 'modern' },
    },
    // What to Do & What to Seek guidance
    activityGuide: {
      type: String,
      default: '',
    },
    seekingGuide: {
      type: String,
      default: '',
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    cuisine: {
      type: String,
      default: '',
    },
    openingHours: {
      type: String,
      default: '',
    },
    // Computed from reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
venueSchema.index({ location: '2dsphere' });
venueSchema.index({ moods: 1, city: 1 });

module.exports = mongoose.model('Venue', venueSchema);
