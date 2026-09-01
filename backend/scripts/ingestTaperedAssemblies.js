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

const RAW_ASSEMBLIES = [
  "809029 — FAG", "F-809643.01.TR2SK — FAG", "HM129848-90011(REF) — Brenco",
  "EE127095-90074 — Timken", "861-90020 — Timken", "8576DW-90156 — Timken",
  "M255449-9A2B1 — Timken", "28678-90054 — Timken", "LL575349-90010 — Timken",
  "L327249-90037 — Timken", "JM822049-90NA1 — Timken", "938-90091 — Timken",
  "71437-90034 — Timken", "U399A-90012 — Timken", "LM11949-90026 — Timken",
  "367-902A1 — Timken", "HM261049-902B1 — Timken", "71453-90110 — Timken",
  "438-90092 — Timken", "U298-90010 — Timken", "T177A-90010 — Timken",
  "JHM720249-90K09 — Timken", "462-90103 — Timken", "18690-90052 — Timken",
  "14137A-90126 — Timken", "NA24776SW-90053 — Timken", "29685-90028 — Timken",
  "66225-90021 — Timken", "390A-922A2 — Timken", "396S-90068 — Timken",
  "55206-90028 — Timken", "H239649-90060 — Timken", "08125-90055 — Timken",
  "M241547-90054 — Timken", "67885-90241 — Timken", "67885-90244 — Timken",
  "HH840249-90012 — Timken", "LM67049A-49617 — Timken", "M244249DW-90096 — Timken",
  "M224749-90047 — Timken", "19145D-902A1 — Timken", "3544.572952.300 — Timken",
  "LM282549DWH-904A6 — Timken", "53176-906A2 — Timken", "29675-90146 — Timken",
  "L357049-9A045 — Timken", "LM67048-90040 — Timken", "LM104949-902A5 — Timken",
  "593-984A3 — Timken", "EE923095-90014 — Timken", "580-90318 — Timken",
  "368A-90210 — Timken", "NA484-90107 — Timken", "24780-90040 — Timken",
  "397-90083 — Timken", "575-90189 — Timken", "LM806649-90013 — Timken",
  "L476549-90012 — Timken", "JF9549-9X026 — Timken", "HM237542-902A6 — Timken",
  "99550-90178 — Timken", "94687-90152 — Timken", "67390-90159 — Timken",
  "42381-90071 — Timken", "397-90269 — Timken", "24780-90055 — Timken",
  "497-90193 — Timken", "369AS-90070 — Timken", "67790-90232 — Timken",
  "390A-902A2 — Timken", "LM603049-902A9 — Timken", "H913849-90040 — Timken",
  "H715340-90012 — Timken", "755-90110 — Timken", "29585-90077 — Timken",
  "07100-90045 — Timken", "28985-90114 — Timken", "48286-90060 — Timken",
  "M244249DW-902A9 — Timken", "NA33889SW-90091 — Timken", "M255449-902F1 — Timken",
  "93825-902A5 — Timken", "71450-902A7 — Timken", "28985-90046 — Timken",
  "42375-90116 — Timken", "00055-90018 — Timken", "LM742749-9#2A2 — Timken",
  "M274148DH-902A1 — Timken", "BR103 — SKF", "48680D-902A9 — Timken",
  "850-90052 — Timken", "749-90035 — Timken", "46790-90194 — Timken",
  "HM218210-X0245 — Timken", "34306-90086 — Timken", "52400D/52637/X1S52638 — Timken",
  "368A-90050 — Timken", "17481-90013 — Timken", "M268749-90114 — Timken",
  "399A-90210 — Timken", "48393-90137 — Timken", "46790A-90202 — Timken",
  "EE224115-90029 — Timken", "LM67049A-49600 — Timken", "64450-904A7 — Timken",
  "614115/C3/T210 — SKF", "1637504R — SKF", "HM237535-90135 — Timken",
  "497-90063 — Timken", "42375-90037 — Timken", "395LA-90329 — Timken",
  "388A-90176 — Timken", "HM265049-90068 — Timken", "783-90074 — Timken",
  "08125-90037 — Timken", "NA596SW-90177 — Timken", "74525-90099 — Timken",
  "LM377449DW-9A2A5 — Timken", "JRM3449-90UA1 — Timken", "M144443DGW-902A5 — Timken",
  "98400-90043 — Timken", "74539TD-90092 — Timken", "05075-902A3 — Timken",
  "NP633994-90019 — Timken", "JXC27865C-90WA2 — Timken", "67390-90231 — Timken",
  "NA483SW-90228 — Timken", "NA33895SW-90057 — Timken", "JLM710949C-90N03 — Timken",
  "590A-90175 — Timken", "JP13010-C0492 — Timken", "T130-90010 — Timken",
  "K118890-90010 — Timken", "71425-90137 — Timken", "484-903A1 — Timken",
  "33895-90045 — Timken", "3975-90094 — Timken", "U499-90010 — Timken",
  "H239649D-90032 — Timken", "NP078914-90UA1 — Timken", "8573-90150 — Timken",
  "JRM3938A-90UA2 — Timken", "74550-90222 — Timken", "685-908A1 — Timken",
  "EE113091-90028 — Timken", "HM237545-90147 — Timken", "HM129848-90054 — Timken",
  "99600-90195 — Timken", "99600-90192 — Timken", "93825-90274 — Timken",
  "387S-902B6 — Timken", "12580-90026 — Timken", "JHM534149-90K01 — Timken",
  "JRM3535A-92UA6 — Timken", "687-90062 — Timken", "385A-90208 — Timken",
  "29685-90121 — Timken", "67883-90228 — Timken", "LM742749-903A7 — Timken",
  "LM742749-902A6 — Timken", "HM256849-90069 — Timken", "H242649D-902A1 — Timken",
  "759-90037 — Timken", "71450-90053 — Timken", "567/563/Y9SH563 — Timken",
  "74550-902F2 — Timken", "M244249DW-9G2A9 — Timken", "36686-902A3 — Timken",
  "93750-9#219 — Timken", "LM377448DGW-9A2A8 — Timken", "HM266448-902A8 — Timken",
  "8574-90149 — Timken", "JM720249-90KA2 — Timken", "HM212049-902A2 — Timken",
  "NA435SW-902A1 — Timken", "NA33895SW-90072 — Timken", "82681D-90019 — Timken",
  "81601D-90039 — Timken", "581-90315 — Timken", "570-90113 — Timken",
  "NA95500-90147 — Timken", "93787-90230 — Timken", "681-902A5 — Timken",
  "495-90019 — Timken", "580-90062 — Timken", "NA33889SW-90042 — Timken",
  "67985-90143 — Timken", "497-90090 — Timken", "T350-904A1 — Timken",
  "T176-904A1 — Timken", "LM869448-90065 — Timken", "L882449DGW-904B1 — Timken",
  "JW6049-90N99 — Timken", "98400-90031 — Timken", "67391-90071 — Timken",
  "LM48548-90013 — Timken", "HM136948-90327 — Timken", "74550-90226 — Timken",
  "598-90087 — Timken", "29675-90043 — Timken", "74500-90205 — Timken",
  "LM67048-90015 — Timken", "EE107060-90065 — Timken", "385AX-90307 — Timken",
  "T770DW-902A1 — Timken", "LM769348DWA-9A2A5 — Timken", "LM869448-90067 — Timken",
  "HM127446-90083 — Timken", "3780-90179 — Timken", "48393-90139 — Timken",
  "H337844-90286 — Timken", "EE755285-904B7 — Timken", "JXC2195CM-9CNA1 — Timken",
  "938-903A8 — Timken", "2558-49613 — Timken", "JM205149-90B01 — Timken",
  "EE130902-90098 — Timken", "663-90095 — Timken", "K150200-902A4 — Timken",
  "67885D-49639 — Timken", "JM969241DW-90KA1 — Timken", "9380-90016 — Timken",
  "399A-90196 — Timken", "482-90118 — Timken", "478-90043 — Timken",
  "NP078914 — Timken", "67388-90020 — Timken", "SET49 — Timken",
  "95491-90141 — Timken", "JHM534149-90N01 — Timken", "94706D-90096 — Timken",
  "94649-90011 — Timken", "484-90104 — Timken", "42350-90017 — Timken",
  "33262-90100 — Timken", "JM720249-90N06 — Timken", "94700-90158 — Timken",
  "98350-90070 — Timken", "67390-90049 — Timken", "M249748D-902B5 — Timken",
  "56425-90030 — Timken", "74550-90220 — Timken", "66225-90024 — Timken",
  "NA15117SW-90094 — Timken", "NA05076SW-90033 — Timken", "368A-90189 — Timken",
  "JH217249-90K02 — Timken", "477-90268 — Timken", "M244249-90114 — Timken",
  "JM738249-90KA4 — Timken"
];

