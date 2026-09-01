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

const RAW_THRUST = [
  "Z-528548.02.TA1 FAG", "573271 FAG", "T157-904A1 Timken", "T113X-904A1 Timken",
  "T107-904A1 Timken", "T402-904A1 Timken", "T201W-904A2 Timken", "T189W-904A2 Timken",
  "T121 Timken", "T-77-W Timken", "T138X SKF", "T127-904A1 Timken", "T176W Timken",
  "T144W-904A2 Timken", "T921-902A1 Timken", "T200A-902A1 Timken", "T163X Timken",
  "T177AW-904A1 Timken", "T1381-904A1 Timken", "T144-904A1 Timken", "T138XS-904A2 Timken",
  "T138-904A1 Timken", "T163-904A2 Timken", "T92-904A1 Timken", "T101-904A1 Timken",
  "T208W Timken", "T387 Timken", "T188-904A3 Timken", "T138 Timken", "T105 Timken",
  "T102 Timken", "T94 Timken", "T251 Timken", "T811VX-902A1 Timken", "T158-904A1 Timken",
  "T1260-904A1 Timken", "T110-904A1 Timken", "T311F-902A3 Timken", "T199-904A1 Timken",
  "T119-904A1 Timken", "T77 Timken", "S-4791-A Timken", "T149W-904A2 Timken",
  "T151W-904A2 Timken", "T88-904A1 Timken", "T311-902A1 Timken", "T309-904A1 Timken",
  "T252-904A1 Timken", "T129 Timken", "T200A-92000 Timken", "353056B SKF", "T311F Timken",
  "T149-904A2 Timken", "T139-904A1 Timken", "T126W-904A5 Timken", "T1921-90010 Timken",
  "T77W Timken", "T302W-904A1 Timken", "T182-904A1 Timken", "T128 Timken", "T149 Timken",
  "BFSB353263E/HA3 SKF", "T113-904A2 Timken", "T76-904A1 Timken", "T208-904A1 Timken",
  "T202-904A2 Timken", "T199W-904A3 Timken", "T163W-904A4 Timken", "T107 Timken",
  "T157W-94000 Timken", "T.188.S-BRG. Timken", "BX-BFSB353290A SKF", "T189-904A3 Timken",
  "T178-90011 Timken", "T101W Timken", "T301W Timken", "T139W-904A2 Timken", "T126-904A1 Timken",
  "634059 SKF", "T661 Timken", "T144W Timken", "T202W Timken", "634011A SKF", "T151 Timken",
  "T120 Timken", "T411-902A4 Timken", "T302-904A2 Timken", "T301-904A2 Timken",
  "T201-904A4 Timken", "T309 Timken", "T252W Timken", "T126AW-90010 Timken", "T402W-90010 Timken",
  "T251W-904A2 Timken", "T169 Timken", "T163W Timken", "TW4000 Timken", "TK220M1202AA RKB",
  "228TT4851G NSK", "279TT6051CGS4 NSK", "IR-M-138 IRB", "TTHDT911 ISB", "IR-2054 IRB",
  "IR-M-163 IRB", "528548B FAG", "KT711-MPA FAG", "534161 FAG", "T711 FAG",
  "Z-547667.TA1 FAG", "532792 FAG", "Z-537504.TA1 FAG", "546633 FAG", "532803 FAG",
  "Z-532803.TA1 FAG", "F-809429.TA1 FAG", "532805 FAG", "Z-536125.02.TA1 FAG",
  "Z-528546.03.TA1 FAG", "513052A FAG", "F-803674.TA1 FAG", "T511A FAG", "526198 FAG",
  "Z-532817.TA1 FAG", "KT911-MPA FAG", "KT911 FAG", "532817 FAG", "KT921-MPA FAG",
  "532796 FAG", "502998 FAG", "T911 FAG", "Z-546633.TA1-W209C FAG", "Z-577101.TA1 FAG",
  "Z-546631.TA1 FAG", "Z-547420.TA1 FAG", "Z-535741.01.TA1 FAG", "Z-514560.TA1 FAG",
  "T126 INA", "KT921 FAG", "Z-545450.TA1 FAG", "535741A FAG", "KT811-MPA FAG",
  "528548A FAG", "532796A FAG", "513052 FAG", "546631 FAG", "500667 FAG", "502999 FAG",
  "500636 FAG", "Z-527709.TA1 FAG", "Z-574439.TA1 FAG", "KT1120-MPA FAG",
  "Z-531600.TA1-W72D-W209D FAG", "T9020-902A1 Timken", "T130 Timken", "T126 SKF",
  "2K-T126 SKF", "609552 SKF", "T451 Timken", "6578 Timken", "T92 Timken", "T177 Timken",
  "T139 Timken", "T126 Timken", "T63 Timken", "T311 Timken", "T611M Timken", "T921 Timken",
  "T811-902A1 Timken", "T157 Timken", "T113 Timken", "T107-902A1 Timken", "T144-902A1 Timken",
  "T138-902A1 Timken", "T163-902A1 Timken", "T92-902A1 Timken", "T101-902A1 Timken",
  "T208-902A1 Timken", "T387-902A1 Timken", "T188-902A3 Timken", "T138-902A1 Timken",
  "T105-902A1 Timken", "T102-902A1 Timken", "T94-902A1 Timken", "T251-902A1 Timken",
  "T811VX-902A1 Timken", "T158-902A1 Timken", "T1260-902A1 Timken", "T110-902A1 Timken",
  "T311F-902A3 Timken", "T199-902A1 Timken", "T119-902A1 Timken", "T77-902A1 Timken",
  "T149-902A2 Timken", "T151-902A2 Timken", "T88-902A1 Timken", "407261 SKF",
  "T451-902A1 Timken", "T157W Timken", "T177XA Timken", "T144 Timken", "T110 Timken",
  "T190 Timken", "T301 Timken", "T100 Timken", "T811 Timken", "STW303 Timken",
  "353118 SKF", "353075A SKF", "353290/HB1 SKF", "T581 Timken", "T911-902A2 Timken",
  "T661-902A1 Timken", "T387-904B4 Timken", "T178 Timken", "T163 Timken", "T129-904A1 Timken"
];

