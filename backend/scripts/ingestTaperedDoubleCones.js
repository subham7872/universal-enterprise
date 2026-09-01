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

const RAW_DOUBLE_CONES = [
  "1. 19145D Timken", "2. 9220D Timken", "3. 52393DE Timken", "4. 34293DE-40287 Timken",
  "5. NP126049-90WA2 Timken", "6. 34300DA-40287 Timken", "7. XC06536CD Timken", "8. 07101DW Timken",
  "9. 946D Timken", "10. 395TD Timken", "11. 21226D Timken", "12. M231649D Timken",
  "13. 797DE Timken", "14. 487TD-20000 Timken", "15. 52387D Timken", "16. 17116D Timken",
  "17. 07100D Timken", "18. 82587D Timken", "19. 52400D Timken", "20. 42318DA Timken",
  "21. 22150DE Timken", "22. 39250DA-40287 Timken", "23. 798DE-40287 Timken", "24. EE234157D Timken",
  "25. 19152D Timken", "26. LM48534SD Timken", "27. 34275DE-40287 Timken", "28. LM761649DW Timken",
  "29. HM237546D Timken", "30. L116149DA Timken", "31. 34300DE-40287 Timken", "32. 42325DEE Timken",
  "33. 99603D Timken", "34. 365DE Timken", "35. 487TD Timken", "36. 368DE Timken",
  "37. 19143DEE Timken", "38. 34293DA Timken", "39. 78255D Timken", "40. 496D Timken",
  "41. 82581TD Timken", "42. 08125DAA Timken", "43. XC06536CD-20957 Timken", "44. 19143DE Timken",
  "45. LM501334SD Timken", "46. 388TD Timken", "47. 94706D Timken", "48. 385SD Timken",
  "49. 34293DA-40287 Timken", "50. 94713TD-20000 Timken", "51. 08118DE-40287 Timken",
  "52. 367DE-20287 Timken", "53. 67980TD Timken", "54. 378DW Timken", "55. 39250DE-40287 Timken",
  "56. 52393DEE Timken", "57. 48680D Timken", "58. 13678SD Timken", "59. 08118DE Timken",
  "60. 377TD Timken", "61. 13169D Timken", "62. 08125DE Timken", "63. 71426D Timken",
  "64. 42362D Timken", "65. 42343DE Timken", "66. 52400DE-40287 Timken", "67. 08118DA Timken",
  "68. 17117TDPREC.3 Timken", "69. 399D Timken", "70. 378DE Timken", "71. 358D Timken",
  "72. LM114848D Timken", "73. 94713TD Timken", "74. 22162DE Timken", "75. 22168DE-40287 Timken",
  "76. 78251D Timken", "77. 78216D Timken", "78. 579TD Timken", "79. 71457TD Timken",
  "80. 39585D Timken", "81. 52400DE Timken", "82. 395DA-40287 Timken", "83. 39243DE-40287 Timken",
  "84. 368DA-40287 Timken", "85. 688TD Timken", "86. XC2376C Timken", "87. 359TD Timken",
  "88. NP097210-90WA4 Timken", "89. STFLM665949DWGS3 NSK", "90. LM742749DW Koyo (JTEKT)",
  "91. 78216D FAG", "92. 52387D-20024 Timken", "93. JRM3535 Timken", "94. NP720022 Timken",
  "95. 368DA Timken", "96. 39250DEE Timken", "97. 67390D Timken", "98. 74539TD Timken",
  "99. 319D Timken", "100. 392DW Timken", "101. 34300DA Timken", "102. 08125DEE Timken",
  "103. 52393DA Timken", "104. 22168DE Timken", "105. NP342204-90W01 Timken", "106. 78255D-20024 Timken",
  "107. 378DE-20024 Timken", "108. 67391D Timken", "109. XC2379C Timken", "110. 581D Timken",
  "111. 00057/00055 Timken", "112. 367DE Timken", "113. 13182D Timken", "114. 34275DE Timken",
  "115. LM961548DW Timken", "116. H234649TD Timken", "117. H228649D Timken", "118. 14134D Timken",
  "119. 96851D Timken", "120. 95526TD Timken", "121. 46790D-20024 Timken", "122. XC2399C Timken",
  "123. 52394TD Timken", "124. 42318DE Timken", "125. LM246349NW Timken", "126. 08125DE-40287 Timken",
  "127. JD6549 Timken", "128. 797TD Timken", "129. 07101DWPREC.3 Timken", "130. 39243DE Timken",
  "131. 34300DE Timken", "132. 67986DW Timken", "133. HM237546D-20024 Timken", "134. 64443DE Timken",
  "135. 375D Timken", "136. 07100DPREC.3 Timken", "137. HM237542D-20024 Timken", "138. 798DE Timken",
  "139. 13176D Timken", "140. 39250DA Timken", "141. 95474D Timken", "142. 42363D Timken",
  "143. 42350DE Timken", "144. 22150DEE Timken", "145. 388TD-20000 Timken", "146. 688TD-20000 Timken",
  "147. 42362D-20024 Timken", "148. LM258648DW Timken", "149. 78216D SKF", "150. HM262749D-20000 Timken",
  "151. 39250DE Timken", "152. 42325DE Timken", "153. HM262749D Timken", "154. LM501334SD-20000 Timken",
  "155. 366DE Timken", "156. 767D Timken", "157. HM265049TD Timken", "158. 34293DE Timken",
  "159. NP342204-90WA2 Timken", "160. EE138131DPREC.3 Timken", "161. 67885D Timken",
  "162. 34268DE Timken", "163. H239649D Timken", "164. 67388D Timken", "165. 498D Timken",
  "166. 496DA Timken", "167. 71450D Timken", "168. 42343DE-40287 Timken", "169. M231649D-20024 Timken",
  "170. 797DE-40287 Timken", "171. 95451D Timken", "172. 579TD-20000 Timken",
  "173. HM262749TDPREC.3 Timken", "174. 74555D Timken", "175. 581D-20024 Timken", "176. 64450DE Timken",
  "177. 39243DA Timken", "178. 388DE Timken", "179. HM265049DW Timken", "180. 367DE-40287 Timken",
  "181. M252349DW Timken", "182. 42343DEE Timken", "183. 399D-20024 Timken", "184. M667947D NTN",
  "185. 78216D SRO", "186. XC06536CD Neutral", "187. R32056XCONE SKF", "188. 48680DGW-20024 Timken",
  "189. 67388D-20024 Timken", "190. EE217063D Timken", "191. EE126096D Timken", "192. H244849D Timken",
  "193. 358D-20024 Timken", "194. 96877TD Timken", "195. 93800D Timken", "196. 81601D Timken",
  "197. 22150DA Timken", "198. 81601D-20024 Timken", "199. EE700090D Timken", "200. 94705TD-20000 Timken",
  "201. 22150DA-40287 Timken", "202. 99600TD-40000 Timken", "203. HM256849D-20000 Timken",
  "204. 52392DE-40634 Timken", "205. H244848TD-20000 Timken", "206. HH221449TD-20000 Timken",
  "207. 93751D Timken", "208. L163149D Timken", "209. M244249DGW-20000 Timken",
  "210. L521949DE-40024 Timken", "211. H234649TD-40000 Timken", "212. 388DE-40287 Timken",
  "213. L882449DGW Timken", "214. 67791DW-20024 Timken", "215. M244249DW Timken", "216. 46780TD Timken",
  "217. LM451349DW Timken", "218. LM654648DW Timken", "219. 99600TD Timken", "220. 67790TD Timken",
  "221. 14123DA Timken", "222. 388DAA Timken", "223. 8576DW Timken", "224. 388DA Timken",
  "225. 368DEE Timken", "226. 9220D-20024 Timken", "227. AAAC529-00000 Timken", "228. 08118DA-40287 Timken",
  "229. 42350DA-40287 Timken", "230. 378DW-40287 Timken", "231. 359TD-20000 Timken",
  "232. H242649D Timken", "233. XC2377C Timken", "234. XC2377C-40287 Timken", "235. NP342615-902A1 Timken",
  "236. 73550D-20024 Timken", "237. 21226D-20081 Timken", "238. M757447D Timken", "239. 93751D-20024 Timken",
  "240. 496D-20024 Timken", "241. 39585D-20024 Timken", "242. HM256846TDPREC.3 Timken",
  "243. 13169D-30000 Timken", "244. L217849DA Timken", "245. 17117TD Timken", "246. 08118DAA Timken",
  "247. 34300DEE Timken", "248. 08125DA Timken", "249. H244848TD Timken", "250. H228649TD Timken"
];