function parseAssemblyProduct(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let brand = "Timken";
  let partNumber = cleanLine;

  if (cleanLine.includes("—")) {
    let parts = cleanLine.split("—");
    partNumber = parts[0].trim();
    brand = parts[1].trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "Brenco", "NTN", "NSK", "Koyo"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      partNumber = parts.join(' ').trim();
    }
  }

  partNumber = partNumber.replace(/,/g, '.');

  let bore = 80, od = 140, width = 45;
  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.8) estWeight = "2.40";

  let dyn = Math.round(bore * width * 0.38);
  let stat = Math.round(dyn * 1.55);

  let price = Math.round(parseFloat(estWeight) * 2200 + 1500);
  if (price < 1250) price = 1250;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-asmb-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Tapered Roller Bearing Complete Factory Assembly ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Bearing Assembly",
    seriesGroup: "Factory-Certified Pre-Adjusted Tapered Roller Bearing Assemblies",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 20) + 6,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade Case-Hardened / Through-Hardened Alloy Steel (Matched Cup & Cone Assembly)",
    sealType: "Pre-Adjusted Factory Matched Assembly (Ready to Install)",
    cageType: "Precision Stamped Window-Type Steel Cage",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(330000 / od)} RPM`,
    countryOfOrigin: brand === "Timken" || brand === "Brenco" ? "USA" : "Germany",
    application: "Commercial truck drive axles, locomotive wheelsets, heavy industrial gear reducers, planetary final drives, steel rolling mill auxiliary equipment",
    description: `Genuine ${brand} complete tapered roller bearing assembly ${partNumber}. Factory matched and calibrated cone, cup, and precision spacer kit ready for immediate installation with certified bench end play and maximum fatigue life.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-90020|-90074|-90010/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber, price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_ASSEMBLIES.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseAssemblyProduct(line, idx)).filter(Boolean);
  console.log(`[Tapered Assembly Script] Parsed ${products.length} unique Tapered Roller Bearing Assemblies.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Assembly Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Bearing Assembly to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Bearing Assembly"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Bearing Spacer",\s*"id": "tapered-spacer"\s*},/,
      `"name": "Tapered Roller Bearing Spacer",\n        "id": "tapered-spacer"\n      },\n      {\n        "name": "Tapered Roller Bearing Assembly",\n        "id": "tapered-assembly"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Assembly Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Assembly Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Assembly Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Assembly Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Assembly Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Assembly Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalAssemblies = await Product.countDocuments({ category: "Tapered Roller Bearing Assembly" });
    console.log(`[Tapered Assembly Script] Current Database Totals: ${totalAssemblies} Tapered Roller Bearing Assemblies.`);
  } catch (err) {
    console.error('[Tapered Assembly Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Assembly Script] Done.');
  }
}

main();
