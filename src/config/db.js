const mongoose = require('mongoose');

/**
 * Establishes a connection between the application and MongoDB using Mongoose.
 * The backend must not start handling requests until this succeeds.
 *
 * Falls back to a local MongoDB instance if MONGO_URI is not set, matching
 * the AI WeatherWise reference document (Epic 4 / "Db connection").
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weatherwise';
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
