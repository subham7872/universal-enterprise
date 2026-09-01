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

const RAW_MULTI_TAPERED = [
  "802039 FAG", "F-802024.TR4-D1-H122AA FAG", "802173M.H122AB FAG", "802003.H122AF FAG",
  "506725A FAG", "BT4-0049E81/C510 SKF", "BT4B331226/HA1 SKF", "BT4-0039E8/C355 SKF",
  "STF501KV7151EGAS NSK", "STF520KV7151AGBS3 NSK", "STF571KV8151FGAS3 NSK", "STF501KV7151EGAS3 NSK",
  "STF266KV3552CGBS3C04 NSK", "67885DWF/20F/20DFG Koyo (JTEKT)", "317KVS4251EGP5A NSK",
  "STF220KVE2903EGAS02 NSK", "STF310KVS4301EGAS-02 NSK", "47T563927BWHGC2 Koyo (JTEKT)",
  "STF501KV6751GBS3 NSK", "STF685KVE8754BEGS3 NSK", "E-40317 ISB", "M278749D/M278710D/710 Neutral",
  "F-802006.TR4-H122BA FAG", "523080 FAG", "802003A.H122AG FAG", "568040 FAG",
  "F-802049.TR4 FAG", "568780B FAG", "F-802386.TR4-H122AA-W72D FAG", "561988 FAG",
  "F-802121.TR4.M.H122AA FAG", "804044 FAG", "F-802020.TR4-D1-H122AA FAG", "567158 FAG",
  "F-802010.TR4 FAG", "537905 FAG", "F-802139.TR4-D2M-H122GE FAG", "802056 FAG",
  "Z-577346.TR4 FAG", "802018 FAG", "F-802223.TR4-D1-H122AA-A600-700 FAG", "802007.H122AG FAG",
  "L163149D/L163110 Timken", "NP549475-9AK1 Timken", "BT4-8160E81/C475 SKF", "331149A SKF",
  "LM451349DW-904D4 Timken", "NP647639-9AKA1 Timken", "330758BG SKF", "332313 SKF",
  "330764 SKF", "BT4-8094G/HA1VA917 SKF", "NP729121-902A1 Timken", "BT4B328817E1/C475 SKF",
  "M278749D/M278710D/710 Timken", "BT4-0004G/HA1 SKF", "330368B SKF", "STF482KV6152E1G3 NSK",
  "220TQO8745AA957H4 Torrington", "406KV5951G3S3 NSK", "STF520KV7151GAS3 NSK",
  "STF374KV5051GAS3 NSK", "355KV4552GS3 NSK", "STF310KVS4301GS3CG NSK", "280KV3801EGS3 NSK",
  "STF190KV2651 NSK", "47T513615GWHC2 Koyo (JTEKT)", "WTF206KV2854BE1G-U01P2 NSK",
  "STF266KV3552CGBS NSK", "STF317KVS4251EG P5A NSK", "STF501KV6751GAS3 NSK",
  "STF571KV8151GAS3 NSK", "STF346KV4854AGBS3C01 NSK", "4TR19AWSGHGCS100 Koyo (JTEKT)",
  "10777/670 GPZ", "77760 GPZ", "77788 GPZ", "77172 GPZ", "802016 FAG",
  "802071.H122AG FAG", "802093 FAG", "802053 FAG", "802014 FAG", "527934 FAG",
  "525465 FAG", "802136 FAG", "F-802905.TR4-A-W72D FAG", "802009.H122AA FAG",
  "803335 FAG", "535884 FAG", "802090 FAG", "802006.H122AB FAG", "802067 FAG",
  "514752 FAG", "504512 FAG", "802010 FAG", "538585 FAG", "F-802291.TR4-D1 FAG",
  "567392 FAG", "530297 FAG", "802057M.H122AA FAG", "802093M FAG", "802037 FAG",
  "802063.H122AD FAG", "802067.H122AA FAG", "514225 FAG", "512345A FAG",
  "F-802010.TR4-D1-H122AA FAG", "802009 FAG", "506725A.H76 FAG", "F-802193.TR4.H122BK FAG",
  "523543 FAG", "525937 FAG", "802038M FAG", "517944 FAG", "531883 FAG",
  "802049M FAG", "802130 FAG", "F-802024.TR4-H122AA FAG", "F-802090.TR4-H122AA FAG",
  "F-802007.TR4-D1-H122AF FAG", "802139M FAG", "513140 FAG", "802115 FAG",
  "802016.H122AA FAG", "573415 FAG", "529001 FAG", "802102M FAG", "802038 FAG",
  "802085M FAG", "802155 FAG", "548757 FAG", "802028 FAG", "Z-523207.TR4 FAG",
  "F-802037.TR4-D-H122BB FAG", "802100 FAG", "523935 FAG", "521799A FAG",
  "527030 FAG", "802147M FAG", "513141 FAG", "515180 FAG", "506201 FAG",
  "802119 FAG", "511861 FAG", "802198.H122 FAG", "802010.H122AA FAG",
  "802018H122AA FAG", "508776A FAG", "509693A FAG", "331275 FAG", "506200 FAG",
  "F-802021.TR4-H122BR FAG", "F-802170.TR4.M FAG", "521179 FAG", "802012 FAG",
  "511569 FAG", "509737A FAG", "802002.A270.300.H122AA FAG", "572452 FAG",
  "802045 FAG", "802125 FAG", "Z-561988.TR4-M15BZ-M31AX FAG", "517623 FAG",
  "F-802010.TR4-D1 FAG", "802277.M15BZ FAG", "802051.H122AA FAG", "534480 FAG",
  "802039M FAG", "802003.H122AG.M15BZ.W FAG", "802198.H122AA FAG", "802462H122ED FAG",
  "530986 FAG", "802075 FAG", "802148.H122BD FAG", "802030M FAG", "522121 FAG",
  "802052 FAG", "525789 FAG", "802051 FAG", "509411 FAG", "564027 FAG",
  "513166A FAG", "511115 FAG", "802114 FAG", "802055 FAG", "511347 FAG",
  "503326A FAG", "802002.A270.300 FAG", "802062M FAG", "Z-547043.TR4 FAG",
  "F-802006.TR4-D1-H122AA FAG", "802032M FAG", "510375 FAG", "524152 FAG",
  "524469 FAG", "802102 FAG", "802048M FAG", "802086 FAG", "518078 FAG",
  "802024 FAG", "802056.H122AA FAG", "802037.H122BB FAG", "802251 FAG",
  "523207 FAG", "511775 FAG", "802099 FAG", "517254 FAG", "802117 FAG",
  "509680 FAG", "F-802121.TR4.H122BR FAG", "802159 FAG", "802049 FAG",
  "802024.H122AA FAG", "512630 FAG", "F-802189.TR4-AM FAG", "802104 FAG",
  "802062 FAG", "504415A FAG", "511781 FAG", "561585 FAG", "802103M FAG",
  "513833 FAG", "802123 FAG", "514353 FAG", "F-803335.TR4 FAG", "331700 SKF",
  "331093A SKF", "331081A SKF", "BT4B331125CG/HA1 SKF", "STF482KV615-2A SKF",
  "331465BG SKF", "BT4B331358/HA4 SKF", "331202 SKF", "330870A SKF",
  "330862B SKF", "330782A SKF", "330662E/C480 SKF", "330661E/C475 SKF",
  "LM278849DWH-902A7 Timken", "SV-BT4B328842 SKF", "330726A SKF", "331089 SKF",
  "BT4B331174/HA1 SKF", "NP183964-90KA1 Timken", "331999 SKF", "331157BG SKF",
  "BT4-8162E8/C480 SKF", "331333 SKF", "331381 SKF", "331287 SKF",
  "331968 SKF", "331138AG SKF", "521592 SKF", "332098A SKF",
  "568422 SKF", "331925 SKF", "331148A SKF", "BT4B331346A/HA1 SKF",
  "331499 SKF", "331259 SKF", "331169 SKF", "331133A SKF",
  "330337A SKF", "331399 SKF", "331156 SKF", "331249 SKF",
  "331382 SKF", "331480 SKF", "LM278849DWH-902B9 Timken", "331440 SKF",
  "331175A SKF", "518067 SKF", "331165A SKF", "331078A SKF",
  "BT4B332773/HA3 SKF", "332060 SKF", "330661C SKF", "330758A SKF",
  "330540A SKF", "331288 SKF", "LM170446DGA-902A1 Timken", "NP815821-9AKA1 Timken",
  "LM278849DWH-9A2B4 Timken", "M252330T-29609 Timken", "331616 SKF", "802098 SKF",
  "LM654648DW/610/610CD Timken", "802047 SKF", "331228 SKF", "331486 SKF",
  "T777/650 Timken", "LM278849DW-810-810D Timken", "SG-BT4B328842 SKF", "BT4B330742A/HA4 SKF",
  "514433A SKF", "332391 SKF", "330993B SKF", "331090A SKF",
  "BT4B331161BG/HA4 SKF", "330650C SKF", "331168A SKF", "331398 SKF",
  "331787 SKF", "NP827555-9AKA1 Timken", "BT4B331333E/C575 SKF", "BT4B330650E/C500 SKF",
  "BT4B332666/HA1 SKF", "331248 SKF", "330676B SKF", "526837 SKF",
  "331503 SKF", "331190 SKF", "332307 SKF", "BT4B332671/HA1 SKF",
  "BT4B331626A/HA1 SKF", "332096 SKF", "331138A SKF", "BT4-0014G/HA1C400VA903 SKF",
  "NP639186-9AKA1 Timken", "NP414928-9AK1 Timken", "331125A SKF", "331161A SKF",
  "331275 SKF", "331329 SKF", "BT4B332773E/C725 SKF", "331160A SKF",
  "LM682342DGW-904A1 Timken", "67986DW/920/921D Timken", "M271149D-90080 Timken", "NP414928-90KA1 Timken",
  "BT4B330944/HA4 SKF", "330803A SKF", "802040 SKF", "330641C SKF",
  "BT4B328209/HA1 SKF", "330529B SKF", "BT4B328842E1/C725 SKF", "331492 SKF",
  "HM266449DW-90152 Timken", "BT4B332906/HA4 SKF", "BT4B328870EX1/C300 SKF", "331090E/C700 SKF",
  "330870BG SKF", "NP536398-904A1 Timken", "T777/620 Timken", "LM278849DWH-810-810D Timken",
  "BT4B328842 SKF", "331066A SKF", "331065A SKF", "331625 SKF",
  "330899A SKF", "NP476024 Timken", "10777/500 Timken", "331169E/C500 SKF",
  "330641E/C725 SKF", "331123 SKF", "331094A SKF", "332244 SKF",
  "331300 SKF", "331477 SKF", "330886B SKF", "331248CD SKF",
  "513357 SKF", "331159A SKF", "802022 SKF", "330822B SKF",
  "3811/670 SKF", "331175BG/C355 SKF", "67885DW/67820/67820D Timken", "LM278849DWH-902B4 Timken",
  "T778/660 Timken", "330903A SKF", "331907 SKF", "330882C SKF",
  "331622 SKF", "330824A SKF", "331157A SKF", "BT4B330993B SKF",
  "110TQO494 AA1526 G4 Timken", "NP834407-9AKA1 Timken", "NP090602-9AKA2 Timken", "331347 SKF",
  "331092A SKF", "331077A SKF", "331687 SKF", "BT4B330880/HA1 SKF",
  "BT4-8069G/HA1VA901 SKF", "BT4B330650EX/C500 SKF", "BT4B328209G/HA1C455 SKF", "BT4B331649/HA4 SKF",
  "330990A SKF", "332131 SKF", "331480G SKF", "BT4B332664/HA1BC SKF",
  "530985 SKF", "330662A SKF", "331664 SKF", "331452 SKF",
  "330835C SKF", "BT4B331161BG/HA1 SKF", "140TQO594LB1634H4 Timken", "LM278849DWH-902C1 Timken",
  "330661 SKF", "STF317KV4451E1GBS3CG100 NSK", "E-LM767749D/10/10D NTN", "47T563927A Koyo (JTEKT)",
  "151TQO641 Torrington", "420KV6202GS3CG70 NSK", "140KV895 NSK", "T360/630 TPS Timken Polska",
  "225TQO756AA229H2 Torrington", "482KV6152EGS3 NSK", "STF220KVE2903EGAS-02 NSK", "266KV3552CGS3 NSK",
  "317KV4451E1GBS3 NSK", "120TQO9532AB1293H1 Torrington", "220KV895 NSK", "310KVS4301GS3CG NSK",
  "197TQO713AA229-H2 Torrington", "STF244KV3251AGAS3C01 NSK", "WTF269KV3852GU2S3CG NSK", "STF431KV5701GS3SA NSK",
  "STF165KV2252GAS3CG50 NSK", "CRO-13404 NTN", "47TS563927AGWSGHZ Koyo (JTEKT)", "482KV6152 NSK",
  "47T513615 Koyo (JTEKT)", "B22451 Link-Belt", "EE275109DWH/55H/56DHG-CS8 Koyo (JTEKT)", "685KVE8754BEGS3 NSK",
  "M281049D/010/010XD Koyo (JTEKT)", "130KV81CG75 NSK", "STF220KVE3401E1GAS01P NSK", "STF150KV2102EGACA-01 NSK",
  "220TQ0CT745AA957H4 Torrington", "T36360 TPS Timken Polska", "47TS573824AGWS Koyo (JTEKT)", "450KV5901GAS3 NSK",
  "406KV5455GS3CG64 NSK", "244KV3251GS3 NSK", "206KV2854GS3CG90 NSK", "266KV3552 NSK",
  "270TQO9812AA1254H1 Torrington", "LM278849DWH-810-810D Koyo (JTEKT)", "10777/500 GP", "382044 ISB",
  "M271149D-90080 ACB", "77880 MPZ", "T778/660 FLT"
];

