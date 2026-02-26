const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Venue = require('./models/Venue');

dotenv.config();

// Sample venues data
const venues = [
  {
    name: "The Cozy Corner Cafe",
    description: "A warm and inviting cafe perfect for quiet conversations and comfortable moments.",
    moods: ["lonely", "foodie", "nature"],
    moodScores: {
      lonely: 0.95,
      foodie: 0.75,
      nature: 0.65,
      romantic: 0.55,
      family: 0.45,
      club: 0.2
    },
    category: "cafe",
    address: "123 Main Street",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800"],
    ambiance: {
      lighting: "warm",
      noiseLevel: "quiet",
      seating: "communal",
      outdoorArea: true,
      decor: "rustic"
    },
    priceRange: "$$",
    cuisine: "Coffee & Pastries",
    openingHours: "7:00 AM - 10:00 PM",
    averageRating: 4.5,
    totalReviews: 128
  },
  {
    name: "Sunset Gardens",
    description: "Beautiful botanical gardens with serene walking paths and peaceful meditation areas.",
    moods: ["nature", "lonely", "therapy"],
    moodScores: {
      nature: 0.98,
      lonely: 0.85,
      therapy: 0.9,
      family: 0.7,
      romantic: 0.65,
      club: 0.1
    },
    category: "park",
    address: "456 Garden Avenue",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800"],
    ambiance: {
      lighting: "natural",
      noiseLevel: "quiet",
      seating: "communal",
      outdoorArea: true,
      decor: "natural"
    },
    priceRange: "$",
    openingHours: "6:00 AM - 8:00 PM",
    averageRating: 4.8,
    totalReviews: 256
  },
  {
    name: "Le Petit Romance",
    description: "An intimate French restaurant perfect for romantic dinners and special occasions.",
    moods: ["romantic", "foodie"],
    moodScores: {
      romantic: 0.95,
      foodie: 0.9,
      family: 0.3,
      club: 0.2,
      nature: 0.3,
      lonely: 0.4
    },
    category: "restaurant",
    address: "789 Love Lane",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"],
    ambiance: {
      lighting: "dim",
      noiseLevel: "quiet",
      seating: "private",
      outdoorArea: false,
      decor: "elegant"
    },
    priceRange: "$$$$",
    cuisine: "French",
    openingHours: "6:00 PM - 11:00 PM",
    averageRating: 4.9,
    totalReviews: 312
  },
  {
    name: "Family Fun Center",
    description: "The ultimate destination for family entertainment with games, food, and fun for all ages.",
    moods: ["family", "club"],
    moodScores: {
      family: 0.95,
      club: 0.7,
      foodie: 0.6,
      nature: 0.3,
      romantic: 0.2,
      lonely: 0.1
    },
    category: "activity",
    address: "321 Fun Street",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1511882150382-421056c89033?w=800"],
    ambiance: {
      lighting: "bright",
      noiseLevel: "loud",
      seating: "communal",
      outdoorArea: true,
      decor: "vibrant"
    },
    priceRange: "$$",
    openingHours: "10:00 AM - 10:00 PM",
    averageRating: 4.3,
    totalReviews: 567
  },
  {
    name: "The Party Palace",
    description: "New York's hottest nightclub featuring top DJs and unforgettable nights.",
    moods: ["club", "motivation"],
    moodScores: {
      club: 0.98,
      motivation: 0.6,
      family: 0.05,
      nature: 0.05,
      lonely: 0.1,
      romantic: 0.3
    },
    category: "club",
    address: "555 Party Avenue",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1571206029886-68b0087f6192?w=800"],
    ambiance: {
      lighting: "dim",
      noiseLevel: "vibrant",
      seating: "communal",
      outdoorArea: false,
      decor: "modern"
    },
    priceRange: "$$$",
    openingHours: "9:00 PM - 4:00 AM",
    averageRating: 4.4,
    totalReviews: 892
  },
  {
    name: "Gourmet Paradise",
    description: "A foodie's dream featuring cuisines from around the world.",
    moods: ["foodie", "family"],
    moodScores: {
      foodie: 0.98,
      family: 0.7,
      romantic: 0.6,
      nature: 0.3,
      club: 0.4,
      lonely: 0.5
    },
    category: "restaurant",
    address: "777 Foodie Boulevard",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"],
    ambiance: {
      lighting: "warm",
      noiseLevel: "moderate",
      seating: "mixed",
      outdoorArea: true,
      decor: "modern"
    },
    priceRange: "$$$",
    cuisine: "International",
    openingHours: "11:00 AM - 11:00 PM",
    averageRating: 4.7,
    totalReviews: 445
  },
  {
    name: "Tranquil Wellness Center",
    description: "A peaceful sanctuary for relaxation, meditation, and healing.",
    moods: ["therapy", "nature", "lonely"],
    moodScores: {
      therapy: 0.98,
      nature: 0.8,
      lonely: 0.85,
      family: 0.4,
      romantic: 0.5,
      club: 0.05
    },
    category: "other",
    address: "999 Peace Lane",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800"],
    ambiance: {
      lighting: "dim",
      noiseLevel: "quiet",
      seating: "private",
      outdoorArea: true,
      decor: "minimalist"
    },
    priceRange: "$$$$",
    openingHours: "8:00 AM - 8:00 PM",
    averageRating: 4.9,
    totalReviews: 178
  },
  {
    name: "Fitness Forge Gym",
    description: "State-of-the-art fitness facility with personal training and group classes.",
    moods: ["gym", "motivation"],
    moodScores: {
      gym: 0.98,
      motivation: 0.95,
      family: 0.3,
      club: 0.4,
      nature: 0.2,
      lonely: 0.3
    },
    category: "activity",
    address: "888 Strength Street",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"],
    ambiance: {
      lighting: "bright",
      noiseLevel: "moderate",
      seating: "communal",
      outdoorArea: false,
      decor: "modern"
    },
    priceRange: "$$$",
    openingHours: "24 Hours",
    averageRating: 4.6,
    totalReviews: 623
  },
  {
    name: "Book Haven Library",
    description: "A quiet haven for readers and students seeking knowledge and tranquility.",
    moods: ["library", "lonely", "motivation"],
    moodScores: {
      library: 0.98,
      lonely: 0.9,
      motivation: 0.7,
      family: 0.3,
      romantic: 0.2,
      club: 0.05
    },
    category: "other",
    address: "111 Scholar Way",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800"],
    ambiance: {
      lighting: "warm",
      noiseLevel: "quiet",
      seating: "private",
      outdoorArea: false,
      decor: "classic"
    },
    priceRange: "$",
    openingHours: "9:00 AM - 9:00 PM",
    averageRating: 4.8,
    totalReviews: 234
  },
  {
    name: "CineMax Theater",
    description: "Premium cinema experience with the latest blockbusters and indie films.",
    moods: ["movies", "family", "romantic"],
    moodScores: {
      movies: 0.98,
      family: 0.7,
      romantic: 0.75,
      club: 0.3,
      nature: 0.1,
      lonely: 0.4
    },
    category: "activity",
    address: "444 Cinema Street",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"],
    ambiance: {
      lighting: "dim",
      noiseLevel: "quiet",
      seating: "private",
      outdoorArea: false,
      decor: "modern"
    },
    priceRange: "$$",
    openingHours: "10:00 AM - 12:00 AM",
    averageRating: 4.5,
    totalReviews: 1023
  },
  {
    name: "Elite Shopping Plaza",
    description: "Luxury shopping destination with premium brands and designer stores.",
    moods: ["shopping", "family"],
    moodScores: {
      shopping: 0.98,
      family: 0.6,
      romantic: 0.5,
      club: 0.3,
      nature: 0.2,
      lonely: 0.4
    },
    category: "other",
    address: "222 Luxury Lane",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"],
    ambiance: {
      lighting: "bright",
      noiseLevel: "moderate",
      seating: "communal",
      outdoorArea: false,
      decor: "elegant"
    },
    priceRange: "$$$$",
    openingHours: "10:00 AM - 9:00 PM",
    averageRating: 4.6,
    totalReviews: 789
  },
  {
    name: "Inspire Coworking Space",
    description: "Modern workspace designed for productivity and creative collaboration.",
    moods: ["motivation", "library"],
    moodScores: {
      motivation: 0.95,
      library: 0.8,
      lonely: 0.6,
      family: 0.2,
      romantic: 0.1,
      club: 0.3
    },
    category: "cafe",
    address: "666 Productivity Plaza",
    city: "New York",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    ambiance: {
      lighting: "bright",
      noiseLevel: "moderate",
      seating: "communal",
      outdoorArea: true,
      decor: "modern"
    },
    priceRange: "$$",
    cuisine: "Coffee & Work",
    openingHours: "6:00 AM - 10:00 PM",
    averageRating: 4.7,
    totalReviews: 345
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      console.error('Please set MONGO_URI in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing venues
    await Venue.deleteMany({});

    // Insert new venues
    await Venue.insertMany(venues);
    console.log(`Successfully seeded ${venues.length} venues`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
