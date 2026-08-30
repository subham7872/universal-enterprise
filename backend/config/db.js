import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/universal_enterprise';

  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`[MongoDB] Connected successfully to ${db.connection.host}/${db.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoUri}: ${error.message}`);
    console.warn('[MongoDB Warning] Operating with graceful in-memory fallback cache where applicable.');
  }
};

export default connectDB;
