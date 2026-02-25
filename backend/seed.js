/**
 * DilJourney - Database Seeder
 * Run with: node seed.js
 * Clear DB:  node seed.js --clear
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Venue = require('./models/Venue');

const sampleVenues = [
  // ─── ROMANTIC ────────────────────────────────────
  {
    name: 'The Rooftop Garden Cafe',
    description: 'A candlelit rooftop cafe with a stunning city view, perfect for intimate evenings.',
    moods: ['romantic', 'lonely'],
    moodScores: { romantic: 0.95, lonely: 0.70, family: 0.2, foodie: 0.6, nature: 0.5, club: 0.1 },
    category: 'cafe',
    address: '12 Sky Lane, Connaught Place',
    city: 'Delhi',
    ambiance: { lighting: 'dim', noiseLevel: 'quiet', seating: 'private', outdoorArea: true, decor: 'elegant' },
    activityGuide: 'Order the sharing platter, linger over dessert, take a slow walk along the rooftop after.',
    seekingGuide: 'Seek deep conversation, the glow of city lights, and the feeling of the world slowing down.',
    priceRange: '$$$',
    cuisine: 'Continental',
    openingHours: '6 PM - 12 AM',
    images: [],
  },
  {
    name: 'Café Mirage',
    description: 'A hidden gem with fairy lights, soft jazz, and an intimate wine menu.',
    moods: ['romantic', 'lonely'],
    moodScores: { romantic: 0.92, lonely: 0.80, family: 0.1, foodie: 0.65, nature: 0.2, club: 0.15 },
    category: 'cafe',
    address: '8 Bandra Reclamation',
    city: 'Mumbai',
    ambiance: { lighting: 'dim', noiseLevel: 'quiet', seating: 'private', outdoorArea: false, decor: 'rustic' },
    activityGuide: 'Put your phones away. Order one thing at a time. Let the conversation lead.',
    seekingGuide: 'Seek warmth, unhurried moments, and the music that fills the silence between words.',
    priceRange: '$$$',
    cuisine: 'French',
    openingHours: '7 PM - 11:30 PM',
    images: [],
  },

  // ─── FOODIE ──────────────────────────────────────
  {
    name: 'Spice Trail Kitchen',
    description: 'An award-winning restaurant exploring regional Indian cuisines you\'ve never tried.',
    moods: ['foodie', 'family'],
    moodScores: { foodie: 0.97, family: 0.75, romantic: 0.4, lonely: 0.3, nature: 0.2, club: 0.1 },
    category: 'restaurant',
    address: '23 Commercial Street',
    city: 'Bangalore',
    ambiance: { lighting: 'bright', noiseLevel: 'moderate', seating: 'communal', outdoorArea: false, decor: 'vibrant' },
    activityGuide: 'Ask the waiter about the dish of the day. Try one thing you\'ve never ordered before.',
    seekingGuide: 'Seek authentic regional flavors, the story behind each ingredient, and a menu that surprises you.',
    priceRange: '$$',
    cuisine: 'Indian Regional',
    openingHours: '12 PM - 10:30 PM',
    images: [],
  },
  {
    name: 'The Market Table',
    description: 'Farm-to-table dining where the menu changes daily based on fresh market produce.',
    moods: ['foodie'],
    moodScores: { foodie: 0.98, family: 0.6, romantic: 0.5, lonely: 0.4, nature: 0.6, club: 0.05 },
    category: 'restaurant',
    address: '5 Old Market Road',
    city: 'Jaipur',
    ambiance: { lighting: 'natural', noiseLevel: 'moderate', seating: 'communal', outdoorArea: true, decor: 'rustic' },
    activityGuide: 'Ask about today\'s special. Watch the open kitchen. Let the chef recommend the pairing.',
    seekingGuide: 'Seek freshness, seasonality, honest cooking — food that tastes like someone cared.',
    priceRange: '$$',
    cuisine: 'Contemporary Indian',
    openingHours: '11 AM - 9 PM',
    images: [],
  },

  // ─── FAMILY ──────────────────────────────────────
  {
    name: 'Wonder World Play Cafe',
    description: 'A large family cafe with a play zone, group dining, and activities for all ages.',
    moods: ['family'],
    moodScores: { family: 0.98, foodie: 0.5, romantic: 0.1, lonely: 0.05, nature: 0.3, club: 0.1 },
    category: 'cafe',
    address: '45 Powai Lake Road',
    city: 'Mumbai',
    ambiance: { lighting: 'bright', noiseLevel: 'loud', seating: 'communal', outdoorArea: true, decor: 'vibrant' },
    activityGuide: 'Let the kids pick the first activity. Play a board game together. Order the sharing platters.',
    seekingGuide: 'Seek shared laughter, the chaos of togetherness, and a moment that becomes a family story.',
    priceRange: '$$',
    cuisine: 'Multi-cuisine',
    openingHours: '10 AM - 9 PM',
    images: [],
  },

  // ─── NATURE ──────────────────────────────────────
  {
    name: 'The Lakeview Pavilion',
    description: 'An open-air cafe set beside a serene lake with walking trails and bird-watching spots.',
    moods: ['nature', 'lonely', 'romantic'],
    moodScores: { nature: 0.96, lonely: 0.82, romantic: 0.75, family: 0.55, foodie: 0.4, club: 0.05 },
    category: 'cafe',
    address: 'Sukhna Lake Road',
    city: 'Chandigarh',
    ambiance: { lighting: 'natural', noiseLevel: 'quiet', seating: 'mixed', outdoorArea: true, decor: 'minimalist' },
    activityGuide: 'Walk the trail first. Then sit with a warm drink and do nothing for at least 20 minutes.',
    seekingGuide: 'Seek stillness, the sound of water, birdsong, and the feeling of your mind gently clearing.',
    priceRange: '$',
    cuisine: 'Cafe & Snacks',
    openingHours: '7 AM - 8 PM',
    images: [],
  },
  {
    name: 'Himalayan Brew',
    description: 'A mountain-view cafe surrounded by pine trees with outdoor seating and fresh mountain air.',
    moods: ['nature', 'lonely'],
    moodScores: { nature: 0.99, lonely: 0.85, romantic: 0.65, family: 0.5, foodie: 0.45, club: 0.02 },
    category: 'cafe',
    address: 'Mall Road',
    city: 'Manali',
    ambiance: { lighting: 'natural', noiseLevel: 'quiet', seating: 'mixed', outdoorArea: true, decor: 'rustic' },
    activityGuide: 'Leave your phone inside. Sit outside. Breathe deeply. Watch the mountains do nothing.',
    seekingGuide: 'Seek restoration, perspective, clean air, and the grounding feeling of being small in a big world.',
    priceRange: '$',
    cuisine: 'Cafe',
    openingHours: '8 AM - 7 PM',
    images: [],
  },

  // ─── LONELY ──────────────────────────────────────
  {
    name: 'The Corner Nook',
    description: 'A cozy independent bookstore-cafe with warm lighting, quiet corners, and the best filter coffee in town.',
    moods: ['lonely', 'nature'],
    moodScores: { lonely: 0.97, nature: 0.4, romantic: 0.55, family: 0.3, foodie: 0.5, club: 0.05 },
    category: 'cafe',
    address: '7 Church Street',
    city: 'Bangalore',
    ambiance: { lighting: 'warm', noiseLevel: 'quiet', seating: 'private', outdoorArea: false, decor: 'rustic' },
    activityGuide: 'Pick a book off the shelf. Journal. Order a slow coffee. Let yourself settle without rushing.',
    seekingGuide: 'Seek warmth, quiet companionship of strangers, and the comfort of a place that doesn\'t demand anything from you.',
    priceRange: '$',
    cuisine: 'Cafe',
    openingHours: '8 AM - 10 PM',
    images: [],
  },

  // ─── CLUB ────────────────────────────────────────
  {
    name: 'Pulse Nightclub',
    description: 'Delhi\'s top nightclub with world-class DJs, a premium bar, and an electric dance floor.',
    moods: ['club'],
    moodScores: { club: 0.99, lonely: 0.1, romantic: 0.4, family: 0.0, foodie: 0.2, nature: 0.0 },
    category: 'club',
    address: 'DLF Cyberhub',
    city: 'Delhi',
    ambiance: { lighting: 'dim', noiseLevel: 'vibrant', seating: 'mixed', outdoorArea: false, decor: 'modern' },
    activityGuide: 'Dance first, drinks second. Talk to someone new. Let the music choose your mood.',
    seekingGuide: 'Seek high energy, freedom, spontaneous connection, and the feeling of being completely in the moment.',
    priceRange: '$$$',
    cuisine: 'Bar & Cocktails',
    openingHours: '9 PM - 4 AM',
    images: [],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    if (process.argv[2] === '--clear') {
      await Venue.deleteMany({});
      console.log('🗑️  All venues cleared');
      process.exit(0);
    }

    await Venue.deleteMany({});
    await Venue.insertMany(sampleVenues);

    console.log(`🌱 Seeded ${sampleVenues.length} venues successfully!`);
    console.log('Cities:', [...new Set(sampleVenues.map(v => v.city))].join(', '));
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
