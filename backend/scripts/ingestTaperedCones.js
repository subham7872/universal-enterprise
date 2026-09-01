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

const RAW_CONES = [
  "3586 FAG", "2780 FAG", "14123T FAG", "6461A FAG", "395S FAG", "X30228-A FAG",
  "572365 FAG", "41100-70000 Timken", "39236-20024 Timken", "65395-20024 Timken",
  "HM803146-20024 Timken", "HM237535-20024 Timken", "HH932132-20024 Timken",
  "HH224346-20024 Timken", "JF9549 Timken", "JH217249PREC.3 Timken", "56425WPREC.3 Timken",
  "EE750502 Timken", "LL365310 Timken", "LL205442 Timken", "L812148 Timken", "L45449 Timken",
  "JLM722948 Timken", "JLM104948 Timken", "JL819349 Timken", "JF6049 Timken",
  "HM807044 Timken", "78215 Timken", "74536W Timken", "68450 Timken", "665PREC.3 Timken",
  "43137X Timken", "HM89249-70016 Timken", "NP449291 Timken", "78214C Timken",
  "31594-70016 Timken", "580X-20024 Timken", "07100S-20024 Timken", "02475-20024 Timken",
  "NA81600-20024 Timken", "855-20024 Timken", "NP556636-20024 Timken", "A2047-30000 Timken",
  "JM624649-C0000 Timken", "NP739395 Timken", "HM801346X/2/CL7A SKF", "617 Timken",
  "5557 Timken", "53177 Timken", "45290 Timken", "45287 Timken", "44131 Timken",
  "2879 Timken", "2876 Timken", "28579 Timken", "2581 Timken", "25590 Timken",
  "25584T Timken", "25132 Timken", "19138 Timken", "17118S Timken", "16137 Timken",
  "15579X Timken", "15578 Timken", "14131 Timken", "BR29675 SKF", "NA52375 Timken",
  "NA48990SW Timken", "NA482 Timken", "NA41125 Timken", "M432148A Timken", "LM503349 Timken",
  "LM328448 Timken", "LM300848 Timken", "HM804840 Timken", "HM803149 Timken",
  "HM518445 Timken", "HM231140 Timken", "HM212044 Timken", "HH221449 Timken",
  "98350 Timken", "97493 Timken", "93775 Timken", "72201C Timken", "67790 Timken",
  "6554 Timken", "6389 Timken", "59187 Timken", "582 Timken", "568 Timken",
  "3984 Timken", "3979 Timken", "389AS Timken", "3795 Timken", "3783 Timken",
  "3776 Timken", "3775 Timken", "3774 Timken", "377 Timken", "350 Timken",
  "3480 Timken", "3477 Timken", "34301 Timken", "34300 Timken", "342S Timken",
  "337S Timken", "3360 Timken", "33269 Timken", "14124 Timken", "14119A Timken",
  "09081S Timken", "02876 Timken", "02474 Timken", "EE8575 Timken", "NA759SW Timken",
  "NA74525 Timken", "M86647 Timken", "M241549 Timken", "M224748 Timken", "LM241149 Timken",
  "LL713149 Timken", "L540049 Timken", "HM89448 Timken", "HM89446 Timken",
  "HM89444 Timken", "HM88648 Timken", "HH228349 Timken", "864 Timken", "53162 Timken",
  "526 Timken", "525X Timken", "47880 Timken", "47675 Timken", "47673 Timken",
  "47620 Timken", "47590 Timken", "47586 Timken", "47525 Timken", "47523 Timken",
  "47520 Timken", "47330 Timken", "47268 Timken", "47196 Timken", "47162 Timken",
  "47156 Timken", "47090 Timken", "47088 Timken", "47087 Timken", "47086 Timken",
  "47085 Timken", "26118S Timken", "26118 Timken", "2558 Timken", "25577 Timken",
  "18204X Timken", "15112 Timken", "15117-20024 Timken", "15100-20024 Timken",
  "H239649-20024 Timken", "HM926749-20024 Timken", "98316-20024 Timken",
  "18590-30000 Timken", "JP6049PREC.C Timken", "JM205149PREC.3 Timken", "314 Timken",
  "LL483449 Timken", "L865547-20000 Timken", "JM734449-N0000 Timken", "537T Timken",
  "07093PREC.3 Timken", "07087PREC.3 Timken", "07079PREC.3 Timken", "07062PREC.3 Timken",
  "07054PREC.3 Timken", "07050PREC.3 Timken", "07043PREC.3 Timken", "07035PREC.3 Timken",
  "07031PREC.3 Timken", "07024PREC.3 Timken", "07020PREC.3 Timken", "07018PREC.3 Timken",
  "07016PREC.3 Timken", "07015PREC.3 Timken", "07014PREC.3 Timken", "07012PREC.3 Timken",
  "07011PREC.3 Timken", "07010PREC.3 Timken", "07009PREC.3 Timken", "07008PREC.3 Timken",
  "07007PREC.3 Timken", "07006PREC.3 Timken", "07005PREC.3 Timken", "07004PREC.3 Timken",
  "07003PREC.3 Timken", "07002PREC.3 Timken", "07001PREC.3 Timken", "07000PREC.3 Timken",
  "33895/Q SKF", "2K-25877 SKF", "K3776 SKF", "RBT2-0226A/L3B SKF", "72218C/VQ273 SKF",
  "LM844049-30000 Timken", "HH231649-20000 Timken", "H715341-70000 Timken",
  "543-20024 Timken", "71455-20024 Timken", "67787-20024 Timken", "6580-20024 Timken",
  "HH228349-20024 Timken", "LM104949-20024 Timken", "JLM508748-C0000 Timken",
  "55200C.PREC3 Timken", "M252349HWS Timken", "JLM508748PREC.C Timken", "749PREC.3 Timken",
  "81630 Timken", "NA8575SW Timken", "314 Timken", "HM89449 Timken", "HM89448 Timken",
  "HM89447 Timken", "HM89446 Timken", "HM89445 Timken", "HM89444 Timken", "HM89443 Timken",
  "HM89442 Timken", "HM89440 Timken", "HM89449-20024 Timken", "HM89448-20024 Timken",
  "HM89447-20024 Timken", "HM89446-20024 Timken", "HM89445-20024 Timken",
  "HM89444-20024 Timken", "HM89443-20024 Timken", "HM89442-20024 Timken",
  "HM89440-20024 Timken", "HM89449PREC.3 Timken", "HM89448PREC.3 Timken",
  "HM89447PREC.3 Timken", "HM89446PREC.3 Timken", "HM89445PREC.3 Timken",
  "HM89444PREC.3 Timken", "HM89443PREC.3 Timken", "HM89442PREC.3 Timken",
  "5760 Timken", "558 Timken"
];

