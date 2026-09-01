import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e){}
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const dbCount = await mongoose.connection.db.collection('products').countDocuments();
  
  const catCounts = await mongoose.connection.db.collection('products').aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  const brandCounts = await mongoose.connection.db.collection('products').aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  const mod = await import('file://' + dataFilePath.replace(/\\/g, '/'));
  const fileCount = mod.INITIAL_PRODUCTS ? mod.INITIAL_PRODUCTS.length : 0;

  console.log(JSON.stringify({ fileCount, dbCount, catCounts, brandCounts }, null, 2));
  await mongoose.disconnect();
  process.exit(0);
}
check();
