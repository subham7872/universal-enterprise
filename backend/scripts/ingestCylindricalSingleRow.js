import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const RAW_CYLINDRICAL = [
  "NU418-XL-M1-C3 FAG", "NJ211-E-XL-JP3 FAG", "NJ207-E-XL-M1A FAG", "NJ1020-XL-M1-C3 FAG",
  "N313-E-XL-TVP2-C3 FAG", "N216-E-XL-M1-C3 FAG", "N213-E-XL-M1-C3 FAG", "NJ310-E-XL-M1A-C4 FAG",
  "NU314-E-XL-JP3 FAG", "NUP305-E-XL-TVP2-C3 FAG", "NU2205-E-XL-TVP2-C3 FAG", "N321-E-XL-M1-C3 FAG",
  "NU322-E-XL-TVP2 FAG", "NJ218-E-XL-M1-C3 FAG", "NUP313-E-XL-M1 FAG", "N213-E-XL-M1 FAG",
  "NJ417-M1 FAG", "NJ413-C3 FAG", "NJ220-E-M1-C3 FAG", "N214-E-TVP2-C3 FAG",
  "NU3040K.M1A.790081 FAG", "NU238-E-M1 FAG", "RL12.1/2E FAG", "NU408 FAG",
  "NU1014M1 FAG", "NP216E.M1.C3 FAG", "NJ2306E.TVP2.C3 FAG", "NJ2209E.TVP2 FAG",
  "NJ1940E.M1 FAG", "NJ2336-EX-TB-M1 FAG", "NU213-E-XL-JP3 FAG", "NU1026-XL-M1-F1-C4 FAG",
  "NU1015-XL-M1A FAG", "NU312-E-XL-M1-F1-C4 FAG", "NUP319-E-XL-TVP2-C3 FAG", "NU326-E-XL-MPAX-C4 FAG",
  "NJ315-E-XL-MPAX-C4 FAG", "NJ207E.JP3.C3 FAG", "NU311-E-XL-M1-J20AA-C3 FAG", "NJ1052-M1A FAG",
  "RSL182210-A-XL INA", "SL183048A C3 INA", "SL183036-TB INA", "SL182968-TB INA",
  "SL182918-B-XL-C3 INA", "SL182216-A INA", "SL181872-E INA", "SL183032-A INA",
  "NUP244-E-M1 FAG", "N332-E-M1 FAG", "N215-E-TVP2 FAG", "NU1048-M1 FAG",
  "NJ2240-E-M1 FAG", "NJ2238-E-M1 FAG", "NJ316-E-TVP2 FAG", "NUP218E.M1.P6.F1 FAG",
  "NU2334EX.M1 FAG", "NJ309E.M1A.S1 FAG", "NJ215E.M1 FAG", "NU332-E-M1-F1-C4 FAG",
  "NU1076-M1-C3 FAG", "NUP318-E-XL-M1-F1-C4 FAG", "NUP314-E-XL-M1 FAG", "NUP310-E-XL-TVP2-C4 FAG",
  "NUP224-E-XL-M1 FAG", "NUP2236-E-XL-M1-C3 FAG", "NU2336EX.M1.C3.J30PC.W10B FAG", "NU226E.M1.N.C3 FAG",
  "NU2313-E-XL-MPA-H67C-C4 FAG", "NU2313-E-XL-M1-C4 FAG", "NU2312-E-XL-M1A FAG", "NU2222-E-XL-M1-F1-C4 FAG",
  "NU2217-E-XL-M1-F1-C3 FAG", "NU2218-E-XL-M1-J30PC-C3 FAG", "NUP217-E-XL-M1 FAG", "NU2310-E-XL-M1-C4 FAG",
  "NUP310-E-XL-JP3 FAG", "RNU2206-E-XL-TVP2 FAG", "NJ315-E-XL-M1-F1-C4 FAG", "NJ310-E-XL-JP3-C3 FAG",
  "NJ236-E-XL-M1A-J30PC-C3 FAG", "NJ2324-E-XL-M1A-J30PC-C3 FAG", "NJ2322-E-XL-M1A-QP51-C4 FAG",
  "NJ418-XL-M1 FAG", "NJ417-XL-M1-C4 FAG", "NJ411-XL-M1A-C4 FAG", "NJ326-E-XL-M1-C4 FAG",
  "NJ316-E-XL-M1A-QP51-C4 FAG"
];

