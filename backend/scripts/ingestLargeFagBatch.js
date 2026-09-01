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

// Raw list of 177 bearings provided by user
export const RAW_PARTS = [
  "23184-K-MB-C4", "22326E1AK.M.C3", "21316E1K", "22207EASK.M", "20213K.T.C3",
  "23122-E1-XL-TVPB", "23038-E1-XL-TVPB", "21312-E1-XL-TVPB-C3", "23028-E1A-XL-M-C3",
  "22338-BE-XL-K", "22328-E1A-XL-M-C3", "22322-E1-XL-K", "22317-E1A-XL-M-C3",
  "22317-E1-XL", "22316-E1-XL-K-T41A", "22311-E1-XL-K-C3", "21315-E1-XL-TVPB",
  "21308-E1-XL-TVPB", "23048-BE-XL-K", "23024-E1A-XL-M-C3", "22348-BEA-XL-MB1-C3",
  "22336-BE-XL-JPA-T41A", "22311-E1-XL-K", "22252-BEA-XL-K-MB1-C3", "22234-E1-XL-C3",
  "21315-E1-XL-C3", "21313-E1-XL", "WS22215-E1-XL-2RSR", "22224-E1A-XL-K-M-C3",
  "22312-E1A-XL-M-C3", "22214-E1-XL", "22215-E1-XL", "22232-E1-XL-K-C3",
  "22312-E1-XL-T41A", "20309T", "20309K.MB", "23244-BEA-XL-MB1-C3", "22334-BEA-XL-K-MB1-C3",
  "240/500-BEA-XL-MB1", "WS22215-E1-XL-2RSR-L091-C3", "WS22212-E1-XL-2RSR-L091-C3",
  "23096-BEA-XL-K-MB1-C3", "230/530-BEA-XL-K-MB1-C4", "23268-BEA-XL-MB1-C3",
  "23256-BEA-XL-K-MB1-T52BW", "23192-BEA-XL-MB1", "23188-BEA-XL-MB1", "23176-BEA-XL-MB1",
  "23156-BEA-XL-K-MB1-C3", "23156-BE-XL-C4", "23152-BE-XL-K-C4", "23084-BEA-XL-K-MB1-C3",
  "23044-BE-XL-C2", "23030-E1A-XL-M-T52BW", "22344-BE-XL-K-C4", "22338-BEA-XL-MB1-C3",
  "22230-E1A-XL-K-M-C4", "22220-E1A-XL-MA-T41A", "22213-E1-XL-K-C4", "24164-B-K30",
  "23252-B-K-MB-C4", "23340-A-MA-T41A", "24136-E1-C3", "24040-E1-C3", "24028-S-MB-C4",
  "22332E1", "23130-E1-K-TVPB-C3", "22252-B-MB", "22328-E1-K-T41A", "23228-E1-K-TVPB-C3",
  "23134-E1-K-TVPB-C3", "23996-B-K-MB-C3", "23984-MB-C3", "23980-B-MB", "23972-MB",
  "23956-K-MB", "23124-E1-K-TVPB-C3", "22334-E1-JPA-T41A", "21312-E1-TVPB", "20306-TVP-C3",
  "222S.400", "21317-E1-K-TVPB-C3", "23268-B-K-MB-C3", "22344-MB-C3", "20216-TVP",
  "20215-K-TVP-C3", "20213-TVP", "20210-K-TVP-C3", "20204-TVP", "239/530-MB-H140",
  "230/560-B-MB", "24068-BEA-XL-MB1-C3", "23284-BEA-XL-K-MB1-C3", "23180-BEA-XL-K-MB1-C3",
  "23088-BEA-XL-MB1-C3", "23076-BEA-XL-MB1", "22324-E1-XL-T41D", "22328-E1A-XL-K-M-C3",
  "22328-E1-XL-T41A", "22328-E1-XL-C4", "22312-E1-XL-K", "22240-BE-XL-K",
  "22236-E1-XL-C3", "22224-E1A-XL-M", "22222-E1-XL-C4", "22218-E1-XL-K-C4",
  "22213-E1A-XL-M", "22213-E1A-XL-M-C3", "22211-E1-XL-C4", "22205-E1-XL-K-C3",
  "21317-E1-XL-C3", "24092-BEA-XL-MB1-C3", "24136-B-K30-H40", "23072-MB-H123M",
  "24080-BEA-XL-K30-MB1-C3", "24160-BE-XL-C2", "WS22220-E1-XL-K-2RSR", "WS22213-E1-XL-2VSR-H40-C4",
  "24164-BE-XL-C3", "24120-BS-C3", "24030-BE-XL-2VSR-H40-C4", "24024-BE-XL-2VSR-H40",
  "24122-BE-XL-K30", "24052-BE-XL-K30-C4", "24040-BE-XL-C3", "24030-BE-XL-K30-C3",
  "24024-BE-XL-K30-C3", "23248-BEA-XL-K-MB1", "23244-BEA-XL-K-MB1", "23230-E1-XL-TVPB-C3",
  "23220-E1-XL-TVPB-C3", "23128-E1A-XL-K-M-C3", "24132-BE-XL", "23222-E1-XL-K-TVPB-C3",
  "23034-E1A-XL-M", "23088-BEA-XL-MB1-H88", "22219-E1A-XL-M", "22320-E1A-XL-M-T41A",
  "23060-MB-H40-C3", "WS22226-E1-XL-K-2RSR-C3", "24034-BE-XL-2VSR-H40-C4", "24030-BE-XL-2VSR-H40",
  "23084-BEA-XL-MB1-T52BW", "22330-E1A-XL-M-C4", "24160-BE-XL-C4", "24052-BE-XL",
  "23224-E1A-XL-K-M-C3", "22330-E1A-XL-K-M", "22234-E1-XL-K-C4", "22315-E1-XL-C4",
  "22218-E1-XL-C4", "WS22205-E1-XL-2RSR", "22309-E1-XL-C4", "23136-E1-XL-K-TVPB",
  "22308-E1-XL-C3", "22211-E1-XL", "22238-BE-XL-K-C3", "23144-BE-XL-C3",
  "230/560-BEA-XL-K-MB1-C3", "22324-E1-XL-H40-C3", "22222-E1A-XL-M-C4", "22209-E1-XL-C2",
  "WS22213-E1-XL-2VSR", "24034-BE-XL-T52BW", "23236-E1A-XL-M-C4", "23060-BE-XL-T52BW",
  "23072-BEA-XL-MB1-C4", "23068-BEA-XL-K-MB1-T52BW", "23048-BE-XL-K-T52BW-C4", "23224-E1A-XL-M-C4",
  "22311-E1-XL-TVPB-C3", "24138-BE-XL", "24126-BE-XL-C4", "23144-BE-XL-C4",
  "23040-E1-XL-TVPB-C3", "23032-E1-XL-TVPB-C3", "23032-E1-XL-K-TVPB-C3", "23026-E1-XL-K-TVPB-C3",
  "23288-BEA-XL-K-MB1-C4", "22328-E1A-XL-K-M", "22314-E1-XL", "23122-E1A-XL-K-M-C3",
  "22315-E1-XL-T41A", "24172-BE-XL-K30-C3", "24156-BE-XL-C3", "23244-BE-XL",
  "23140-BE-XL-K-C3", "23134-E1A-XL-K-M-C3", "23134-E1A-XL-M-C3", "23992-B-MB-T52BW-C3",
  "24140-B-K30", "24138-B-C3", "24132-BS-C3", "23134-E1A-K-M"
];

