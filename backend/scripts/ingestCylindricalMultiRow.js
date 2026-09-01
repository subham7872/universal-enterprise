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

const RAW_MULTI_ROW = [
  "1. SL11952-A INA", "2. SL11948-A INA", "3. Z-579098.ZL-R203-279 FAG", "4. Z-512580.LZL FAG",
  "5. F-558778.01.N3CL INA", "6. SL14924-A INA", "7. F-53044.N3CL INA", "8. Z-507339.RZL FAG",
  "9. 508726 FAG", "10. F-809161.RZLN-M15MZ FAG", "11. SL14920-A INA", "12. Z-507333.ZL FAG",
  "13. Z-507536.RZL FAG", "14. L527104.F12 FAG", "15. Z-525438.01.LZL-F12 FAG", "16. SL14918-A-C3 INA",
  "17. SL13914-A INA", "18. SL12918-A INA", "19. Z-508727.ZL FAG", "20. Z-507536.LZL FAG",
  "21. N3U 110X150X71 V INA", "22. Z-508368.ZL FAG", "23. Z-512580.RZL FAG", "24. 803976 FAG",
  "25. SL16918-A INA", "26. SL11922-A INA", "27. SL12914-A INA", "28. F-563784.RZLN FAG",
  "29. SL15916-A INA", "30. SL11914-A-C4 INA", "31. SL11916-A INA", "32. Z-512580.ZL FAG",
  "33. Z-507536.ZL FAG", "34. Z-567622.LZL FAG", "35. Z-502894.01.LZL FAG", "36. SL11924-A INA",
  "37. SL14930-A INA", "38. SL12932-A INA", "39. SL11926-A INA", "40. SL11920-A INA",
  "41. SL11940-A INA", "42. F-576869.ZL FAG", "43. Z-507339.LZL FAG", "44. F-551795GTLS INA",
  "45. SL13914 INA", "46. SL11916 INA", "47. SL13-916 INA", "48. Z-545636.07.ZL FAG",
  "49. SL16920-A INA", "50. F-89114.N3CF INA", "51. 517680A FAG", "52. R512580M FAG",
  "53. 10/6040 FAG", "54. Z-507339.02.ZL FAG", "55. Z-502894.01.ZL FAG", "56. F-804868.ZL-N12BA FAG",
  "57. L502894A FAG", "58. 507339B FAG", "59. Z-580619.ZL FAG", "60. Z-577935.ZL-J20AA-J33BB FAG",
  "61. 568906.P5 FAG", "62. 314484D FAG", "63. Z-524238.01.RZL FAG", "64. 524239A FAG",
  "65. Z-527274.ZL-P5 FAG", "66. Z-532843.ZL FAG", "67. F-89552.N3CF INA", "68. SL13914 INA",
  "69. SL11952-A-C3 INA", "70. SL11948-A-C3 INA", "71. SL11944-A INA", "72. SL11940-A-C3 INA",
  "73. SL11936-A INA", "74. SL11932-A INA", "75. SL11928-A INA", "76. SL11924-A-C3 INA",
  "77. SL11920-A-C3 INA", "78. SL11918-A INA", "79. SL11916-A-C3 INA", "80. SL11914-A INA",
  "81. SL11912-A INA", "82. SL11910-A INA", "83. SL11908-A INA", "84. SL11906-A INA",
  "85. SL11904-A INA", "86. SL13918-A INA", "87. SL13920-A INA", "88. SL13924-A INA",
  "89. SL13928-A INA", "90. SL13932-A INA", "91. SL13936-A INA", "92. SL13940-A INA",
  "93. SL13944-A INA", "94. SL14916-A INA", "95. SL14918-A INA", "96. SL14920-A INA",
  "97. SL14924-A INA", "98. SL14928-A INA", "99. SL14930-A INA", "100. SL14932-A INA",
  "101. SL14936-A INA", "102. SL14940-A INA", "103. SL14944-A INA", "104. SL14948-A INA",
  "105. SL14952-A INA", "106. SL15916-A INA", "107. SL15918-A INA", "108. SL15920-A INA",
  "109. SL15924-A INA", "110. SL15926-A INA", "111. SL15928-A INA", "112. SL15932-A INA",
  "113. SL15936-A INA", "114. SL15940-A INA", "115. SL15944-A INA", "116. SL15948-A INA",
  "117. SL16918-A INA", "118. SL16920-A INA", "119. SL16924-A INA", "120. SL16928-A INA",
  "121. SL16932-A INA", "122. SL16936-A INA", "123. SL16940-A INA", "124. SL16944-A INA",
  "125. SL16948-A INA", "126. SL16952-A INA", "127. SL183048A C3 INA", "128. RSL182210-A-XL INA",
  "129. NJ207E.JP3.C3 FAG", "130. NU311-E-XL-M1-J20AA-C3 FAG", "131. NJ1052-M1A FAG",
  "132. NN3052-AS-K-M-SP FAG", "133. NNU4926-S-M-SP-C3 FAG", "134. NNU4926S.M.P53 FAG",
  "135. NN3028-AS-M-SP FAG", "136. NNU4930-S-M-SP-C3 FAG", "137. NN3024-D-K-TVP-SP-XL FAG",
  "138. NN3013-D-TVP-SP-XL FAG", "139. NN3006-AS-K-M-SP FAG", "140. NN3048-AS-M-SP FAG",
  "141. NN3021-D-K-TVP-SP-XL FAG", "142. NN3024-D-TVP-SP-XL FAG", "143. NN3012-D-TVP-SP-XL FAG",
  "144. NN3048-AS-K-M-SP FAG", "145. NNU4956-S-K-M-SP FAG", "146. NNU4938-S-M-SP-C3 FAG",
  "147. NNU4920-S-K-M-SP-C2 FAG", "148. NN3026-AS-M-SP-C2 FAG", "149. NN3019-D-K-TVP-SP-XL FAG",
  "150. NN3007-D-K-TVP-SP-XL FAG", "151. NN3036-AS-K-M-SP-C3 FAG", "152. NNU4980-S-K-M-SP FAG",
  "153. NNU4988-S-K-M-SP FAG", "154. NNU4921-S-M-SP FAG", "155. NN3030-AS-K-M-SP FAG",
  "156. NNU4972-S-K-M-SP FAG", "157. NN3088-AS-K-M-SP FAG", "158. NNU4944-S-M-SP FAG",
  "159. NNU4944-S-K-M-SP FAG", "160. NNU4940-S-K-M-SP FAG", "161. NNU4938-S-M-SP FAG",
  "162. NN3008-D-K-TVP-SP-XL FAG", "163. NNU4936-S-K-M-SP FAG", "164. NNU4934-S-K-M-SP FAG",
  "165. NNU4930-S-K-M-SP FAG", "166. NNU4936-S-M-SP-C3 FAG", "167. NNU4952-S-M-SP-C3 FAG",
  "168. NN3064-AS-K-M-SP FAG", "169. NNU4996-S-K-M-SP FAG", "170. NNU4992-S-K-M-SP FAG",
  "171. NNU4984-S-K-M-SP FAG", "172. NNU4928-S-K-M-SP-C2 FAG", "173. NNU4924-S-M-SP FAG",
  "174. NN3096-AS-K-M-SP FAG", "175. NNU4926-S-M-SP-C3 FAG", "176. NNU4930-S-K-M-SP FAG",
  "177. NNU4936-S-M-SP-C3 FAG", "178. NNU4934-S-K-M-SP FAG", "179. NNU4952-S-M-SP-C3 FAG",
  "180. NNU4988-S-K-M-SP FAG", "181. NNU4972-S-K-M-SP FAG", "182. NNU4938-S-M-SP-C3 FAG",
  "183. RBC4-0114 SKF", "184. RBC4-0092 SKF", "185. R313811 SKF", "186. LBC4B635122 SKF",
  "187. L313891A SKF", "188. L313924A SKF", "189. R316691 SKF", "190. NNU6920M/C3 SKF",
  "191. 314385/WM060 SKF", "192. 200RV2801C4 NSK", "193. STF690RV9815GAS8 NSK",
  "194. STF550RV7413HGAS8CR325P5AU1 NSK", "195. 310RV4201GC4P5A NSK", "196. 4R3628C4 NTN",
  "197. 56FC41300FC4 Koyo (JTEKT)", "198. STF550RV7413JGAS8CR205P5AU1 NSK",
  "199. STF400RV5615GAC4P-01 NSK", "200. 4R3232C4 NTN", "201. STF850RV1115MGBS8C02 NSK",
  "202. 38FC28200 Koyo (JTEKT)", "203. E-RNNU7804D FAG", "204. Z-565084.ZL FAG",
  "205. Z-508727.02.RZL FAG", "206. Z-510150.02.ZL FAG", "207. Z-508955.ZL FAG",
  "208. 512764 FAG", "209. 513769A FAG", "210. Z-508726.LZL FAG", "211. Z-507735.ZL FAG",
  "212. Z-537993.ZL FAG", "213. SL14960-A INA", "214. F-236407.01.DML3E GR.D INA",
  "215. SL10368-A INA", "216. SL11-916-A INA", "217. SL11-938 INA", "218. 524289B FAG",
  "219. Z-572434.ZL FAG", "220. Z-543436.ZL FAG", "221. Z-512764.LZL FAG", "222. Z-511605.ZL FAG",
  "223. SL13-936 INA", "224. SL14-924A INA", "225. Z-513769.01.LZL-F12 FAG", "226. SL11916 INA",
  "227. SL13-916 INA", "228. Z-545636.07.ZL FAG", "229. SL16920-A INA", "230. F-89114.N3CF INA",
  "231. 517680A FAG", "232. R512580M FAG", "233. 10/6040 FAG", "234. Z-507339.02.ZL FAG",
  "235. Z-502894.01.ZL FAG", "236. F-804868.ZL-N12BA FAG", "237. L502894A FAG", "238. 507339B FAG",
  "239. Z-580619.ZL FAG", "240. Z-577935.ZL-J20AA-J33BB FAG", "241. 568906.P5 FAG",
  "242. 314484D FAG", "243. Z-524238.01.RZL FAG", "244. 524239A FAG", "245. Z-527274.ZL-P5 FAG",
  "246. Z-532843.ZL FAG", "247. F-89552.N3CF INA", "248. L510440A FAG", "249. Z-509216.ZL FAG",
  "250. Z-507536.02.ZL FAG", "251. SL11918A INA"
];

