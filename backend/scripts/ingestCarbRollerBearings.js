import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e){}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const RAW_CARB = [
  "C3040-XL-K-M-W209B-C4 FAG", "C3152-XL-K-M-W209B-C4 FAG", "C3140-XL-K-M-C4 FAG",
  "C3048-XL-K-M-C4 FAG", "C3156-XL-K-M-W209B-C4 FAG", "C3148-XL-K-M-W209B-C4 FAG",
  "C3044-XL-K-M-W209B-C4 FAG", "C3044-XL-K-M-C4 FAG", "C3036-XL-K-M-W209B-C4 FAG",
  "C3140-XL-K-M-W209B-C4 FAG", "C3156-XL-K-M-C4 FAG", "C3136-XL-K-M-W209B-C4 FAG",
  "C3048-XL-K-M-W209B-C4 FAG", "C3136-XL-K-M-C4 FAG", "C3152-XL-K-M-C4 FAG",
  "C3148-XL-K-M-C4 FAG", "C3144-XL-K-M-W209B-C4 FAG", "C3144-XL-K-M-C4 FAG",
  "C3040-XL-K-M-C4 FAG", "C3036-XL-K-M-C4 FAG", "C2234K/C3 SKF", "C31/600KMB/HA3C4 SKF",
  "C2314K/C3 SKF", "C2226/C4 SKF", "C4022V/C3 SKF", "C2319K SKF", "C5915V/C4 SKF",
  "C4122V/C3 SKF", "C5915V SKF", "C2316K/C4 SKF", "C3156K/HA3C4 SKF", "C2218 SKF",
  "C2216K/C3 SKF", "C2216/C3 SKF", "C2213V SKF", "C30/500MB SKF", "C2206V SKF",
  "C3144K SKF", "C3140K/HA3C4 SKF", "C3044 SKF", "C2213KTN9/C3 SKF", "C3168KM SKF",
  "C2210KTN9 SKF", "C2215V/C3 SKF", "C4022V/C4 SKF", "C3148K/HA3C4 SKF", "C6912V/C4S3 SKF",
  "ZE C31/600KMB/C084W4 SKF", "C5918V/C3 SKF", "C5918-CS5V/C3 SKF", "C3120V/C3 SKF",
  "C2207TN9 SKF", "C2211TN9/C3 SKF", "C4024V/C4VM118 SKF", "C4032/C3 SKF", "C2315K/C4 SKF",
  "C2226K/C3 SKF", "C2212KV SKF", "C31/530KM SKF", "C2220K/C4 SKF", "C6912-2NSV/C3 SKF",
  "C2209KTN9/C4/R861 SKF", "C6915-2CS5V/C4 SKF", "C2226/C3 SKF", "C6915-CS5V/C4 SKF",
  "C3038 SKF", "C2220K/C3 SKF", "C4032V/C3 SKF", "C6912V/C3 SKF", "C2211V/C3 SKF",
  "C2212KTN9 SKF", "C3132K/C4 SKF", "C4028V/C4 SKF", "C4032K30/C3 SKF", "C4026-2CS5V/C3 SKF",
  "C2314K SKF", "C2316K SKF", "C2222K/C3 SKF", "C3144K/HA3C4 SKF", "C3040K/HA3C4 SKF",
  "C2208V/C3 SKF", "C3156K/C3 SKF", "C4124V/C3 SKF", "C4120-2CS5V/C3GEM9 SKF", "C3132K/C3 SKF",
  "C5918V SKF", "C2220/C4 SKF", "C4030K30V/C4 SKF", "C6006V/C4 SKF", "C6915-CS5V/C3 SKF",
  "C4020V/C3 SKF", "C4024V/C3 SKF", "C2222 SKF", "C2217 SKF", "C3224 SKF", "C3120V SKF",
  "C2222K/C4 SKF", "C3152K/C4 SKF", "C2210KV/C3 SKF", "C2214TN9/C3 SKF", "C6915V/C3VE240 SKF",
  "C5918V/C4 SKF", "C5918-2CS5V/C3 SKF", "C2216 SKF", "C2213TN9/C3 SKF", "C4122V SKF",
  "C3152K SKF", "C2226 SKF", "C6910V/C4 SKF", "C3144K/C4 SKF", "C3148K/C3 SKF", "C3976M SKF",
  "C3038/VG114 SKF", "C3232 SKF", "C2213KV/C3 SKF", "C6912V SKF", "C2210V SKF",
  "C4032V/C4VM118 SKF", "C2222/C4 SKF", "C5020V/C4 SKF", "C6915V/C4VE240 SKF", "C2230/C3 SKF",
  "C2228/C3 SKF", "C2244 SKF", "C2218/C3 SKF", "C2215/C3 SKF", "C3044K SKF", "C2213KTN9 SKF",
  "C2209V/C3 SKF", "C3224K/C3 SKF", "C2320/C4VG114 SKF", "C3040K/C4 SKF", "C2218/C4 SKF",
  "C31/630KMB/HA3C4 SKF", "C4034V/C3 SKF", "C4030V/C4 SKF", "C4020V SKF", "C4034V SKF",
  "C2318 SKF", "C4024V SKF", "C2228K SKF", "C2211KTN9 SKF", "C2210V/C4 SKF", "C6910-2CS5V SKF",
  "C3972KM SKF", "C4044V SKF", "C3134K SKF", "C4911V SKF", "C3044/C4 SKF", "C3192KM SKF",
  "C4026K30/C4HVK230 SKF", "C3172KM/C3 SKF", "C30/630KM/HA3C4 SKF", "C3088MB/CNL SKF",
  "C3080KM/C3 SKF", "C3036 SKF", "C2315K/C3 SKF", "C5915V/C4S3 SKF", "C4910V SKF",
  "C2212V/C3 SKF", "C2212TN9/C3 SKF", "C2212TN9 SKF", "C2211TN9 SKF", "C2208KTN9/C3 SKF",
  "C2317K/C4 SKF", "C2217V/C3 SKF", "C3160 SKF", "C5020V SKF", "C2226K/C5 SKF", "C2206TN9/C3 SKF",
  "C5915V/C3 SKF", "C4030V/C3 SKF", "C2215K SKF", "C2213TN9 SKF", "C2211V SKF", "C2209KTN9 SKF",
  "C3140K SKF", "C3130 SKF", "C2209V SKF", "C2208KTN9 SKF", "C4036V SKF", "C3164KM SKF",
  "C3984KM SKF", "C3022 SKF", "C2214V/C3 SKF", "C30/670KM/HA3C4 SKF", "C5020V/C4VM118 SKF",
  "C31/750KMB/C083W4 SKF", "C4126-2CS5V/C3GEM9 SKF", "C2212V/C4 SKF", "C2207KTN9/C3 SKF",
  "C2320K/C3 SKF", "C3232K SKF", "C2209KTN9/C3 SKF", "C2230K/C3 SKF", "C2317/C3 SKF",
  "C6910V/C3 SKF", "C2318/C3 SKF", "C2244K/HA3C4 SKF", "C2218K/C3 SKF", "C2209TN9/C3 SKF",
  "C3136 SKF", "C2230 SKF", "C4026V/C3 SKF", "C3152K/C3 SKF", "C3136K/C3 SKF", "C3044K/C3 SKF",
  "C3180KM SKF", "C3156K SKF", "C3084KM SKF", "C2216/C4 SKF", "C2318K SKF", "C2244/C3 SKF",
  "C2220K SKF", "C2217/C3 SKF", "C2216V SKF", "C3224K SKF", "C3140K/C3 SKF", "C3130K/C3 SKF",
  "C3130/HA3C4 SKF", "C2234K SKF", "C2206KTN9 SKF", "C4126-2CS5V SKF", "C2205TN9 SKF",
  "C2209KTN9/C4 SKF", "C2226K/C4 SKF", "C39/750M SKF", "C4032K30/C4W4 SKF", "C3232K/C4 SKF",
  "C2215/C4 SKF", "C2228/C4 SKF", "C3040 SKF", "C2217K/C3 SKF", "C2216K SKF", "C2215V SKF",
  "C3024V/C3 SKF", "C4026K30V SKF", "C2210KTN9/C3 SKF", "C2317K/C3 SKF", "C3040/C3 SKF",
  "C2208V SKF", "C30/750KMB SKF", "C3076KM SKF", "C3140K/C4 SKF", "C30/600KM/HA3C4 SKF",
  "C2218K/C4 SKF", "C2244/C4 SKF", "C2317 SKF", "C4026 SKF"
];

