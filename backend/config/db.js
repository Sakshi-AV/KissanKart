const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryFallback = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kissan_kart';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.log(`🌾 Initializing resilient In-Memory Store for Kissan Kart development...`);
    isInMemoryFallback = true;
    return null;
  }
};

module.exports = {
  connectDB,
  getDbStatus: () => ({ isConnected, isInMemoryFallback })
};
