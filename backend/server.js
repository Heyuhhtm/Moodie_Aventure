const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Debug: Log environment variables status
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '✓ Default (7d)');
console.log('PORT:', process.env.PORT || '✓ Default (5000)');
console.log('CLIENT_URL:', process.env.CLIENT_URL || '✓ Default (*)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('=====================================');

// Connect to MongoDB (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// ─── CORS Configuration ────────────────────────────
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || true  // Allow production URL in production
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
};
app.use(cors(corsOptions));

// ─── Body Parsers ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/venues',  require('./routes/venues'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reviews', require('./routes/reviews'));

// ─── Health Check ─────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    message: '🌿 DilJourney API is running',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🌿 DilJourney API is running',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      venues: '/api/venues',
      profile: '/api/profile',
      reviews: '/api/reviews',
    },
  });
});

// ─── Serve Static Frontend in Production ─────────
if (process.env.NODE_ENV === 'production') {
  // Serve static files from MOODIE folder
  app.use(express.static(path.join(__dirname, '../MOODIE')));

  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../MOODIE/index.html'));
  });
}

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ DilJourney server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for testing
module.exports = app;
