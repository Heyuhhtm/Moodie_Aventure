const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/venues',  require('./routes/venues'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reviews', require('./routes/reviews'));

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🌿 DilJourney API is running',
    version: '1.0.0',
    status: 'OK',
  });
});

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
app.listen(PORT, () => {
  console.log(`✅ DilJourney server running on port ${PORT}`);
});