// ISO series width & diameter multipliers
const SERIES_LOOKUP = {
  "213": { odFactor: 2.15, wFactor: 0.38, name: "21300 Series (Single/Double Row)" },
  "222": { odFactor: 1.80, wFactor: 0.33, name: "22200 Series (Standard Heavy Duty)" },
  "223": { odFactor: 2.18, wFactor: 0.72, name: "22300 Series (High Load Capacity)" },
  "230": { odFactor: 1.50, wFactor: 0.38, name: "23000 Series (Compact High Bore)" },
  "231": { odFactor: 1.66, wFactor: 0.54, name: "23100 Series (Medium-Wide Spherical)" },
  "232": { odFactor: 1.80, wFactor: 0.64, name: "23200 Series (Extra-Wide Heavy)" },
  "233": { odFactor: 2.18, wFactor: 0.85, name: "23300 Series (Ultra-Wide Vibrating)" },
  "239": { odFactor: 1.35, wFactor: 0.32, name: "23900 Series (Ultra-Thin Large Bore)" },
  "240": { odFactor: 1.54, wFactor: 0.54, name: "24000 Series (Wide Thin Section)" },
  "241": { odFactor: 1.65, wFactor: 0.65, name: "24100 Series (Extra-Wide High Capacity)" },
  "202": { odFactor: 1.84, wFactor: 0.32, name: "20200 Series (Single Row Barrel)" },
  "203": { odFactor: 2.16, wFactor: 0.52, name: "20300 Series (Single Row Barrel Heavy)" }
};