function parseDoubleConeItem(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = "Timken";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else {
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "NTN", "NSK", "SRO", "Neutral"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 90, width = 75;
  let estWeight = (Math.PI * (bore*bore + (bore+38)*(bore+38)) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.9) estWeight = "2.10";

  let dyn = Math.round(bore * width * 0.45);
  let stat = Math.round(dyn * 1.7);

  let price = Math.round(parseFloat(estWeight) * 1950 + 1600);
  if (price < 1450) price = 1450;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-dcone-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Double Row Tapered Roller Bearing Inner Ring with Rollers (Double Cone) ${partNumber}`,
    brand: brand,
    category: "Cone for Tapered Roller Bearings Double Row",
    seriesGroup: "Inch & Metric Double-Row Tapered Roller Bearing Double Cones (TDI Design)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 20) + 6,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: null,
    width: width,
    material: "High-Grade Case-Hardened Alloy Steel (Double Inner Raceway with Precision Rollers & Cages)",
    sealType: "Open (One-Piece Double Cone with Two Opposing Roller Assemblies in TDI Configuration)",
    cageType: "Dual Heavy-Duty Stamped Window Steel Cages / Machined Cages",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(320000 / (bore + 45))} RPM`,
    countryOfOrigin: brand === "Timken" ? "USA" : "Germany",
    application: "Steel rolling mill roll stands, heavy reduction gear drives, mine hoist sheaves, extrusion presses, heavy marine propulsor gearboxes",
    description: `Genuine ${brand} heavy-duty double cone tapered roller bearing assembly ${partNumber}. Solid one-piece double inner ring with two sets of opposing case-carburized tapered rollers (TDI configuration), providing high load capacity and moment rigidity.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-40287|-20024|-20000|-40000|-20287|K/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber.replace(/DE|DA|TD/g, 'D') + " /Q", price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_DOUBLE_CONES.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseDoubleConeItem(line, idx)).filter(Boolean);
  console.log(`[Tapered Double Cone Script] Parsed ${products.length} unique Tapered Roller Bearing Double Cones.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Double Cone Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Cone for Tapered Roller Bearings Double Row to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Cone for Tapered Roller Bearings Double Row"')) {
    dataContent = dataContent.replace(
      /"name": "Cone for Tapered Roller Bearings Single Row",\s*"id": "tapered-single-cone"\s*},/,
      `"name": "Cone for Tapered Roller Bearings Single Row",\n        "id": "tapered-single-cone"\n      },\n      {\n        "name": "Cone for Tapered Roller Bearings Double Row",\n        "id": "tapered-double-cone"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Double Cone Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Double Cone Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Double Cone Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Double Cone Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Double Cone Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Double Cone Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalDoubleCones = await Product.countDocuments({ category: "Cone for Tapered Roller Bearings Double Row" });
    console.log(`[Tapered Double Cone Script] Current Database Totals: ${totalDoubleCones} Cones for Tapered Roller Bearings Double Row.`);
  } catch (err) {
    console.error('[Tapered Double Cone Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Double Cone Script] Done.');
  }
}

main();