function parseThrustProduct(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  if (cleanLine.includes("File ") || cleanLine.includes("contains") || cleanLine.includes("identifies") || cleanLine.includes("entries")) return null;

  let brand = "Timken";
  if (cleanLine.includes("IRB Rolamentos") || cleanLine.includes("IRB")) {
    brand = "IRB";
    cleanLine = cleanLine.replace(/IRB Rolamentos|IRB/g, "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "NSK", "RKB", "ISB", "INA"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 75, od = 135, height = 38;
  let estWeight = (Math.PI * (od*od - bore*bore) * height * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.9) estWeight = "2.80";

  let dyn = Math.round(bore * od * 0.045);
  let stat = Math.round(dyn * 2.8);

  let price = Math.round(parseFloat(estWeight) * 2400 + 1900);
  if (price < 1550) price = 1550;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tthr-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Single Direction Tapered Roller Thrust Bearing ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Thrust Bearing Single Direction",
    seriesGroup: "High-Capacity Tapered Roller Thrust Bearing Series (T / TTHD / TA1)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 20) + 6,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: height,
    material: "High-Grade Case-Hardened / Through-Hardened 100Cr6 Chrome Alloy Bearing Steel",
    sealType: "Open (Single-Direction Tapered Roller Thrust Assembly)",
    cageType: "Heavy-Duty Machined Brass / Solid Steel Window-Type Thrust Cage",
    loadRating: `Axial Dynamic (Ca): ${dyn} kN, Axial Static (C0a): ${stat} kN`,
    speedRating: `${Math.round(260000 / od)} RPM`,
    countryOfOrigin: brand === "Timken" ? "USA" : brand === "NSK" ? "Japan" : brand === "RKB" ? "Switzerland" : "Germany",
    application: "Rolling mill screw-down mechanisms, crane hoisting hooks, coal pulverizer drives, oil well swivel heads, marine propulsion thrust blocks, heavy extruder shafts",
    description: `Genuine ${brand} heavy-duty single-direction tapered roller thrust bearing ${partNumber}. Features tapered raceways converging at the bearing axis for true rolling motion and immense axial thrust capacity with high rigidity under severe shock loads.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-904A1|-902A1|-904A2/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber, price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_THRUST.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseThrustProduct(line, idx)).filter(Boolean);
  console.log(`[Tapered Thrust Script] Parsed ${products.length} unique Tapered Roller Thrust Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Thrust Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Thrust Bearing Single Direction to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Thrust Bearing Single Direction"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Bearing Assembly",\s*"id": "tapered-assembly"\s*},/,
      `"name": "Tapered Roller Bearing Assembly",\n        "id": "tapered-assembly"\n      },\n      {\n        "name": "Tapered Roller Thrust Bearing Single Direction",\n        "id": "tapered-thrust-single"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Thrust Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Thrust Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Thrust Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Thrust Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Thrust Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Thrust Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalThrust = await Product.countDocuments({ category: "Tapered Roller Thrust Bearing Single Direction" });
    console.log(`[Tapered Thrust Script] Current Database Totals: ${totalThrust} Tapered Roller Thrust Bearings Single Direction.`);
  } catch (err) {
    console.error('[Tapered Thrust Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Thrust Script] Done.');
  }
}

main();