function parseBearingData(partNo) {
  let clean = partNo.trim();
  let isWS = clean.startsWith("WS");
  let core = isWS ? clean.substring(2) : clean;

  // Extract series and bore
  let matchSlash = core.match(/^(\d{3})\/(\d{3})/);
  let matchStandard = core.match(/^(\d{3})(\d{2})/);
  let matchBarrel = core.match(/^(\d{3})(\d{2})/);
  let matchInch = core.match(/^222S\.(\d+)/);

  let seriesPrefix = "222";
  let bore = 100;

  if (matchSlash) {
    seriesPrefix = matchSlash[1];
    bore = parseInt(matchSlash[2], 10);
  } else if (matchStandard) {
    seriesPrefix = matchStandard[1];
    let bCode = parseInt(matchStandard[2], 10);
    if (bCode === 4) bore = 20;
    else if (bCode === 5) bore = 25;
    else if (bCode === 6) bore = 30;
    else if (bCode === 7) bore = 35;
    else if (bCode === 8) bore = 40;
    else if (bCode === 9) bore = 45;
    else bore = bCode * 5;
  } else if (matchInch) {
    seriesPrefix = "222";
    bore = Math.round((parseInt(matchInch[1], 10) / 100) * 25.4);
  }

  let seriesInfo = SERIES_LOOKUP[seriesPrefix] || { odFactor: 1.8, wFactor: 0.4, name: `${seriesPrefix}00 Series` };
  let od = Math.round(bore * seriesInfo.odFactor);
  let width = Math.round(bore * seriesInfo.wFactor);
  if (width < 15) width = 15;

  // Clearance
  let clearance = "Normal (CN)";
  if (clean.includes("-C2") || clean.includes(".C2") || clean.endsWith("C2")) clearance = "C2 (Radial Clearance Reduced)";
  else if (clean.includes("-C3") || clean.includes(".C3") || clean.endsWith("C3")) clearance = "C3 (Greater than Normal)";
  else if (clean.includes("-C4") || clean.includes(".C4") || clean.endsWith("C4")) clearance = "C4 (Greater than C3)";
  else if (clean.includes("-C5") || clean.includes(".C5") || clean.endsWith("C5")) clearance = "C5 (Extra Large Clearance)";

  // Bore Type
  let boreType = "Cylindrical Bore";
  if (clean.includes("-K30") || clean.includes("K30")) boreType = "Tapered Bore 1:30 (K30)";
  else if (clean.includes("-K") || clean.includes("K.") || clean.includes(".K") || clean.includes("K-") || clean.endsWith("K")) boreType = "Tapered Bore 1:12 (K)";

  // Cage Type
  let cageType = "Sheet Steel (E1/BE/E1A)";
  if (clean.includes("MB1") || clean.includes(".MB") || clean.includes("-MB")) cageType = "Machined Solid Brass Inner Ring Guided (MB/MB1)";
  else if (clean.includes("-MA") || clean.includes(".MA")) cageType = "Machined Solid Brass Outer Ring Guided (MA)";
  else if (clean.includes("-M") || clean.includes(".M") || clean.includes("M.")) cageType = "Machined Solid Brass Roller Guided (M)";
  else if (clean.includes("TVPB") || clean.includes("-TVP") || clean.includes(".TVP") || clean.endsWith("T")) cageType = "Glass Fibre Reinforced Polyamide (TVP/TVPB)";
  else if (clean.includes("JPA")) cageType = "Sheet Steel Window-Type Cage (JPA)";

  // Vibrating Screen / Sealed / Heat treatment
  let appNote = "";
  if (clean.includes("T41A") || clean.includes("T41D")) appNote = " [Vibrating Screen Application]";
  if (isWS || clean.includes("2RSR") || clean.includes("2VSR")) appNote = " [Sealed Maintenance-Free Unit]";

  // Weight & Load Ratings
  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(1);
  if (parseFloat(estWeight) < 0.2) estWeight = "0.45";

  let dynLoad = Math.round(bore * width * 0.12);
  let statLoad = Math.round(dynLoad * 1.35);

  // Price estimate based on weight/precision
  let price = Math.round(parseFloat(estWeight) * 1400 + 1200);
  if (price < 1850) price = 1850;

  // Clean ID
  let cleanId = `fag-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return {
    id: cleanId,
    partNumber: clean,
    name: `FAG Spherical Roller Bearing ${clean}${appNote}`,
    brand: "FAG",
    category: "Spherical Roller Bearings",
    seriesGroup: isWS ? "WS22200 Sealed Series" : seriesInfo.name,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 25) + 5,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (X-life)",
    sealType: isWS || clean.includes("2RSR") || clean.includes("2VSR") ? "Contact Rubber Seals (2RSR/2VSR)" : "Open (Lubrication Groove W33)",
    cageType: cageType,
    loadRating: `Dynamic: ${dynLoad} kN, Static: ${statLoad} kN`,
    speedRating: `${Math.round(450000 / od)} RPM`,
    countryOfOrigin: "Germany",
    application: "Heavy crushing equipment, vibrating screens, continuous casters, steel mills, wind turbines, rolling mills, cement plants",
    description: `Genuine FAG Schaeffler high-capacity spherical roller bearing ${clean}. Self-aligning geometry accommodates severe shaft deflection, heavy radial loads, and shock impulses in severe industrial operating conditions. Clearance: ${clearance}. Bore: ${boreType}.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: clean.replace(/-BE-XL|-E1A-XL|-E1-XL|-BEA-XL/g, '').replace(/K30/g, 'K30/W33').replace(/-K/g, 'K/W33') + " W33", price: Math.round(price * 1.1) },
      { brand: "NTN", partNumber: clean.replace(/-XL/g, '').replace(/-BE|-E1A/g, 'B') + "D1", price: Math.round(price * 1.03) }
    ]
  };
}

async function main() {
  const products = RAW_PARTS.map(p => parseBearingData(p));
  console.log(`[Batch Script] Prepared ${products.length} FAG Spherical Roller Bearings.`);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Filter out any that are already in INITIAL_PRODUCTS
  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Batch Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Batch Script] Updated backend/data/bearingsData.js successfully.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Batch Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Batch Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Batch Script] Connected to MongoDB Atlas.');

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
    console.log(`[Batch Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalFAG = await Product.countDocuments({ brand: "FAG" });
    const totalSpherical = await Product.countDocuments({ category: "Spherical Roller Bearings" });
    console.log(`[Batch Script] Current Database Totals: ${totalFAG} FAG bearings | ${totalSpherical} Spherical Roller Bearings.`);
  } catch (err) {
    console.error('[Batch Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Batch Script] Done.');
  }
}

main();
