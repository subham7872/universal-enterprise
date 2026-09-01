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

const RAW_DOUBLE_THRUST = [
  "513125 FAG", "350980C SKF", "353162 SKF", "CRTD5010WCS60 NTN", "350TFD4901 NSK",
  "CRTD3401DXCS50 NTN", "260TFD3601 NSK", "350980C FBC", "353005 Neutral",
  "524134.M15BZ FAG", "509654 FAG", "Z-528876.TA2 FAG", "Z-567356.TA2 FAG",
  "530739 FAG", "Z-528294.TA2 FAG", "Z-509654.TA2 FAG", "509392 FAG", "522010HW FAG",
  "528974 FAG", "Z.528562.TA2 FAG", "547482 FAG", "Z-528562.TA2 FAG", "528562 FAG",
  "Z-529086.TA2 FAG", "Z-545991.TA2 FAG", "Z-564567.TR2S FAG", "530739.M15BZ FAG",
  "509352 FAG", "522010 FAG", "Z-522010.TA2 FAG", "Z-509352.TA2 FAG", "350981C SKF",
  "350976 SKF", "351175C SKF", "353005 SKF", "351182C SKF", "351019C SKF",
  "350981 SKF", "350980C Timken", "351100C1 RKB", "350981C1 RKB", "353162A1 RKB",
  "353093AB HA4 ZB RKB", "353005A1 RKB", "351175C1 RKB", "CRTD3401WCS50 NTN",
  "40TTHD015AA967 Torrington", "351121C1 RKB", "350976C RKB", "353102C1 RKB",
  "350980C1 RKB", "351182C1 RKB", "350982C1 RKB", "353162 NSK", "351019C1 RKB",
  "912-11 PSL", "353005 FBC", "353162 Neutral", "353162 ZWZ", "Z-515196.TA2 FAG",
  "Z-509392.TA2 FAG", "Z-545678.TA2 FAG", "Z-527907.TA2 FAG", "Z-549701.TA2 FAG",
  "509391HW FAG", "524194 FAG", "Z-524740.TA2 FAG", "Z-513401.TA2 FAG", "509391 FAG",
  "515196 FAG", "547584 FAG", "Z-513828.TA2 FAG", "528294.TA2 FAG", "522010.TA2 FAG",
  "579704 FAG", "Z-547482.TA2 FAG", "Z-509391.TA2 FAG", "525469.TA1 FAG", "528876 FAG",
  "Z-530739.TA2 FAG", "522010NR FAG", "528294 FAG", "Z-528974.TA2 FAG", "Z-513125.TA2 FAG",
  "Z-509160.TR2S FAG", "353155 SKF", "353151 SKF", "351100C SKF", "D3637A Timken",
  "350982C SKF", "351121C SKF", "40TTHD015 Timken", "CRTD7012 NTN", "353162 RKB",
  "2RY420 2 NSK", "40TTHD015AA967 A&S - Fersa", "40TTHD015 Torrington", "353151A1 RKB",
  "180TFD2801 NSK", "170TFD2401 NSK"
];

function parseDoubleThrustProduct(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let brand = "FAG";
  if (cleanLine.includes("A&S - Fersa") || cleanLine.includes("Fersa")) {
    brand = "Fersa";
    cleanLine = cleanLine.replace(/A&S - Fersa|Fersa/g, "").trim();
  } else if (cleanLine.includes("RKB")) {
    brand = "RKB";
    cleanLine = cleanLine.replace("RKB", "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "NSK", "NTN", "Torrington", "FBC", "PSL", "ZWZ", "Neutral"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 180, od = 290, height = 95;
  let typeDesc = "Double Direction Tapered Roller Thrust Bearing (TA2 / CRTD / TFD / 350000 Series)";
  let seriesGroup = "Double Direction Tapered Roller Thrust Bearing Series";

  if (partNumber.includes("TFD") || partNumber.includes("CRTD")) {
    let m = partNumber.match(/(\d{3})/);
    if (m) {
      bore = parseInt(m[1], 10);
      od = Math.round(bore * 1.55);
      height = Math.round(bore * 0.48);
    }
  } else if (partNumber.startsWith("35")) {
    bore = 160; od = 260; height = 85;
  } else if (partNumber.includes("TA2") || partNumber.startsWith("5")) {
    bore = 190; od = 310; height = 100;
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * height * 7.85 / (4 * 1000000)).toFixed(1);
  if (parseFloat(estWeight) < 4.0) estWeight = "14.5";

  let dyn = Math.round(bore * od * 0.08);
  let stat = Math.round(dyn * 2.6);

  let price = Math.round(parseFloat(estWeight) * 2600 + 4500);
  if (price < 3800) price = 3800;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-dthr-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Double Direction Tapered Roller Thrust Bearing ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Thrust Bearing Double Direction",
    seriesGroup: seriesGroup,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 15) + 4,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: height,
    material: "High-Grade Case-Hardened / 100Cr6 Chrome Alloy Bearing Steel",
    sealType: "Open (Double-Direction Two-Way Tapered Thrust Bearing Unit)",
    cageType: "Heavy-Duty Solid Machined Brass / Heavy Steel Window-Type Cages",
    loadRating: `Bidirectional Dynamic Thrust: ${dyn} kN, Static Thrust: ${stat} kN`,
    speedRating: `${Math.round(230000 / od)} RPM`,
    countryOfOrigin: brand === "Timken" || brand === "Torrington" ? "USA" : brand === "NSK" || brand === "NTN" ? "Japan" : brand === "RKB" ? "Switzerland" : "Germany",
    application: "Metal rolling mill roll chocks, heavy extrusion presses, crane swivel assemblies, marine propeller thrust blocks, mining coal pulverizers, oil drilling rotary tables",
    description: `Genuine ${brand} double-direction tapered roller thrust bearing ${partNumber}. Designed to accommodate immense bidirectional axial shock loads in both directions with maximum rigidity and precise axial shaft location.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber, price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber, price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_DOUBLE_THRUST.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseDoubleThrustProduct(line, idx)).filter(Boolean);
  console.log(`[Double Thrust Script] Parsed ${products.length} unique Double Direction Tapered Roller Thrust Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Double Thrust Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Thrust Bearing Double Direction to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Thrust Bearing Double Direction"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Thrust Bearing Single Direction",\s*"id": "tapered-thrust-single"\s*},/,
      `"name": "Tapered Roller Thrust Bearing Single Direction",\n        "id": "tapered-thrust-single"\n      },\n      {\n        "name": "Tapered Roller Thrust Bearing Double Direction",\n        "id": "tapered-thrust-double"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Double Thrust Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Double Thrust Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Double Thrust Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Double Thrust Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Double Thrust Script] Connected to MongoDB Atlas.');

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
    console.log(`[Double Thrust Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalDoubleThrust = await Product.countDocuments({ category: "Tapered Roller Thrust Bearing Double Direction" });
    console.log(`[Double Thrust Script] Current Database Totals: ${totalDoubleThrust} Tapered Roller Thrust Bearings Double Direction.`);
  } catch (err) {
    console.error('[Double Thrust Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Double Thrust Script] Done.');
  }
}

main();
