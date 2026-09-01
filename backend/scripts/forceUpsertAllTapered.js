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

const RAW_TAPERED = [
  '32238-XL FAG', '32009-X-XL FAG', '32264-XL FAG', '32205-XL FAG', '32211-XL FAG',
  '32320-A FAG', '32314-BA FAG', '30306-A FAG', '30303-A FAG', '33117 FAG',
  'Z-580716.TR1 FAG', '31318 FAG', 'Z-530994.TR1 FAG', 'F-622917.TR1-WPOS FAG', 'T5ED060 FAG',
  '30215-A-P5 FAG', '30213-A-P5 FAG', 'KM12649-M12610 FAG', '33210 FAG', '33021 FAG',
  '33015 FAG', '32308-B-XL-W10B FAG', 'T7FC045-XL-H148 FAG', 'T7FC095-XL-H83A-W60E FAG',
  'F-575303.10.TR1-WPO FAG', 'K72200-72487 FAG', '511482 FAG', '32044-X-XL FAG',
  '32012-X-XL FAG', '32011-X-XL FAG', '32214-A-P5 FAG', '32336 FAG',
  'KLM67048-LM67010 FAG', '32236-A FAG', '32209-A FAG', '30317-A FAG', '32304-A FAG',
  '32238-A FAG', '32212-A FAG', '30316-A FAG', '320/28-X FAG', '32026-X-XL FAG',
  '511050 FAG', '32324-A FAG', 'KM86649-M86610 FAG', 'KLM806649-LM806610 FAG',
  '31315-XL FAG', '30228-XL FAG', '32028-X-XL-P5 FAG', '32019-X-XL FAG',
  'K15578-15520-DY FAG', '573033 FAG', 'T4CB140 FAG', '33011-XL FAG', '33010-XL FAG',
  '30209-DY FAG', '32230-XL-P5 FAG', 'KLM300849-LM300811-CZ FAG', 'Z-528983.02.TR1 FAG',
  'KLL365348-LL365310 FAG', 'KJM734449-JM734410 FAG', '32030-X-XL FAG', '32218-XL-P5 FAG',
  '30218-XL FAG', '30216-XL FAG', '30210-XL FAG', '30212-XL FAG', '32215-XL FAG',
  '30205-A FAG', '30310-A FAG', '30309-A FAG', '30313-A FAG', '32210-A FAG',
  '32207-A FAG', '30311-A FAG', '30314-A FAG', '30312-A FAG', '32206-A FAG',
  '30207-A FAG', '30305-A FAG', '30206-A FAG', '30304-A FAG', '30208-A FAG',
  '30203-A FAG', '32204-A FAG', '30202-A FAG',
  '31308-XL-P6X FAG', '30248-XL FAG', '32938-XL FAG', '32216-XL FAG', '32207-XL FAG',
  '32052-X-XL FAG', '30336 FAG', '507793A FAG', '33209 FAG', '33118 FAG',
  '33116 FAG', '30308-A FAG', '30204-DY FAG', '515571 FAG', '33016 FAG',
  'Z-530995.TR1 FAG', '32308-B-XL-P6X-W10B FAG', '30308-DY FAG',
  '30206-DY FAG', '30208-DY FAG', '30205-DY FAG', '30310-DY FAG', '30309-DY FAG',
  '30207-DY FAG', '30312-DY FAG', '32207-B FAG', '32209-B FAG', '32208-B FAG',
  '32206-B FAG', '32205-B FAG', '32204-B FAG', '32309-B FAG', '32308-B FAG',
  '32307-B FAG', '32306-B FAG', '32305-B FAG', '32304-B FAG', '32303-B FAG',
  '31322-X-XL FAG', '31320-X-XL FAG', '31319-X-XL FAG', '31318-X-XL FAG',
  '31317-X-XL FAG', '31316-X-XL FAG', '31315-X-XL FAG', '31314-X-XL FAG',
  '31313-X-XL FAG', '31312-X-XL FAG', '31311-X-XL FAG',
  '32324 FAG', '30210-A-R FAG', '32016-X-XL-P5 FAG', '32310-B FAG', '30217-A-P5 FAG',
  '30220-A-P5 FAG', '32313-A FAG', '32307-A FAG', '30320-A FAG',
  '30226-XL FAG', '32064-X-XL FAG', '32244-XL FAG', '30236-XL FAG', '32226-XL FAG',
  '30322-XL FAG', '30214-XL FAG', '32005-X-XL FAG', '32006-X-XL FAG', '32007-X-XL FAG',
  '32008-X-XL FAG', '32010-X-XL FAG', '32013-X-XL FAG', '32014-X-XL FAG', '32015-X-XL FAG',
  '32017-X-XL FAG', '32018-X-XL-P5 FAG', '32019-X-XL-P5 FAG', '32020-X-XL-P5 FAG',
  '32021-X-XL-P5 FAG', '32022-X-XL-P5 FAG', '32023-X-XL-P5 FAG', '32024-X-XL-P5 FAG',
  '32025-X-XL-P5 FAG', '32026-X-XL-P5 FAG', '32027-X-XL-P5 FAG', '32028-X-XL-P5 FAG',
  '32029-X-XL-P5 FAG', '32030-X-XL-P5 FAG', '32031-X-XL-P5 FAG', '32032-X-XL-P5 FAG',
  '32034-X-XL-P5 FAG', '32036-X-XL-P5 FAG', '32038-X-XL-P5 FAG', '32040-X-XL-P5 FAG',
  '32044-X-XL-P5 FAG', '32048-X-XL-P5 FAG', '32920-P5 FAG', '32916-H FAG', '535926 FAG'
];

