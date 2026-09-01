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

const RAW_DOUBLE_CUPS = [
  "517135DC FAG", "394D-30039 Timken", "K109540R Timken", "99102D Timken", "363D Timken",
  "48620D Timken", "HM231116D Timken", "592D Timken", "33462D Timken", "384D Timken",
  "29526DRB Timken", "563D-20081 Timken", "451215CD Timken", "18620D-30000 Timken",
  "29622D-20024 Timken", "81963D Timken", "78549D Timken", "67325D Timken", "55444D Timken",
  "533D Timken", "HM746610CD Timken", "654D Timken", "L507914D Timken", "L225812D Timken",
  "37626D Timken", "3729D Timken", "36920CD Timken", "3423D Timken", "M231610DA Timken",
  "NA53390D Timken", "HH953710DC-40000 Timken", "M224710DPREC.3 Timken", "LM761610D Timken",
  "37626D-30000 Timken", "81963CD-20001 Timken", "130069X/13012HA Gamet", "533DCPREC.3 Timken",
  "29622DC-20024 Timken", "74851CD-20081 Timken", "67322DC Timken", "82932D Timken",
  "L623110D Timken", "394D Timken", "29622D Timken", "22325D Timken", "K78175-20001 Timken",
  "L357010CD-20001 Timken", "48220D-20081 Timken", "JXC25723DD Timken", "672D Timken",
  "28314XD Timken", "LM739710CD Timken", "98789D Timken", "72488D Timken", "592DC Timken",
  "14276D Timken", "K35667 Timken", "M224710D Timken", "A4138D Timken", "94114CD Timken",
  "27820D Timken", "87112D-20081 Timken", "48320D-20081 Timken", "432DC PREC.3 Timken",
  "572D Timken", "329173CD Timken", "K33867 Timken", "3729D-20081 Timken", "8520CD Timken",
  "48920D Timken", "384DRB Timken", "LM377410CD-2A000 Timken", "46720CD-20081 Timken",
  "XC2405DK Timken", "545142CD Timken", "A2120D Timken", "752D Timken", "71751DC Timken",
  "13621D Timken", "L610510D Timken", "52637D Timken", "493D Timken", "43319D Timken",
  "25520D Timken", "67720DW-40081 Timken", "654D-20081 Timken", "52687DA Timken",
  "HM129814XD Timken", "66521DB Timken", "64700D Timken", "28318D Timken", "25289D Timken",
  "24720D Timken", "44363D Timken", "HH221410D Timken", "05185D Timken", "02823D Timken",
  "LM249710CD Timken", "L540010D Timken", "L217810D Timken",
  "LM665910CD-20000 Timken", "932CD-20081 Timken", "13835D Timken", "07196D Timken",
  "384XD Timken", "67720DW Timken", "563D Timken", "363DC Timken", "L116110D Timken",
  "42587D Timken", "41294D Timken", "372XD Timken", "29526D Timken", "18620D Timken",
  "53376D-20024 Timken", "93127CD-20081 Timken", "132126DC Timken", "67920CD-20024 Timken",
  "K93891 Timken", "08231D-20024 Timken", "LM247710D-20024 Timken", "JXC25743D Timken",
  "L163110CD Timken", "HM821511D Timken", "27620DA Timken", "493D-30000 Timken",
  "LM451310CD Timken", "98789DC Timken", "67921D Timken", "67820CD Timken", "34478D Timken",
  "M238810CD Timken", "M919010D Timken", "LM522510D Timken", "854D Timken", "432D Timken",
  "384ED Timken", "33821D Timken", "L305610D-20024 Timken", "95927CD-20081 Timken",
  "95930 Timken", "HM743310CD Timken", "99102CD-20081 Timken", "53390D Timken",
  "48220D Timken", "46721D Timken", "171451CD-20001 Timken", "36620D-20024 Timken",
  "87112DC Timken", "9320D Timken",
  "834D Timken", "71751D Timken", "56650CD Timken", "L624514D Timken", "552D Timken",
  "29622DC Timken", "394D-20081 Timken", "LM241110D-20081 Timken", "742D-20081 Timken",
  "44363DPREC.3 Timken", "JD6510 Timken", "HM926710D Timken", "67322D Timken",
  "472D Timken", "29820 Timken", "533D-20081 Timken", "47420D-20024 Timken",
  "592DCPREC.3 Timken", "52637D-20081 Timken", "452DCPREC.3 Timken", "67720CDPREC.3 Timken",
  "33462D-20024 Timken", "78551DF Timken", "55433DC Timken", "44348D Timken",
  "M241510CD Timken", "231976CD Timken", "773D Timken", "67721D Timken",
  "M268710CD Timken", "K24299 Timken", "26282D Timken", "15251D Timken",
  "97901D-20081 Timken", "HM237510CD-20081 Timken", "67820CD-20081 Timken",
  "48320D Bower", "640261D NTN", "EE640261D Koyo (JTEKT)", "JRM3968XD Timken",
  "94114D Timken", "64700DC Timken", "632D Timken", "JXC25381DC Timken",
  "128160CD-20000 Timken", "LM272210CD Timken", "384D-20081 Timken", "HM262710CD Timken",
  "HM231111CD Timken", "743DS Timken",
  "421451CD Timken", "HM261010CD Timken", "94117D Timken", "H242610CD-20024 Timken",
  "NA48920D Timken", "28318D-20081 Timken", "672D-20081 Timken", "XC1850DF-40797 Timken",
  "L225812D-20024 Timken", "L540010D-20024 Timken", "M231610CD-30000 Timken",
  "HM821511D-20024 Timken", "29622D.PREC3 Timken", "562DS Timken", "24262D Timken",
  "200215XH Gamet", "K97753 Timken", "384DPREC.3 Timken", "71751D-20081 Timken",
  "28314XD-20081 Timken", "742D-20024 Timken", "93127CD-20024 Timken", "A4138D-20081 Timken",
  "67920CD-20081 Timken", "56650CD-20081 Timken", "JXC10238DF Timken", "14276D-20081 Timken",
  "66462D SKF", "221576CD Timken", "33472DC Timken", "LM665910CD Timken",
  "291751CD Timken", "L357010CD Timken", "17245D Timken", "110050/110100G Gamet",
  "HH234011CD Timken", "HH224310CD Timken", "99101D Timken", "932CD Timken",
  "96140CD Timken", "592D-20081 Timken", "231976CD-20000 Timken", "M919010D-PREC.3 Timken",
  "46720CD-20024 Timken", "42587D-20024 Timken", "H239612CD-20081 Timken", "192201CD Timken",
  "T70125 Timken", "53390D Neutral"
];

