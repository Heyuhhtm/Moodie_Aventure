const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip connection in test environment (handled by mongodb-memory-server)
  if (process.env.NODE_ENV === 'test') {
    console.log('ℹ️  Test mode - database connection handled by setup.js');
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not configured - running without database');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Running server without database connection');
  }
};

module.exports = connectDB;