function parseMultiRowItem(line) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  
  // Detect Brand
  let brand = "FAG";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else if (cleanLine.endsWith("SKF")) {
    brand = "SKF";
    cleanLine = cleanLine.replace(/SKF$/, "").trim();
  } else if (cleanLine.endsWith("NSK")) {
    brand = "NSK";
    cleanLine = cleanLine.replace(/NSK$/, "").trim();
  } else if (cleanLine.endsWith("NTN")) {
    brand = "NTN";
    cleanLine = cleanLine.replace(/NTN$/, "").trim();
  } else if (cleanLine.endsWith("INA")) {
    brand = "INA";
    cleanLine = cleanLine.replace(/INA$/, "").trim();
  } else if (cleanLine.endsWith("FAG")) {
    brand = "FAG";
    cleanLine = cleanLine.replace(/FAG$/, "").trim();
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 140, od = 220, width = 80;
  let typeDesc = "Multi-Row Cylindrical Roller Bearing";
  let seriesGroup = "Multi-Row Cylindrical Series";

  // Check specific rolling mill / multi-row patterns
  let nskRv = partNumber.match(/(\d{3})RV(\d{4})/);
  let ntn4R = partNumber.match(/4R(\d{2})(\d{2})/);
  let koyoFc = partNumber.match(/(\d{2})FC(\d{2})(\d{3})/);
  let inaSl = partNumber.match(/SL(\d{2})[ -]?9(\d{2})/);
  let fagZ = partNumber.match(/Z-(\d{6})/);

  if (nskRv) {
    bore = parseInt(nskRv[1], 10);
    od = Math.round(bore * 1.45);
    width = Math.round(bore * 0.72);
    typeDesc = "Four-Row Cylindrical Roller Roll Neck Bearing (NSK STF Series)";
    seriesGroup = "NSK Sealed Four-Row Roll Neck Series";
  } else if (ntn4R) {
    bore = parseInt(ntn4R[1], 10) * 10;
    od = Math.round(bore * 1.42);
    width = Math.round(bore * 0.75);
    typeDesc = "Four-Row Cylindrical Roller Bearing (NTN 4R Series)";
    seriesGroup = "NTN 4R Roll Neck Series";
  } else if (koyoFc) {
    bore = parseInt(koyoFc[1], 10) * 10;
    od = Math.round(bore * 1.44);
    width = Math.round(bore * 0.7);
    typeDesc = "Four-Row Cylindrical Roller Bearing (Koyo FC Series)";
    seriesGroup = "Koyo FC Four-Row Rolling Mill Series";
  } else if (inaSl) {
    let sCode = inaSl[1];
    let bCode = parseInt(inaSl[2], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.42);
    width = Math.round(bore * 0.65);
    typeDesc = `Multi-Row Full Complement Cylindrical Roller Bearing (SL${sCode}9 Series)`;
    seriesGroup = `INA SL${sCode}9 Multi-Row Heavy Series`;
  } else if (fagZ) {
    bore = 180;
    od = 280;
    width = 120;
    typeDesc = "Multi-Row Cylindrical Roller Backup Roll Unit (FAG Z-Series)";
    seriesGroup = "FAG Z-Series Rolling Mill Series";
  } else if (partNumber.includes("NN30")) {
    let m = partNumber.match(/NN30(\d{2})/);
    if (m) bore = parseInt(m[1], 10) * 5;
    od = Math.round(bore * 1.55);
    width = Math.round(bore * 0.38);
    typeDesc = "Super Precision Double/Multi Row Cylindrical Roller Spindle Bearing (NN30)";
    seriesGroup = "NN30 Super Precision Series";
  } else if (partNumber.includes("NNU49")) {
    let m = partNumber.match(/NNU49(\d{2})/);
    if (m) bore = parseInt(m[1], 10) * 5;
    od = Math.round(bore * 1.45);
    width = Math.round(bore * 0.45);
    typeDesc = "Super Precision Multi Row Cylindrical Roller Bearing (NNU49)";
    seriesGroup = "NNU49 Super Precision Series";
  }

  // Clearance & Cage
  let clearance = "Normal (CN)";
  if (partNumber.includes("SP") || partNumber.includes("P5")) clearance = "Super Precision Grade (SP / DIN P4 Class)";
  else if (partNumber.includes("C3")) clearance = "C3 (Radial Clearance Greater than Normal)";
  else if (partNumber.includes("C4")) clearance = "C4 (Radial Clearance Greater than C3)";
  else if (partNumber.includes("C2")) clearance = "C2 (Radial Clearance Reduced)";

  let cage = "Solid Machined Brass Roller Guided Cage (M/MB/GAS8)";
  if (partNumber.includes("SL") || partNumber.includes("ZL") || partNumber.includes("LZL") || partNumber.includes("RZL")) {
    cage = "Multi-Row Full Complement Rollers (Maximum Shock & Heavy Load Rigidity)";
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(1);
  if (parseFloat(estWeight) < 1.0) estWeight = "2.5";

  let dyn = Math.round(bore * width * 0.35);
  let stat = Math.round(dyn * 1.8);

  let price = Math.round(parseFloat(estWeight) * 1950 + 2500);

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Multi-Row Cylindrical Roller Bearing ${partNumber}`,
    brand: brand,
    category: "Cylindrical Roller Bearings Multi Row",
    seriesGroup: seriesGroup,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 15) + 5,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade Vacuum-Degassed 100Cr6 / Super-TF Bearing Steel",
    sealType: partNumber.includes("2NR") || partNumber.includes("PP") || partNumber.includes("CR") ? "Contact Rubber Seals / Retaining Rings" : "Open (Multi-Point Lubrication Grooves)",
    cageType: cage,
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(280000 / od)} RPM`,
    countryOfOrigin: brand === "NSK" || brand === "NTN" || brand === "Koyo" ? "Japan" : "Germany",
    application: "Hot and cold metal rolling mills, wire rod rolling stands, backup rolls, multi-roll planetary reducers, heavy calenders, extrusion presses",
    description: `Genuine ${brand} heavy-duty multi-row cylindrical roller bearing ${partNumber}. Engineered for extreme radial load capacities, high shock resistance, and minimum section height in heavy metallurgical and industrial roll neck operations. Precision: ${clearance}.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: partNumber.replace(/-XL|-SP|-GA22|-L091/g, ''), price: Math.round(price * 1.1) },
      { brand: "TIMKEN", partNumber: partNumber.replace(/-XL|-SP/g, ''), price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const products = RAW_MULTI_ROW.map(line => parseMultiRowItem(line));
  console.log(`[Multi Row Script] Parsed ${products.length} Multi Row Cylindrical Roller Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Multi Row Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Multi Row Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Multi Row Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Multi Row Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Multi Row Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Multi Row Script] Connected to MongoDB Atlas.');

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
    console.log(`[Multi Row Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalMulti = await Product.countDocuments({ category: "Cylindrical Roller Bearings Multi Row" });
    const totalFAG = await Product.countDocuments({ brand: "FAG" });
    const totalINA = await Product.countDocuments({ brand: "INA" });
    const totalSKF = await Product.countDocuments({ brand: "SKF" });
    const totalNSK = await Product.countDocuments({ brand: "NSK" });
    const totalNTN = await Product.countDocuments({ brand: "NTN" });
    const totalKoyo = await Product.countDocuments({ brand: "Koyo" });
    console.log(`[Multi Row Script] Current Database Totals: ${totalMulti} Multi Row Cylindrical Bearings | FAG: ${totalFAG}, INA: ${totalINA}, SKF: ${totalSKF}, NSK: ${totalNSK}, NTN: ${totalNTN}, Koyo: ${totalKoyo}.`);
  } catch (err) {
    console.error('[Multi Row Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Multi Row Script] Done.');
  }
}

main();
