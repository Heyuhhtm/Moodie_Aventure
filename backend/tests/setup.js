const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set test timeout
jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Set the URI for mongoose
  process.env.MONGO_URI = mongoUri;
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('✅ Test database (in-memory) connected');
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('✅ Test database disconnected');
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  }
});