// ISO series factors for cylindrical rollers
const CYL_SERIES = {
  "10": { odRatio: 1.45, wRatio: 0.22, name: "1000 Series (Extra Light)" },
  "19": { odRatio: 1.35, wRatio: 0.18, name: "1900 Series (Thin Section)" },
  "2":  { odRatio: 1.80, wRatio: 0.32, name: "200 Series (Light)" },
  "22": { odRatio: 1.80, wRatio: 0.45, name: "2200 Series (Wide Light)" },
  "3":  { odRatio: 2.15, wRatio: 0.42, name: "300 Series (Medium)" },
  "23": { odRatio: 2.15, wRatio: 0.62, name: "2300 Series (Wide Medium)" },
  "4":  { odRatio: 2.45, wRatio: 0.55, name: "400 Series (Heavy)" },
  "30": { odRatio: 1.48, wRatio: 0.35, name: "3000 Series (Full Complement SL18)" },
  "29": { odRatio: 1.38, wRatio: 0.28, name: "2900 Series (Full Complement SL18)" },
  "18": { odRatio: 1.32, wRatio: 0.22, name: "1800 Series (Full Complement SL18)" }
};

function parseCylindricalItem(line) {
  let parts = line.trim().split(/\s+/);
  let brand = parts.pop().toUpperCase();
  let partNumber = parts.join(' ').replace(/,/g, '.');

  let clean = partNumber;

  // Extract prefix & series code & bore
  let prefix = "NU";
  let series = "2";
  let bore = 80;

  let slMatch = clean.match(/(?:R)?SL18(\d{2})(\d{2})/);
  let isoMatch = clean.match(/^(NU|NJ|NUP|N|RNU|NP|RL)(\d{1,2})(\d{2})/);
  let nu30Match = clean.match(/^NU30(\d{2})/);

  if (slMatch) {
    prefix = clean.startsWith("RSL") ? "RSL18" : "SL18";
    let sCode = slMatch[1];
    let bCode = parseInt(slMatch[2], 10);
    series = sCode;
    bore = bCode * 5;
  } else if (nu30Match) {
    prefix = "NU";
    series = "30";
    bore = parseInt(nu30Match[1], 10) * 5;
  } else if (isoMatch) {
    prefix = isoMatch[1];
    series = isoMatch[2];
    let bCode = parseInt(isoMatch[3], 10);
    if (bCode === 4) bore = 20;
    else if (bCode === 5) bore = 25;
    else if (bCode === 6) bore = 30;
    else if (bCode === 7) bore = 35;
    else if (bCode === 8) bore = 40;
    else if (bCode === 9) bore = 45;
    else bore = bCode * 5;
  } else if (clean.startsWith("RL")) {
    prefix = "RL";
    bore = 63.5; // 2.5 inch
    series = "2";
  }

  let sInfo = CYL_SERIES[series] || { odRatio: 1.8, wRatio: 0.35, name: `${prefix}${series}00 Series` };
  let od = Math.round(bore * sInfo.odRatio);
  let width = Math.round(bore * sInfo.wRatio);
  if (width < 14) width = 14;

  // Clearance
  let clearance = "Normal (CN)";
  if (clean.includes("-C3") || clean.includes(".C3") || clean.includes(" C3") || clean.endsWith("C3")) clearance = "C3 (Greater than Normal)";
  else if (clean.includes("-C4") || clean.includes(".C4") || clean.endsWith("C4")) clearance = "C4 (Greater than C3)";
  else if (clean.includes("-C2") || clean.includes(".C2")) clearance = "C2 (Radial Clearance Reduced)";

  // Cage type
  let cage = "Machined Solid Brass Roller Guided (M1)";
  if (clean.includes("TVP") || clean.includes("TVP2")) cage = "Glass-Fibre Reinforced Polyamide (TVP2)";
  else if (clean.includes("JP3") || clean.includes("JP") || clean.includes(".JP")) cage = "Sheet Steel Window-Type Cage (JP3)";
  else if (clean.includes("MPA") || clean.includes("MPAX") || clean.includes("M1A")) cage = "Machined Solid Brass Outer-Ring Guided (MPA/M1A)";
  else if (clean.includes("TB")) cage = "Laminated Phenolic Resin / Textile Cage (TB)";
  else if (prefix.includes("SL18")) cage = "Full Complement Cylindrical Rollers (Cageless High Radial Capacity)";

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.1) estWeight = "0.35";

  let dyn = Math.round(bore * width * 0.15);
  let stat = Math.round(dyn * 1.25);

  let price = Math.round(parseFloat(estWeight) * 1650 + 950);
  if (price < 950) price = 950;

  let cleanId = `${brand.toLowerCase()}-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  let configDesc = "Non-Locating (Floating) Radial Bearing";
  if (prefix === "NJ") configDesc = "Semi-Locating Axial Unidirectional Radial Bearing";
  if (prefix === "NUP") configDesc = "Locating Axial Bidirectional Radial Bearing with Collar Ring";
  if (prefix === "N") configDesc = "Non-Locating Inner-Ring Guided Radial Bearing";
  if (prefix.includes("SL18")) configDesc = "Full Complement Heavy Duty Single Row Cylindrical Roller Bearing";

  return {
    id: cleanId,
    partNumber: clean,
    name: `${brand} Single Row Cylindrical Roller Bearing ${clean}`,
    brand: brand,
    category: "Cylindrical Roller Bearings Single Row",
    seriesGroup: `${prefix} Series (${sInfo.name})`,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 30) + 10,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (X-life / Schaeffler Quality)",
    sealType: "Open (Precision Ground Raceways)",
    cageType: cage,
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(420000 / od)} RPM`,
    countryOfOrigin: "Germany",
    application: "Electric motors, heavy industrial gearboxes, wind turbine generator sets, railway axleboxes, machine tool spindles, rolling mill drives",
    description: `Genuine ${brand} high-precision single row cylindrical roller bearing ${clean}. Engineered with optimized logarithmic roller profile for maximum radial load capacity, exceptional high-speed capability, and low operating temperature. Configuration: ${configDesc}. Clearance: ${clearance}.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: clean.replace(/-XL|-E|-M1A|-M1|-TVP2|-JP3/g, '').replace(/K\./g, ' K ') + " ECM", price: Math.round(price * 1.1) },
      { brand: "NSK", partNumber: clean.replace(/-XL|-E/g, '') + " EM", price: Math.round(price * 1.04) },
      { brand: "NTN", partNumber: clean.replace(/-XL/g, '').replace(/-E/g, '') + "E", price: Math.round(price * 1.02) }
    ]
  };
}

async function main() {
  const products = RAW_CYLINDRICAL.map(line => parseCylindricalItem(line));
  console.log(`[Cylindrical Script] Parsed ${products.length} Single Row Cylindrical Roller Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Cylindrical Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Cylindrical Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Cylindrical Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Cylindrical Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Cylindrical Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Cylindrical Script] Connected to MongoDB Atlas.');

    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

    const bulkOps = products.map(prod => ({
      updateOne: {
        filter: { partNumber: prod.partNumber },
        update: { $set: prod },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(bulkOps);
    console.log(`[Cylindrical Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalCylindrical = await Product.countDocuments({ category: "Cylindrical Roller Bearings Single Row" });
    const totalFAG = await Product.countDocuments({ brand: "FAG" });
    const totalINA = await Product.countDocuments({ brand: "INA" });
    console.log(`[Cylindrical Script] Current Database Totals: ${totalCylindrical} Single Row Cylindrical Roller Bearings | ${totalFAG} FAG | ${totalINA} INA.`);
  } catch (err) {
    console.error('[Cylindrical Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Cylindrical Script] Done.');
  }
}

main();
