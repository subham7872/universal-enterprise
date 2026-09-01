import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e){}
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function syncAllToMongo() {
  console.log('[Sync All] Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('[Sync All] Connected to MongoDB Atlas.');

  const productSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  console.log('[Sync All] Loading INITIAL_PRODUCTS from backend/data/bearingsData.js...');
  const mod = await import('file://' + dataFilePath.replace(/\\/g, '/'));
  const allProducts = mod.INITIAL_PRODUCTS || [];
  console.log(`[Sync All] Found ${allProducts.length} total products in bearingsData.js.`);

  console.log('[Sync All] Starting batch upsert in chunks of 500...');
  const CHUNK_SIZE = 500;
  let totalUpserted = 0;
  let totalModified = 0;
  let totalMatched = 0;

  for (let i = 0; i < allProducts.length; i += CHUNK_SIZE) {
    const chunk = allProducts.slice(i, i + CHUNK_SIZE);
    const bulkOps = chunk.map(prod => ({
      updateOne: {
        filter: { id: prod.id },
        update: { $set: prod },
        upsert: true
      }
    }));

    const res = await Product.bulkWrite(bulkOps);
    totalMatched += res.matchedCount;
    totalModified += res.modifiedCount;
    totalUpserted += res.upsertedCount;
    console.log(`[Sync All] Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(allProducts.length / CHUNK_SIZE)}: Matched: ${res.matchedCount}, Upserted: ${res.upsertedCount}`);
  }

  const finalDbCount = await Product.countDocuments();
  console.log(`[Sync All] Finished! Total MongoDB Atlas Product Count is now: ${finalDbCount}`);

  await mongoose.disconnect();
}

syncAllToMongo().catch(err => {
  console.error('[Sync All Error]:', err);
  process.exit(1);
});
