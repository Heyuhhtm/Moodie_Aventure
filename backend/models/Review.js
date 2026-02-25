const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    // The mood the user was in during the visit
    mood: {
      type: String,
      enum: ['family', 'foodie', 'romantic', 'nature', 'lonely', 'club'],
      required: [true, 'Please select your mood during the visit'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    // Did this venue match the mood?
    moodMatch: {
      type: Boolean,
      required: [true, 'Please indicate if the venue matched your mood'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per venue
reviewSchema.index({ user: 1, venue: 1 }, { unique: true });

// ─── Update venue's averageRating after save ───────
reviewSchema.statics.calcAverageRating = async function (venueId) {
  const stats = await this.aggregate([
    { $match: { venue: venueId } },
    {
      $group: {
        _id: '$venue',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const Venue = require('./Venue');
  if (stats.length > 0) {
    await Venue.findByIdAndUpdate(venueId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  } else {
    await Venue.findByIdAndUpdate(venueId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.venue);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.venue);
});

module.exports = mongoose.model('Review', reviewSchema);
