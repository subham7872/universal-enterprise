import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ue14email_db_user:4yITHzyDAa1rPHXa@cluster0.pqmpdeb.mongodb.net/universal_enterprise?retryWrites=true&w=majority&appName=Cluster0';

  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`[MongoDB] Connected successfully to ${db.connection.host}/${db.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[MongoDB Warning] Operating with graceful in-memory fallback cache where applicable.');
  }
};

export default connectDB;
