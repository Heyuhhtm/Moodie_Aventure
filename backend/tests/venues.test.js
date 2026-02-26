const request = require('supertest');
const app = require('../server');
const Venue = require('../models/Venue');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Test configuration
const TEST_JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing';

// Test venue data
const testVenue = {
  name: 'Test Restaurant',
  description: 'A test restaurant for unit testing',
  moods: ['family', 'foodie'],
  moodScores: {
    family: 0.8,
    foodie: 0.9,
    romantic: 0.4,
    nature: 0.3,
    lonely: 0.2,
    club: 0.1,
  },
  category: 'restaurant',
  address: '123 Test Street',
  city: 'Test City',
  priceRange: '$$',
  averageRating: 4.5,
  totalReviews: 10,
};

describe('Venues API Endpoints', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create a test user and get token
    testUser = await User.create({
      name: 'Test User',
      email: 'venue-test@example.com',
      password: 'testpass123',
    });
    
    authToken = jwt.sign({ id: testUser._id }, TEST_JWT_SECRET, { expiresIn: '1h' });

    // Create a test venue
    await Venue.create(testVenue);
  });

  afterEach(async () => {
    // Clean up
    await Venue.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /api/venues', () => {
    it('should get all venues', async () => {
      const response = await request(app)
        .get('/api/venues')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.venues).toBeDefined();
    });

    it('should filter venues by mood', async () => {
      const response = await request(app)
        .get('/api/venues?mood=foodie')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter venues by city', async () => {
      const response = await request(app)
        .get('/api/venues?city=Test City')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter venues by category', async () => {
      const response = await request(app)
        .get('/api/venues?category=restaurant')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/venues/mood/:mood', () => {
    it('should get venues by valid mood', async () => {
      const response = await request(app)
        .get('/api/venues/mood/foodie')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.mood).toBe('foodie');
    });

    it('should return error for invalid mood', async () => {
      const response = await request(app)
        .get('/api/venues/mood/invalidmood')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should filter by mood and city', async () => {
      const response = await request(app)
        .get('/api/venues/mood/foodie?city=Test City')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/venues/:id', () => {
    let venueId;

    beforeEach(async () => {
      const venue = await Venue.create(testVenue);
      venueId = venue._id;
    });

    it('should get venue by valid ID', async () => {
      const response = await request(app)
        .get(`/api/venues/${venueId}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.venue.name).toBe(testVenue.name);
    });

    it('should return 404 for non-existent venue', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/venues/${fakeId}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/venues/cities', () => {
    it('should get list of cities', async () => {
      const response = await request(app)
        .get('/api/venues/cities')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cities).toBeDefined();
      expect(Array.isArray(response.body.cities)).toBe(true);
    });
  });

  describe('POST /api/venues', () => {
    it('should create venue with valid token (admin)', async () => {
      const newVenue = {
        name: 'New Test Venue',
        description: 'A new test venue',
        moods: ['nature'],
        category: 'park',
        address: '456 New Street',
        city: 'New City',
        priceRange: '$',
      };

      const response = await request(app)
        .post('/api/venues')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newVenue)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.venue.name).toBe(newVenue.name);
    });

    it('should reject without auth token', async () => {
      const newVenue = {
        name: 'New Test Venue',
        description: 'A new test venue',
        moods: ['nature'],
        category: 'park',
        address: '456 New Street',
        city: 'New City',
        priceRange: '$',
      };

      const response = await request(app)
        .post('/api/venues')
        .send(newVenue)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });
  });
});