function parseDoubleCupItem(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  if (cleanLine.includes("File ") || cleanLine.includes("bearings") || cleanLine.includes("confirms")) return null;

  let brand = "Timken";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "NTN", "Gamet", "Bower", "Neutral"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let od = 145, width = 65;
  let estWeight = (Math.PI * (od*od - (od-32)*(od-32)) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.8) estWeight = "1.85";

  let price = Math.round(parseFloat(estWeight) * 1650 + 950);
  if (price < 950) price = 950;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-dcup-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Double Row Tapered Roller Bearing Outer Ring (Double Cup) ${partNumber}`,
    brand: brand,
    category: "Cup for Tapered Roller Bearings Double Row",
    seriesGroup: "Inch & Metric Double-Row Tapered Roller Bearing Double Cups (TDO Design)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 20) + 8,
    weight: `${estWeight}kg`,
    innerDiameter: null,
    outerDiameter: od,
    width: width,
    material: "High-Grade Case-Hardened Alloy Steel with Central Lubrication Groove & Oil Holes",
    sealType: "Open (Precision Ground Dual Internal Tapered Raceways)",
    cageType: "Double-Row Tapered Outer Cup Component",
    loadRating: "Matched Double Cup (Paired with Two Single Cones in TDO Arrangement)",
    speedRating: `${Math.round(350000 / od)} RPM`,
    countryOfOrigin: brand === "Timken" || brand === "Bower" ? "USA" : brand === "Gamet" ? "UK" : "Germany",
    application: "Heavy rolling mill roll neck mountings, crane rope sheaves, industrial gear reducers, planetary hubs, heavy commercial vehicle dual-wheel hubs",
    description: `Genuine ${brand} precision double-row tapered roller bearing double cup (outer ring) ${partNumber}. Solid one-piece outer ring featuring dual internal precision-ground tapered raceways and oil lubrication features for TDO assemblies.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-20024|-30000|-20081|-20N07|-20000|K/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber.replace(/DC|CD|DA/g, 'D') + " /Q", price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_DOUBLE_CUPS.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseDoubleCupItem(line, idx)).filter(Boolean);
  console.log(`[Tapered Double Cup Script] Parsed ${products.length} unique Tapered Roller Bearing Double Cups.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Double Cup Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Cup for Tapered Roller Bearings Double Row to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Cup for Tapered Roller Bearings Double Row"')) {
    dataContent = dataContent.replace(
      /"name": "Cup for Tapered Roller Bearings Single Row",\s*"id": "tapered-single-cup"\s*},/,
      `"name": "Cup for Tapered Roller Bearings Single Row",\n        "id": "tapered-single-cup"\n      },\n      {\n        "name": "Cup for Tapered Roller Bearings Double Row",\n        "id": "tapered-double-cup"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Double Cup Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Double Cup Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Double Cup Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Double Cup Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Double Cup Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Double Cup Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalDoubleCups = await Product.countDocuments({ category: "Cup for Tapered Roller Bearings Double Row" });
    console.log(`[Tapered Double Cup Script] Current Database Totals: ${totalDoubleCups} Cups for Tapered Roller Bearings Double Row.`);
  } catch (err) {
    console.error('[Tapered Double Cup Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Double Cup Script] Done.');
  }
}

main();
