import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e){}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  
  const taperedList = await Product.find({
    $or: [
      { category: 'Tapered Roller Bearing Single Row' },
      { partNumber: { $regex: '^(302|303|313|320|322|323|329|330|331|332|KM|KLM|KLL|KJM|T7F|T5E|T4C|K15578|K72200)' } }
    ]
  });
  console.log('Total tapered bearings found in DB matching patterns:', taperedList.length);
  
  await Product.updateMany(
    { _id: { $in: taperedList.map(p => p._id) } },
    { $set: { category: 'Tapered Roller Bearing Single Row' } }
  );
  
  const finalCount = await Product.countDocuments({ category: 'Tapered Roller Bearing Single Row' });
  console.log('Final Tapered Roller Bearing Single Row Count:', finalCount);
  await mongoose.disconnect();
}
run();
