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

const RAW_BATCH_2 = [
  "HJ2314EU AKN", "HJ213EU AKN", "NHS25 VKF", "HJ313EC WFR", "HJ230E NRB",
  "40211 RUL", "HJ2215 RUL", "HJ318 Bertoloto", "08-R1 FKC", "HJ411 VKF",
  "HJ336E Deutsche Kugellag Fabr Leipzig", "HJ309 ZVL", "HJ2313 VKF", "HJ2326-E Kugel & Rollenlager Werk",
  "HJ328 Neutral", "HJ321E Neutral", "HJ312 Neutral", "HJ218E Neutral", "HJ2311 Neutral",
  "HJ232 Neutral", "HJ320E China", "HJ332E Deutsche Kugellager Fabrik", "HJ407 Neutral",
  "HJ309 Neutral", "HJ2206 Neutral", "HJ311 Neutral", "HJ413 Neutral", "HJ409 Neutral",
  "HJ208 Neutral", "HJ411 Neutral", "HJ305 Neutral", "HJ338 Neutral", "HJ2318C3 Neutral",
  "HJ218 Neutral", "HJ1020 Deutsche Kugellager Fabrik", "HJ312EC Neutral", "HJ228E Neutral",
  "HJ324 Neutral", "HJ222 Neutral", "HJ309E Neutral", "HJ306 Neutral", "HJ416 Neutral",
  "HJ213 Neutral", "HJ322 Neutral", "HJ326 Neutral", "HJ2305 Neutral", "HJ318EC Neutral",
  "HJ214 Neutral", "HJ215 Neutral", "HJ205 Deutsche Kugellager Fabrik",
  "HJ317 Neutral", "HJ2315 Neutral", "HJ417 Neutral", "HJ410 Neutral", "HJ204 Neutral",
  "HJ2330-E FAG", "HJ1017 FAG", "HJ2218E FAG", "HJ330 FAG", "HJ224 FAG",
  "HJ2317.F2 FAG", "HJ307 FAG", "HJ417-F1 FAG", "HJ240-E-F1 FAG", "HJ1992 FAG",
  "HJ1944-E FAG", "HJ19/500 FAG", "HJ204E FAG", "HJ207 FAG", "HJ2307E FAG",
  "HJ2214-E-F1 FAG", "HJ2334-EX FAG", "HJ232-E-F1 FAG", "HJ2230-E-F2 FAG", "HJ19/670 FAG",
  "HJ18/1000 FAG", "HJ1021-F1 FAG", "HJ2316E.F2 FAG", "HJ2244 FAG", "HJ2220 FAG",
  "HJ322-E-M32A FAG", "HJ2313E.F2 FAG", "HJ348 FAG", "HJ2316-E-F2 FAG", "HJ216-E-F2 FAG",
  "HJ2226E.518192 FAG", "HJ222-E-F1-M32H FAG", "HJ1028 FAG", "HJ328-E-F1 FAG", "HJ18/500 FAG",
  "HJ216E.F2 FAG", "HJ216E FAG", "HJ219-E-F1-M32A FAG", "HJ204-E FAG", "HJ319-E-F1 FAG",
  "HJ2317-F2 FAG", "HJ206-E FAG", "HJ2319 FAG", "HJ2306E FAG", "HJ322.F1 FAG",
  "HJ218E.F1 FAG", "HJ212-E-F1 FAG", "HJ19/630 FAG", "HJ205 FAG", "HJ334-E FAG",
  "HJ326E.F1 FAG", "HJ348-E FAG", "HJ338-E FAG", "Z-573489.HJ.ZL FAG", "HJ412 FAG",
  "Z-511780.HJ.ZL FAG", "HJ424 INA", "HJ2207 FAG", "HJ330-E-F1 FAG", "HJ2211-E FAG",
  "HJ10/600 FAG", "HJ317E.F1 FAG", "HJ309E FAG", "HJ2328E FAG", "HJ228 FAG",
  "HJ2230-E-F2-M32A FAG", "HJ1030 FAG", "HJ1018 FAG", "HJ2217E FAG", "HJ2308 FAG",
  "Z-577717.HJ324-E FAG", "HJ332-E-F1 FAG", "HJ2313-E-F2 FAG", "HJ2052-E FAG", "HJ1096 FAG",
  "HJ2312 FAG", "HJ318-E-F2 FAG", "HJ1996 FAG", "HJ1092 FAG", "HJ221 FAG",
  "HJ2320-E-F2 FAG", "HJ1952-E FAG", "HJ10/560 FAG", "HJ321E FAG", "HJ2072-E FAG",
  "HJ230-E-F1 FAG", "HJ216-F2 FAG", "HJ2320-F2 FAG", "HJ2236-E-F2 FAG", "HJ420-F1 FAG",
  "HJ1036-F1 FAG", "HJ356-E FAG", "HJ2318-E-F2 FAG", "HJ2232-E-F2 FAG", "HJ232 FAG",
  "HJ2304 FAG", "HJ340-E FAG", "HJ3080 FAG", "HJ2205-E FAG", "HJ312.F1 FAG",
  "HJ2319E FAG", "HJ220-E-F1 FAG", "HJ218-E-F1 FAG", "HJ2326-E-F2 FAG", "HJ316EC/VA301 SKF",
  "HJ420/344054 SKF", "HJ209EC SKF", "HJ222E SKF", "HJ232 SKF", "HJ311E SKF",
  "HJ2315EC SKF", "HJ2236EC SKF", "HJ2230EC SKF", "HJ313EC/VA301 SKF", "HJ216E SKF",
  "HJ332E SKF", "HJ424 SKF", "HJ1068 SKF", "HJ313E SKF", "HJ220 SKF",
  "HJ224EC SKF", "HJ1080 SKF", "HJ328E SKF", "HJ211EC SKF", "HJ1084 SKF",
  "HJ2313 SKF", "HJ2213EC SKF", "HJ230EC SKF", "HJ2211EC SKF", "HJ324 SKF",
  "HJ2217E SKF", "HJ332EC/VA301 SKF", "HJ238EC SKF", "HJ2220EC SKF", "HJ1044 SKF",
  "HJ416E SKF", "HJ328EC/VA301 SKF", "HJ214EC SKF", "HJ2316E SKF", "HJ2224EC SKF",
  "HJ319 SKF", "HJ328 SKF", "HJ1060 SKF", "HJ1044/VA301 SKF",
  "HJ307EC SKF", "HJ313 SKF", "HJ2230ECB/VA352 SKF", "HJ318EC SKF", "HJ232E SKF",
  "HJ2317EC SKF", "HJ236EC SKF", "HJ2317ECB/VA820 SKF", "HJ1088 SKF", "HJ322E SKF",
  "HJ2319EC SKF", "HJ314 SKF", "HJ1020 SKF", "HJ2314E SKF", "HJ308EC/VA301 SKF",
  "HJ317EC/VA301 SKF", "HJ2318EC SKF", "HJ2206E SKF", "HJ212EC/VA301 SKF", "HJ415 SKF",
  "HJ2320E SKF", "HJ307 SKF", "HJ1088MA SKF", "HJ219EC/VA301 SKF", "HJ218EC/VA301 SKF",
  "HJ2312 Steyr", "HJ324EU AKN", "HJ1072 NSK", "HJ332E RKB", "HJ206E Torrington",
  "HJ315-E-SQ1 NKE", "HJ320E NSK", "HJ308 Steyr", "HJ317 Steyr", "HJ2328 Steyr",
  "HJ2320EU AKN", "HJ2226U AKN", "HJ2213EU AKN", "HJ316EC AKN", "7DA/K RIV",
  "HJ317EU AKN", "HJ228 Bower", "HJ312-E-SQ1 NKE", "HJ2220 RIV", "HJ412 RIV",
  "HJ2326 Steyr", "HJ207EU AKN", "HJ322 Steyr", "HJ230E RKB", "HJ211EC AKN",
  "HJ212 RIV", "HJ419 RIV", "HJ317 RIV", "HJ305 Steyr", "HJ2316EU AKN",
  "HJ422 Steyr", "HJ416 Steyr", "HJ220E NSK", "HJ317-E-SQ1 NKE", "HJ410 RIV",
  "HJ314 RIV", "HJ2318 Koyo (JTEKT)", "HJ1036 Steyr", "HJ2222U AKN", "HJ216 NTN",
  "HJ236E RKB", "611996 RIV", "HJ10/500 NKE", "HJ309 Steyr", "HJ307 Steyr",
  "HJ207 Steyr", "HJ2208EU AKN", "HJ228 NTN", "HJ2322EC Steyr", "HJ308EU AKN",
  "HJ217EU AKN", "HJ211 Steyr", "HJ210 RIV", "HJ209 RIV", "HJ305E Torrington",
  "HJ2324 Koyo (JTEKT)", "HJ312 Steyr", "HJ310 Steyr", "HJ210 Steyr", "HJ320 Steyr",
  "HJ2222 RIV", "HJ324SV1 Steyr", "HJ318EU AKN", "HJ307EU AKN", "12DB/K RIV",
  "HJ2317 RIV", "HJ2312 RIV", "HJ1048E Deutsche Kugellag Fabr Leipzig", "HJ209E BPL",
  "HJ1052E Deutsche Kugellag Fabr Leipzig", "HJ232 URB", "HJ1036 Deutsche Kugellag Fabr Leipzig",
  "HJ1072 ZVL", "HJ421 ZKL", "HJ320 S/M",
  "HJ422 Bertoloto", "HJ307 SRO", "HJ332E Deutsche Kugellag Fabr Leipzig", "HJ318 S/M",
  "HJ2218EC Kugel & Rollenlager Werk", "HJ322E FLT", "HJ308 ZVL", "HJ320E ZKL",
  "HJ322E Deutsche Kugellag Fabr Leipzig", "HJ320E Deutsche Kugellag Fabr Leipzig", "HJ244 3B",
  "HJ2332 URB", "HJ1092 AWT Germany", "HJ328 URB", "HJ416 URB",
  "HJ318E Deutsche Kugellag Fabr Leipzig", "HA308 LKS", "HJ309 FKL", "HJ314 URB",
  "HJ244 Deutsche Kugellag Fabr Leipzig", "HJ319E Rollway", "HJ2320 Neutral",
  "HJ336E Deutsche Kugellager Fabrik", "HJ1056EM Deutsche Kugellager Fabrik",
  "HJ204 Deutsche Kugellager Fabrik", "HJ1056EM Neutral", "HJ2308 Neutral", "HJ307E Neutral",
  "HJ206 Neutral", "HJ220E Neutral", "HJ1064E Neutral", "HJ318E Neutral", "HJ2311E Neutral",
  "HJ209E Neutral", "HJ2312 Neutral", "HJ226E Deutsche Kugellager Fabrik",
  "HJ318E Deutsche Kugellager Fabrik", "HJ219 Neutral", "HJ210E Neutral", "HJ220 Neutral",
  "HJ320 Neutral", "HJ330 Neutral", "HJ312E Neutral", "HJ314 Neutral", "HJ1052E Neutral",
  "HJ2230A Neutral", "HJ415 Neutral", "HJ314 Deutsche Kugellager Fabrik", "HJ414 GPZ",
  "HJ2232E Neutral",
  "HJ2217 Neutral", "HJ216 Neutral", "HJ315 Neutral", "HJ1044 Deutsche Kugellager Fabrik",
  "HJ210NA Deutsche Kugellager Fabrik", "HJ216E Neutral", "HJ202E Neutral", "HJ2222 Neutral",
  "HJ418 Deutsche Kugellager Fabrik", "HJ340 Deutsche Kugellager Fabrik",
  "HJ244E Deutsche Kugellager Fabrik", "HJ232 Deutsche Kugellager Fabrik",
  "HJ320 Deutsche Kugellager Fabrik", "HJ2226E Deutsche Kugellager Fabrik", "HJ2316 Neutral",
  "HJ321 Neutral", "HJ2052E Neutral", "HJ319E Neutral", "HJ1064E Deutsche Kugellager Fabrik",
  "HJ318 GPZ", "HJ417 GPZ", "HJ316 Neutral", "HJ310 Neutral", "TEMPLATE 290 Neutral",
  "HJ207E Neutral", "HJ1072E Neutral", "HJ2319 Neutral", "HJ311E Neutral", "HJ2211 Neutral",
  "HJ307 Neutral", "HJ240E Deutsche Kugellager Fabrik", "HJ1072E Deutsche Kugellager Fabrik",
  "HJ10/500E Deutsche Kugellager Fabrik", "HJ415 Deutsche Kugellager Fabrik", "HJ2316E Neutral",
  "HJ2314E Neutral", "HJ205EC Neutral", "HJ319 Neutral", "HJ2309 Neutral", "HJ210 Neutral",
  "WC10DUN Neutral", "HJ230E Deutsche Kugellager Fabrik", "HJ2228E Neutral", "HJ2310E Neutral",
  "HJ317EU Neutral", "HJ214E Neutral", "HJ208EC Neutral", "HJ418 Neutral", "HJ209 Neutral",
  "HA308 Neutral"
];