function parseMultiTaperedItem(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  
  let brand = "FAG";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else if (cleanLine.includes("TPS Timken Polska")) {
    brand = "Timken";
    cleanLine = cleanLine.replace("TPS Timken Polska", "").trim();
  } else if (cleanLine.includes("ACB - Atlantic Custom Bearings") || cleanLine.includes("ACB")) {
    brand = "ACB";
    cleanLine = cleanLine.replace(/ACB - Atlantic Custom Bearings|ACB/g, "").trim();
  } else if (cleanLine.includes("MPZ Minsk Bearing Plant") || cleanLine.includes("MPZ")) {
    brand = "MPZ";
    cleanLine = cleanLine.replace(/MPZ Minsk Bearing Plant|MPZ/g, "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = [
      "FAG", "SKF", "Timken", "NSK", "Torrington", "GPZ", "ISB", "NTN", "Link-Belt",
      "FLT", "GP", "Neutral"
    ];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 280, od = 420, width = 220;
  let typeDesc = "Four-Row Tapered Roller Bearing (TQO / TR4 / BT4B)";
  let seriesGroup = "Four-Row Tapered Roller Roll Neck Series";

  let nskKv = partNumber.match(/(\d{3})KV/);
  let tqoMatch = partNumber.match(/(\d{3})TQO/);
  let bt4Match = partNumber.match(/BT4[B]?-?(\d{4,6})/);

  if (nskKv) {
    bore = parseInt(nskKv[1], 10);
    od = Math.round(bore * 1.48);
    width = Math.round(bore * 0.78);
  } else if (tqoMatch) {
    bore = parseInt(tqoMatch[1], 10);
    od = Math.round(bore * 1.5);
    width = Math.round(bore * 0.82);
  } else if (partNumber.startsWith("802") || partNumber.startsWith("F-802")) {
    bore = 300; od = 450; width = 250;
    typeDesc = "Four-Row Heavy Mill Tapered Roller Bearing (FAG TR4 Series)";
    seriesGroup = "FAG TR4 Rolling Mill Series";
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(1);
  if (parseFloat(estWeight) < 15.0) estWeight = "35.0";

  let dyn = Math.round(bore * width * 0.55);
  let stat = Math.round(dyn * 2.2);

  let price = Math.round(parseFloat(estWeight) * 2200 + 12000);

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tm-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Four-Row Tapered Roller Bearing ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Bearing Multi Row",
    seriesGroup: seriesGroup,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 10) + 2,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade Case-Hardened / Super-TF Alloy Steel for Extreme Shock & Roll Neck Loads",
    sealType: "Open / Sealed Multi-Lip Heavy Duty Roll Neck Design (W72D/H122)",
    cageType: "Heavy-Gauge Steel Pin-Type Cages with Pierced Rollers",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(220000 / od)} RPM`,
    countryOfOrigin: brand === "NSK" || brand === "Koyo" ? "Japan" : brand === "Timken" || brand === "Torrington" ? "USA" : "Germany",
    application: "Work rolls and backup rolls of hot and cold rolling mills, heavy section rolling stands, tube piercing mills, calenders, high-tonnage mining pulverizers",
    description: `Genuine ${brand} heavy-duty four-row tapered roller roll neck bearing ${partNumber}. Designed to absorb crushing radial rolling forces and bidirectional axial thrust simultaneously with maximum stiffness and extended fatigue life.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/FAG|SKF|NSK/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber.replace(/FAG|Timken/g, ''), price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_MULTI_TAPERED.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseMultiTaperedItem(line, idx)).filter(Boolean);
  console.log(`[Multi Tapered Script] Parsed ${products.length} unique Tapered Roller Bearing Multi Row.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Multi Tapered Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Bearing Multi Row to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Bearing Multi Row"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Double Row",\s*"id": "tapered-double"\s*},/,
      `"name": "Tapered Roller Double Row",\n        "id": "tapered-double"\n      },\n      {\n        "name": "Tapered Roller Bearing Multi Row",\n        "id": "tapered-multi"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Multi Tapered Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Multi Tapered Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Multi Tapered Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Multi Tapered Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Multi Tapered Script] Connected to MongoDB Atlas.');

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
    console.log(`[Multi Tapered Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalMultiTapered = await Product.countDocuments({ category: "Tapered Roller Bearing Multi Row" });
    console.log(`[Multi Tapered Script] Current Database Totals: ${totalMultiTapered} Tapered Roller Bearing Multi Row Bearings.`);
  } catch (err) {
    console.error('[Multi Tapered Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Multi Tapered Script] Done.');
  }
}

main();
