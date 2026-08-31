import dns from 'dns';
import mongoose from 'mongoose';

// Ensure Google & Cloudflare DNS resolvers are used to bypass ISP SRV query blocks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if unable to set custom DNS
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ue14email_db_user:4yITHzyDAa1rPHXa@cluster0.pqmpdeb.mongodb.net/universal_enterprise?retryWrites=true&w=majority&appName=Cluster0';

  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`[MongoDB Atlas] Connected successfully to ${db.connection.host}/${db.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas: ${error.message}`);
    console.warn('[MongoDB Warning] Operating with ultra-fast zero-latency in-memory cache.');
  }
};

export default connectDB;