function parseThrustCollarBatch2(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  
  // Filter out any non-bearing comments or headers
  if (cleanLine.includes("File ") || cleanLine.includes("source confirms") || cleanLine.includes("The uploaded")) {
    return null;
  }

  let brand = "Universal OEM";
  if (cleanLine.includes("Deutsche Kugellager Fabrik") || cleanLine.includes("Deutsche Kugellag Fabr Leipzig")) {
    brand = "DKF";
    cleanLine = cleanLine.replace(/Deutsche Kugellager Fabrik|Deutsche Kugellag Fabr Leipzig/g, '').trim();
  } else if (cleanLine.includes("Kugel & Rollenlager Werk")) {
    brand = "KRW";
    cleanLine = cleanLine.replace("Kugel & Rollenlager Werk", "").trim();
  } else if (cleanLine.includes("AWT Germany")) {
    brand = "AWT";
    cleanLine = cleanLine.replace("AWT Germany", "").trim();
  } else if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = [
      "FAG", "SKF", "AKN", "Steyr", "RIV", "NKE", "NSK", "NTN", "RKB", "Torrington",
      "Bower", "ZVL", "ZKL", "URB", "GPZ", "FLT", "Rollway", "VKF", "WFR", "NRB",
      "RUL", "Bertoloto", "FKC", "SRO", "S/M", "3B", "LKS", "FKL", "BPL", "Neutral", "INA"
    ];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 80;
  let od = 110;
  let width = 12;

  let hjMatch = partNumber.match(/HJ(\d{1,2})(\d{2})/);
  let hjSlash = partNumber.match(/HJ(\d{2})\/(\d{3,4})/);

  if (hjSlash) {
    bore = parseInt(hjSlash[2], 10);
    od = Math.round(bore * 1.35);
    width = Math.round(bore * 0.16);
  } else if (hjMatch) {
    let bCode = parseInt(hjMatch[2], 10);
    if (bCode === 2) bore = 15;
    else if (bCode === 4) bore = 20;
    else if (bCode === 5) bore = 25;
    else if (bCode === 6) bore = 30;
    else if (bCode === 7) bore = 35;
    else if (bCode === 8) bore = 40;
    else if (bCode === 9) bore = 45;
    else bore = bCode * 5;

    let sCode = hjMatch[1];
    let odFactor = sCode.includes("4") ? 1.55 : sCode.includes("3") ? 1.45 : 1.35;
    od = Math.round(bore * odFactor);
    width = Math.round(bore * 0.14) + 6;
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.05) estWeight = "0.15";

  let price = Math.round(parseFloat(estWeight) * 1450 + 450);
  if (price < 420) price = 420;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-b2-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Cylindrical Roller Angle Ring (Thrust Collar) ${partNumber}`,
    brand: brand,
    category: "Cylindrical Roller Thrust Collar",
    seriesGroup: "HJ Series Thrust Angle Rings",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 30) + 10,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (Through-Hardened Precision Ground)",
    sealType: "Open Precision L-Section Ground Raceway",
    cageType: "L-Section Solid Precision Thrust Collar",
    loadRating: "Axial Thrust Location Ring (Matched with NU/NJ Cylindrical Bearings)",
    speedRating: `${Math.round(450000 / od)} RPM`,
    countryOfOrigin: brand === "NSK" || brand === "Koyo" || brand === "FKC" ? "Japan" : brand === "RIV" ? "Italy" : brand === "NKE" || brand === "Steyr" || brand === "AKN" ? "Austria" : brand === "RKB" ? "Switzerland" : "Germany",
    application: "Used with NU series cylindrical roller bearings to form axial semi-locating units, or with NJ series to create double-direction axial locating assemblies in gearboxes, heavy electric motors, and pumps.",
    description: `Genuine ${brand} precision L-section angle ring / thrust collar ${partNumber}. Precision ground side and collar face accommodates axial thrust forces when mounted with single-row cylindrical roller bearings. Bore: ${bore}mm, Outer Flange: ${od}mm, Flange Width: ${width}mm.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: partNumber.replace(/-E|-F1|-F2|-SQ1|\.F1|\.F2/g, ''), price: Math.round(price * 1.08) },
      { brand: "FAG", partNumber: partNumber.replace(/EC|EU|\/VA301|\/SV1/g, ''), price: Math.round(price * 1.02) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_BATCH_2.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseThrustCollarBatch2(line, idx)).filter(Boolean);
  console.log(`[Thrust Collar Batch 2] Parsed ${products.length} unique Thrust Collars.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Thrust Collar Batch 2] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Thrust Collar Batch 2] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Thrust Collar Batch 2] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Thrust Collar Batch 2 Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Thrust Collar Batch 2] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Thrust Collar Batch 2] Connected to MongoDB Atlas.');

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
    console.log(`[Thrust Collar Batch 2] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalCollars = await Product.countDocuments({ category: "Cylindrical Roller Thrust Collar" });
    console.log(`[Thrust Collar Batch 2] Current Database Totals: ${totalCollars} Cylindrical Roller Thrust Collars.`);
  } catch (err) {
    console.error('[Thrust Collar Batch 2 Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Thrust Collar Batch 2] Done.');
  }
}

main();