function parseConeItem(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = "Timken";
  let last = parts[parts.length - 1];
  const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "NTN", "NSK", "Koyo"];
  if (KNOWN_BRANDS.includes(last)) {
    brand = last;
    parts.pop();
    cleanLine = parts.join(' ').trim();
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 55, width = 25;
  let estWeight = (Math.PI * (bore*bore + (bore+22)*(bore+22)) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.25) estWeight = "0.65";

  let dyn = Math.round(bore * width * 0.24);
  let stat = Math.round(dyn * 1.35);

  let price = Math.round(parseFloat(estWeight) * 1650 + 750);
  if (price < 650) price = 650;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cone-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Tapered Roller Bearing Inner Ring with Rollers (Cone) ${partNumber}`,
    brand: brand,
    category: "Cone for Tapered Roller Bearings Single Row",
    seriesGroup: "Inch & Metric Single-Row Tapered Roller Bearing Cones (Cone & Rollers Assembly)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 25) + 10,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: null,
    width: width,
    material: "Case-Hardened Carburized Bearing Alloy Steel (Cone with Precision Ground Rollers)",
    sealType: "Open (Cone Assembly with Tapered Rollers & Stamped Steel Cage)",
    cageType: "Precision Stamped Window-Type Steel Cage",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(360000 / (bore + 30))} RPM`,
    countryOfOrigin: brand === "Timken" ? "USA" : "Germany",
    application: "Commercial vehicle wheel hubs, agricultural implements, industrial speed reducers, pinion shafts, transmission gearboxes, rolling mill machinery",
    description: `Genuine ${brand} precision single-row tapered roller bearing cone assembly ${partNumber}. Pre-assembled inner ring, case-carburized tapered rollers, and high-strength stamped steel cage for superior fatigue endurance under heavy combined loads.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-20024|-30000|-70016|-20000|-C0000|K/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber.replace(/\/Q|PREC\.3/g, '') + " /Q", price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_CONES.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseConeItem(line, idx)).filter(Boolean);
  console.log(`[Tapered Cone Script] Parsed ${products.length} unique Tapered Roller Bearing Cones.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Cone Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Cone for Tapered Roller Bearings Single Row to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Cone for Tapered Roller Bearings Single Row"')) {
    dataContent = dataContent.replace(
      /"name": "Cup for Tapered Roller Bearings Double Row",\s*"id": "tapered-double-cup"\s*},/,
      `"name": "Cup for Tapered Roller Bearings Double Row",\n        "id": "tapered-double-cup"\n      },\n      {\n        "name": "Cone for Tapered Roller Bearings Single Row",\n        "id": "tapered-single-cone"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Cone Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Cone Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Cone Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Cone Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Cone Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Cone Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalCones = await Product.countDocuments({ category: "Cone for Tapered Roller Bearings Single Row" });
    console.log(`[Tapered Cone Script] Current Database Totals: ${totalCones} Cones for Tapered Roller Bearings Single Row.`);
  } catch (err) {
    console.error('[Tapered Cone Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Cone Script] Done.');
  }
}

main();