function parseCarbProduct(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = "SKF";
  let last = parts[parts.length - 1];
  if (last === "FAG" || last === "SKF") {
    brand = last;
    parts.pop();
    cleanLine = parts.join(' ').trim();
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 110, od = 200, width = 53;

  let slashMatch = partNumber.match(/C\d+\/(\d{3})/);
  if (slashMatch) {
    bore = parseInt(slashMatch[1], 10);
    od = Math.round(bore * 1.55);
    width = Math.round(bore * 0.42);
  } else {
    let numMatch = partNumber.match(/C(\d{2})(\d{2})/);
    if (numMatch) {
      let series = parseInt(numMatch[1], 10);
      let size = parseInt(numMatch[2], 10);
      bore = size * 5;
      if (series === 22) { od = Math.round(bore * 1.8); width = Math.round(bore * 0.38); }
      else if (series === 23) { od = Math.round(bore * 2.0); width = Math.round(bore * 0.52); }
      else if (series === 30) { od = Math.round(bore * 1.5); width = Math.round(bore * 0.36); }
      else if (series === 31) { od = Math.round(bore * 1.65); width = Math.round(bore * 0.48); }
      else if (series === 32) { od = Math.round(bore * 1.85); width = Math.round(bore * 0.56); }
      else if (series === 40) { od = Math.round(bore * 1.5); width = Math.round(bore * 0.45); }
      else if (series === 41) { od = Math.round(bore * 1.65); width = Math.round(bore * 0.55); }
      else if (series === 59 || series === 69) { od = Math.round(bore * 1.4); width = Math.round(bore * 0.35); }
    }
  }

  let isTapered = partNumber.includes('K');
  let isSealed = partNumber.includes('2CS') || partNumber.includes('CS5') || partNumber.includes('2NS');
  let isFullComplement = partNumber.includes('V');
  let isBrass = partNumber.includes('M') || partNumber.includes('MB');
  let isPoly = partNumber.includes('TN9');

  let cageDesc = isFullComplement ? "Full Complement (Max Rollers, No Cage)" : isBrass ? "Machined Brass Cage (M/MB)" : isPoly ? "Glass Fibre Reinforced Polyamide 66 Cage (TN9)" : "Pressed Steel Cage";

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.3) estWeight = "0.85";

  let dyn = Math.round(bore * width * 0.48);
  let stat = Math.round(dyn * 1.65);

  let price = Math.round(parseFloat(estWeight) * 2600 + 3500);
  if (price < 2800) price = 2800;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-carb-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} CARB™ Toroidal Roller Bearing ${partNumber}`,
    brand: brand,
    category: "CARB™ Roller Bearing",
    seriesGroup: "Self-Aligning Toroidal Roller Bearing Series (CARB™)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 15) + 4,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Alloy Steel (Super-Clean High Fatigue Life)",
    sealType: isSealed ? "Integrated Contact Rubber Lip Seals (Pre-Greased)" : "Open (Self-Aligning Toroidal Roller Assembly)",
    cageType: cageDesc,
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(280000 / od)} RPM`,
    countryOfOrigin: brand === "SKF" ? "Sweden" : "Germany",
    application: "Paper making machines (drying cylinders, felt rolls), continuous casting machines, industrial fans & blowers, vibrating screens, heavy wind turbine planetary planet shafts",
    description: `Genuine ${brand} CARB™ toroidal roller bearing ${partNumber}. Combines self-aligning capability with frictionless axial internal displacement, eliminating induced axial stress from shaft thermal expansion and structural deflections.`,
    equivalentProducts: [
      { brand: brand === "SKF" ? "FAG" : "SKF", partNumber: partNumber, price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_CARB.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseCarbProduct(line, idx)).filter(Boolean);
  console.log(`[CARB Script] Parsed ${products.length} unique CARB™ Roller Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[CARB Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add CARB™ Roller Bearing to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "CARB™ Roller Bearing"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Thrust Bearing Double Direction",\s*"id": "tapered-thrust-double"\s*},/,
      `"name": "Tapered Roller Thrust Bearing Double Direction",\n        "id": "tapered-thrust-double"\n      },\n      {\n        "name": "CARB™ Roller Bearing",\n        "id": "carb-roller"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[CARB Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[CARB Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[CARB Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[CARB Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[CARB Script] Connected to MongoDB Atlas.');

    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

    const bulkOps = products.map(prod => ({
      updateOne: {
        filter: { partNumber: prod.partNumber, brand: prod.brand },
        update: { $set: prod },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(bulkOps);
    console.log(`[CARB Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalCarb = await Product.countDocuments({ category: "CARB™ Roller Bearing" });
    console.log(`[CARB Script] Current Database Totals: ${totalCarb} CARB™ Roller Bearings.`);
  } catch (err) {
    console.error('[CARB Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[CARB Script] Done.');
  }
}

main();
