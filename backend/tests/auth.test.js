const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Test configuration
const TEST_JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing';

// Helper function to generate test token
const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, TEST_JWT_SECRET, { expiresIn: '1h' });
};

describe('Auth API Endpoints', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123',
    age: 25,
    gender: 'male',
  };

  describe('POST /api/auth/register', () => {
    afterEach(async () => {
      // Clean up test user
      await User.deleteMany({ email: testUser.email });
    });

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/);

      // Check response status
      if (response.status !== 201) {
        console.log('Register response:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });

    it('should reject short password', async () => {
      const shortPasswordUser = {
        ...testUser,
        email: 'shortpass@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(shortPasswordUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    afterEach(async () => {
      await User.deleteMany({ email: testUser.email });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      authToken = registerResponse.body.token;
    });

    afterEach(async () => {
      await User.deleteMany({ email: testUser.email });
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      authToken = registerResponse.body.token;
    });

    afterEach(async () => {
      await User.deleteMany({ email: testUser.email });
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