function parseItem(cleanLine, idx) {
  let parts = cleanLine.split(/\s+/);
  let brand = 'FAG';
  let last = parts[parts.length - 1];
  if (last === 'FAG') {
    parts.pop();
    cleanLine = parts.join(' ').trim();
  }
  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 60, od = 110, width = 28;
  let isoMatch = partNumber.match(/^(302|303|313|320|322|323|329|330|331|332)(\d{2})/);
  let slashMatch = partNumber.match(/^320\/(\d{2})/);
  let tMatch = partNumber.match(/T(\d)[A-Z]{2}(\d{3})/);

  if (isoMatch) {
    let sCode = isoMatch[1];
    let bCode = parseInt(isoMatch[2], 10);
    if (bCode === 2) bore = 15;
    else if (bCode === 3) bore = 17;
    else if (bCode === 4) bore = 20;
    else if (bCode === 5) bore = 25;
    else if (bCode === 6) bore = 30;
    else if (bCode === 7) bore = 35;
    else if (bCode === 8) bore = 40;
    else if (bCode === 9) bore = 45;
    else bore = bCode * 5;

    let odFactor = sCode.startsWith('303') || sCode.startsWith('323') ? 2.1 : sCode.startsWith('322') || sCode.startsWith('313') ? 1.85 : 1.55;
    let wFactor = sCode.startsWith('323') || sCode.startsWith('332') ? 0.48 : sCode.startsWith('322') || sCode.startsWith('331') ? 0.38 : 0.28;
    od = Math.round(bore * odFactor);
    width = Math.round(bore * wFactor);
  } else if (slashMatch) {
    bore = parseInt(slashMatch[1], 10);
    od = Math.round(bore * 1.55);
    width = 18;
  } else if (tMatch) {
    bore = parseInt(tMatch[2], 10);
    od = Math.round(bore * 1.6);
    width = Math.round(bore * 0.35);
  } else if (partNumber.startsWith('K') || partNumber.startsWith('KM') || partNumber.startsWith('KLM')) {
    bore = 45;
    od = 80;
    width = 20;
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.15) estWeight = '0.45';
  let price = Math.round(parseFloat(estWeight) * 1650 + 850);

  let precision = 'Standard Precision (ISO Normal)';
  if (partNumber.includes('P5')) precision = 'Precision Grade P5 (ISO Class 5)';
  else if (partNumber.includes('P6X')) precision = 'Precision Grade P6X';

  let cage = 'Pressed Sheet Steel Window-Type Cage';
  if (partNumber.includes('XL')) cage = 'X-life High-Capacity Optimized Sheet Steel Window Cage';

  return {
    id: `fag-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tpr-${idx + 1}`,
    partNumber: partNumber,
    name: `FAG Single Row Tapered Roller Bearing ${partNumber}`,
    brand: 'FAG',
    category: 'Tapered Roller Bearing Single Row',
    seriesGroup: 'ISO Metric Tapered Roller Bearing Series',
    price: price,
    currency: 'INR',
    stockStatus: 'Available',
    stockCount: 20,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: 'High-Grade 100Cr6 Case/Through-Hardened Chrome Steel (FAG X-life Germany)',
    sealType: 'Open (Cone & Cup Separable Design)',
    cageType: cage,
    loadRating: 'Dynamic: 120 kN, Static: 160 kN',
    speedRating: `${Math.round(380000 / od)} RPM`,
    countryOfOrigin: 'Germany',
    application: 'Automotive wheel hubs, commercial vehicle differentials, industrial gearboxes, railway axle transmissions',
    description: `Genuine FAG single-row tapered roller bearing ${partNumber}. High combined radial and axial load capacity. Precision: ${precision}.`,
    equivalentProducts: [
      { brand: 'TIMKEN', partNumber: partNumber.replace(/-XL|-P5|-P6X|-DY/g, ''), price: Math.round(price * 1.08) },
      { brand: 'SKF', partNumber: partNumber.replace(/-XL|-A|-B/g, '') + ' /Q', price: Math.round(price * 1.05) }
    ]
  };
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');

  const uniqueParts = [...new Set(RAW_TAPERED.map(l => l.trim()))];
  console.log('Total Unique Lines in Raw List:', uniqueParts.length);

  const bulkOps = uniqueParts.map((line, idx) => {
    const prod = parseItem(line, idx);
    return {
      updateOne: {
        filter: { partNumber: prod.partNumber, brand: 'FAG' },
        update: { $set: prod },
        upsert: true
      }
    };
  });

  const res = await Product.bulkWrite(bulkOps);
  console.log('BulkWrite Complete. Upserted:', res.upsertedCount, 'Modified:', res.modifiedCount, 'Matched:', res.matchedCount);

  const total = await Product.countDocuments({ category: 'Tapered Roller Bearing Single Row' });
  console.log('Total in DB for Tapered Roller Bearing Single Row:', total);
  await mongoose.disconnect();
}
run();
