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

const RAW_DOUBLE_ROW = [
  "1. NNU4996-S-K-M-SP FAG", "2. NNU4992-S-K-M-SP FAG", "3. NNU4984-S-K-M-SP FAG",
  "4. NNU4928-S-K-M-SP-C2 FAG", "5. NNU4924-S-M-SP FAG", "6. NN3096-AS-K-M-SP FAG",
  "7. SL045014-PP-C2 INA", "8. SL024860-A INA", "9. SL08030 INA", "10. SL014868-A-C3 INA",
  "11. SL014844-A-C3 INA", "12. RSL185016-A INA", "13. SL185020-A INA", "14. SL185017-A INA",
  "15. SL045006-PP INA", "16. SL184940-A INA", "17. SL185022-A-C3 INA", "18. SL185010-A-C3 INA",
  "19. SL04-5008PP 2NR INA", "20. SL014922-A INA", "21. SL014932-A INA", "22. NN3052-AS-K-M-SP FAG",
  "23. NNU4926-S-M-SP-C3 FAG", "24. NNU4926S.M.P53 FAG", "25. NN3028-AS-M-SP FAG",
  "26. NNU4930-S-M-SP-C3 FAG", "27. NN3024-D-K-TVP-SP-XL FAG", "28. SL184928-A-C3 INA",
  "29. SL185048-A-BR-C3 INA", "30. SL04160-D-PP-2NR-C3-GA22 INA", "31. SL045040-D-PP-C3 INA",
  "32. SL045030-D-PP-2NR-C3 INA", "33. SL045024-D-PP-C3 INA", "34. SL045044-D-PP INA",
  "35. SL045034-D-PP INA", "36. SL045018-D-PP-2NR INA", "37. SL04260-D INA",
  "38. SL04220-D-PP INA", "39. SL04200-PP-2NR-RR-C3-L091 INA", "40. SL014840A INA",
  "41. SL04260-D-PP-2NR INA", "42. SL045014-PP-2NR-C3-L091 INA", "43. SL045008-PP-C4 INA",
  "44. SL045007-2Z INA", "45. SL014930-A-C4 INA", "46. NN3013-D-TVP-SP-XL FAG",
  "47. SL045020-D-PP-RR-C3-GA22 INA", "48. SL184914-A-C3 INA", "49. SL185038-TB-C3-2S INA",
  "50. SL184926-A-C3 INA", "51. SL184922-A-C3 INA", "52. SL024972-A-XL INA",
  "53. SL024964-A-C3 INA", "54. SL024834-A-2S INA", "55. SL04170-PP-2NR INA",
  "56. RSL185026-A INA", "57. SL045004-C3 INA", "58. SL184944-A INA", "59. SL184916-A INA",
  "60. SL014926-A-C3 INA", "61. SL024936-A INA", "62. SL185013-A INA", "63. SL05016-E-C3 INA",
  "64. SL184936-A-C3 INA", "65. SL045005 INA", "66. NNU4936-S-K-M-SP FAG",
  "67. NN3006-AS-K-M-SP FAG", "68. SL024932-A-C3 INA", "69. SL185007-A-C3 INA",
  "70. SL185005-A INA", "71. SL184924-A INA", "72. RSL185020-A INA", "73. SL185004-A INA",
  "74. SL045006 INA", "75. SL08022 INA", "76. SL01-4924A C3 INA", "77. SL185016-A-C3 INA",
  "78. SL185011-A-C3 INA", "79. SL045012-PP INA", "80. RSL185010-A INA", "81. SL024834-A INA",
  "82. NNU4944-S-M-SP FAG", "83. NNU4944-S-K-M-SP FAG", "84. NNU4940-S-K-M-SP FAG",
  "85. NNU4938-S-M-SP FAG", "86. NN3008-D-K-TVP-SP-XL FAG", "87. SL04240-D-PP-2NR-GA22 INA",
  "88. SL06048-E INA", "89. SL045014-PP-RR INA", "90. SL045009-PP-C4 INA",
  "91. SL045007-C3 INA", "92. SL045026-D-PP-2NR-C3 INA", "93. SL185020-A-BR-C3-2S INA",
  "94. SL185048-A-BR-C3-2S INA", "95. SL045030-D-PP-C3 INA", "96. SL045016-D-PP-2NR INA",
  "97. SL04180-D-PP INA", "98. SL045015 INA", "99. SL185017-A-C3 INA", "100. F-607754.NNT INA",
  "101. SL04300-D-PP-2NR INA", "102. F-236223.NNCF INA", "103. SL045014-PP-RR-C3-L091 INA",
  "104. SL045018-D-PP-2NR-C3-GA22 INA", "105. SL045013-PP-2NR-C3-L091 INA",
  "106. SL045010-PP-2NR-C3-L091 INA", "107. SL04200-D-PP-RR-C5-GA22 INA", "108. SL024940-A-C3 INA",
  "109. SL045022-D-PP-RR INA", "110. SL185052-TB-BR-C3 INA", "111. SL06034-E INA",
  "112. SL05024-E INA", "113. SL024944-A-C3 INA", "114. SL024840-A INA", "115. SL024832-A INA",
  "116. SL045004-PP-2NR INA", "117. NNU4934-S-K-M-SP FAG", "118. NNU4930-S-K-M-SP FAG",
  "119. NNU4936-S-M-SP-C3 FAG", "120. NNU4952-S-M-SP-C3 FAG", "121. NN3064-AS-K-M-SP FAG",
  "122. SL05016-E INA", "123. SL024926-A-C3 INA", "124. SL014948-A-C3 INA",
  "125. SL014934-A-C3 INA", "126. SL014922-A-C3 INA", "127. SL185009-A-C3 INA",
  "128. SL014914-A-C3 INA", "129. SL014956-A-C3 INA", "130. SL185015-A-C3 INA",
  "131. SL185024-A-C3 INA", "132. SL045008-PP-2NR INA", "133. SL045013-PP-2NR INA",
  "134. SL014838-A INA", "135. SL014832-A INA", "136. SL045005-PP-2NR INA",
  "137. NN3048-AS-M-SP FAG", "138. NN3021-D-K-TVP-SP-XL FAG", "139. RSL185026-A-2S INA",
  "140. SL185016-A-BR-C3 INA", "141. F-212543.RNN INA", "142. SL185026-A-BR-C3 INA",
  "143. SL04150-D-PP-RR-C5-GA22 INA", "144. SL04130-D-PP-2NR-C3-GA22 INA",
  "145. SL045020-D-PP-C3 INA", "146. SL045036-D-PP INA", "147. SL045028-D INA",
  "148. SL045022-D-PP-2NR INA", "149. SL045019-D INA", "150. SL045018-D INA",
  "151. SL04240-D-PP INA", "152. SL185034-A-BR-2S INA", "153. SL045012-C3 INA",
  "154. SL045038-PP-2NR-C3-L091 INA", "155. SL185036-TB-BR INA",
  "156. SL045028-D-PP-2NR-C3-GA22 INA", "157. SL045022-D-PP-C5-GA22 INA",
  "158. SL045012-PP-2NR-C3-L091 INA", "159. SL04200-D-PP-2NR-C3-GA22 INA",
  "160. SL185044-TB-BR-C3 INA", "161. SL045022-D-PP INA", "162. SL045020-D-PP INA",
  "163. SL045012-PP-C4 INA", "164. SL045009-2Z INA", "165. SL045008-P INA",
  "166. SL045005-2Z INA", "167. SL04260-PP-RR-C5-L091 INA", "168. SL014920-A-C5 INA",
  "169. NN3024-D-TVP-SP-XL FAG", "170. NN3012-D-TVP-SP-XL FAG", "171. SL05028-E INA",
  "172. SL024952-A-C3 INA", "173. SL014938-A-C3 INA", "174. RSL185006-A INA",
  "175. SL05018-E INA", "176. SL185030-A-C3 INA", "177. SL185005-A-C3 INA",
  "178. SL185048-A INA", "179. SL024934-A INA", "180. SL185036-TB-BR-C3 INA",
  "181. RSL185007-A INA", "182. SL045010-PP-2NR INA", "183. SL184936-A INA",
  "184. NNU4980-S-K-M-SP FAG", "185. SL024922-A-C3 INA", "186. SL045015-PP INA",
  "187. SL045012 INA", "188. SL185032-A-C3 INA", "189. SL185008-A-C3 INA",
  "190. SL045006-PP-2NR INA", "191. SL045012-PP-2NR INA", "192. SL045011-PP-2NR INA",
  "193. SL014926-A INA", "194. SL014914-A INA", "195. SL014834-A INA",
  "196. NN3048-AS-K-M-SP FAG", "197. NNU4956-S-K-M-SP FAG", "198. NNU4938-S-M-SP-C3 FAG",
  "199. NNU4920-S-K-M-SP-C2 FAG", "200. NN3026-AS-M-SP-C2 FAG", "201. NN3019-D-K-TVP-SP-XL FAG",
  "202. NN3007-D-K-TVP-SP-XL FAG", "203. NN3036-AS-K-M-SP-C3 FAG",
  "204. SL045018-D-PP-R55-80-L271/25G INA", "205. SL045014-PP-C3 INA", "206. SL045008-S3-C4 INA",
  "207. SL014856-A-C3 INA", "208. SL045028-D-PP-2NR-C3 INA", "209. SL045026-D-PP-C3 INA",
  "210. SL04130-D-PP-C3 INA", "211. SL185048-TB-BR-C3-2S INA", "212. SL045052-D-PP-2NR INA",
  "213. SL045032-D-PP-2NR INA", "214. SL045028-D-PP INA", "215. SL045017-D INA",
  "216. SL04260-D-PP INA", "217. SL045016-D-PP-RR-C5-GA22 INA",
  "218. SL045032-D-PP-2NR-C3-GA22 INA", "219. SL045015-PP-2NR-C3-L091 INA",
  "220. SL04170-D-PP-2NR INA", "221. SL04150-D INA", "222. SL045018-D-PP INA",
  "223. SL185040-TB-BR-C3 INA", "224. SL05034-E INA", "225. SL05024-E-C3 INA",
  "226. SL024852-A-C3 INA", "227. SL185015A INA", "228. SL024948-A-C3 INA",
  "229. SL024834-A-C3 INA", "230. SL06030-E INA", "231. SL045013-PP-C3 INA",
  "232. SL185028-A INA", "233. SL045040-PP INA", "234. SL045004 INA", "235. SL024932-A INA",
  "236. SL024930-A INA", "237. SL024912-A INA", "238. SL024830-A INA", "239. SL024844-A INA",
  "240. SL045012-PP-C3 INA", "241. NNU4988-S-K-M-SP FAG", "242. NNU4921-S-M-SP FAG",
  "243. NN3030-AS-K-M-SP FAG", "244. NNU4972-S-K-M-SP FAG", "245. NN3088-AS-K-M-SP FAG",
  "246. SL18-5072C3 INA", "247. SL014972-A INA", "248. SL05040-E INA"
];

function parseDoubleRowItem(line) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = parts.pop().toUpperCase();
  let partNumber = parts.join(' ').replace(/,/g, '.');

  let clean = partNumber;

  let bore = 100, od = 160, width = 45;
  let typeDesc = "Double Row Cylindrical Roller Bearing";
  let seriesGroup = "Double Row Cylindrical Series";

  // Check NN30 / NNU49 super precision series
  let nnMatch = clean.match(/^NN30(\d{2})/);
  let nnuMatch = clean.match(/^NNU49(\d{2})/);
  let sl04Match = clean.match(/SL04(\d{2,3})/);
  let sl50Match = clean.match(/SL18[ -]?50(\d{2})/);
  let sl49Match = clean.match(/SL18[ -]?49(\d{2})/);
  let sl01Match = clean.match(/SL01[ -]?(\d{2})(\d{2})/);
  let sl02Match = clean.match(/SL02[ -]?(\d{2})(\d{2})/);
  let sl05Match = clean.match(/SL050(\d{2})/);
  let sl06Match = clean.match(/SL060(\d{2})/);
  let sl08Match = clean.match(/SL080(\d{2})/);

  if (nnMatch) {
    let bCode = parseInt(nnMatch[1], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.55);
    width = Math.round(bore * 0.38);
    typeDesc = "Super Precision Double Row Cylindrical Roller Bearing (NN30 Series)";
    seriesGroup = "NN30 Super Precision Spindle Series";
  } else if (nnuMatch) {
    let bCode = parseInt(nnuMatch[1], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.45);
    width = Math.round(bore * 0.45);
    typeDesc = "Super Precision Double Row Cylindrical Roller Bearing (NNU49 Series)";
    seriesGroup = "NNU49 High-Rigidity Series";
  } else if (sl04Match) {
    let sVal = parseInt(sl04Match[1], 10);
    if (sVal >= 5000) {
      bore = (sVal - 5000) * 5;
      od = Math.round(bore * 1.5);
      width = Math.round(bore * 0.52);
    } else {
      bore = sVal;
      od = Math.round(bore * 1.45);
      width = Math.round(bore * 0.5);
    }
    typeDesc = "Double Row Full Complement Sheave / Pulley Bearing (SL04 Series)";
    seriesGroup = "SL04 Full Complement Rope Sheave Series";
  } else if (sl50Match) {
    let bCode = parseInt(sl50Match[1], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.5);
    width = Math.round(bore * 0.5);
    typeDesc = "Double Row Full Complement Cylindrical Roller Bearing (SL1850 Series)";
    seriesGroup = "SL1850 Heavy Load Series";
  } else if (sl49Match) {
    let bCode = parseInt(sl49Match[1], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.42);
    width = Math.round(bore * 0.42);
    typeDesc = "Double Row Full Complement Cylindrical Roller Bearing (SL1849 Series)";
    seriesGroup = "SL1849 Compact Series";
  } else if (sl01Match || sl02Match) {
    let m = sl01Match || sl02Match;
    let bCode = parseInt(m[2], 10);
    bore = bCode * 5;
    od = Math.round(bore * 1.44);
    width = Math.round(bore * 0.44);
    typeDesc = "Double Row Full Complement Cylindrical Roller Bearing (SL01/SL02 Series)";
    seriesGroup = "SL01/SL02 Full Complement Series";
  } else if (sl05Match || sl06Match || sl08Match) {
    let m = sl05Match || sl06Match || sl08Match;
    bore = parseInt(m[1], 10) * 5;
    od = Math.round(bore * 1.55);
    width = Math.round(bore * 0.45);
    typeDesc = "Double Row Full Complement Cylindrical Roller Bearing";
    seriesGroup = "SL Full Complement Series";
  }

  if (width < 20) width = 20;

  // Clearance & Tolerance
  let clearance = "Normal (CN)";
  if (clean.includes("SP") || clean.includes("P53")) clearance = "Super Precision Grade (SP / DIN P4 Class)";
  else if (clean.includes("C2")) clearance = "C2 (Reduced Radial Clearance)";
  else if (clean.includes("C3")) clearance = "C3 (Greater than Normal)";
  else if (clean.includes("C4")) clearance = "C4 (Greater than C3)";
  else if (clean.includes("C5")) clearance = "C5 (Extra Large Radial Clearance)";

  // Bore type
  let boreType = clean.includes("-K") || clean.includes(".K") || clean.includes("K-") ? "Tapered Bore 1:12 (K)" : "Cylindrical Bore";

  // Cage type
  let cage = "Full Complement (Cageless Maximum Dynamic Load Capacity)";
  if (clean.includes("-M") || clean.includes(".M") || clean.includes("-MB")) cage = "Machined Solid Brass Roller-Guided Cage (M/MB)";
  else if (clean.includes("TVP")) cage = "Glass-Fibre Reinforced Polyamide (TVP)";
  else if (clean.includes("TB")) cage = "Laminated Phenolic Textile Cage (TB)";

  // Seal type
  let seal = "Open (Lubrication Groove & Holes W33)";
  if (clean.includes("-PP") || clean.includes("PP")) seal = "Contact Lip Seals (PP) with Locating Snap Rings (2NR)";
  if (clean.includes("2Z") || clean.includes("-2Z")) seal = "Non-Contact Metallic Shields (2Z)";

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.2) estWeight = "0.55";

  let dyn = Math.round(bore * width * 0.24);
  let stat = Math.round(dyn * 1.55);

  let price = Math.round(parseFloat(estWeight) * 1850 + 1400);
  if (clean.includes("-SP") || clean.includes("P53")) price = Math.round(price * 1.45 + 3200);

  let cleanId = `${brand.toLowerCase()}-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return {
    id: cleanId,
    partNumber: clean,
    name: `${brand} ${typeDesc} ${clean}`,
    brand: brand,
    category: "Cylindrical Roller Bearings Double Row",
    seriesGroup: seriesGroup,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 25) + 8,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (Schaeffler FAG/INA German Standard)",
    sealType: seal,
    cageType: cage,
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(350000 / od)} RPM`,
    countryOfOrigin: "Germany",
    application: "CNC machine tool main spindles, crane rope sheaves, port hoisting drums, heavy planetary gear reducers, metal rolling mills",
    description: `Genuine ${brand} double row cylindrical roller bearing ${clean}. High radial rigidity, extreme radial load capacity, and precise shaft guidance under severe dynamic loads. Bore: ${boreType}. Precision: ${clearance}.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: clean.replace(/-SP|-XL|-GA22|-L091|-C3|-C4|-C2/g, ''), price: Math.round(price * 1.09) },
      { brand: "NSK", partNumber: clean.replace(/-XL/g, ''), price: Math.round(price * 1.03) }
    ]
  };
}

async function main() {
  const products = RAW_DOUBLE_ROW.map(line => parseDoubleRowItem(line));
  console.log(`[Double Row Script] Parsed ${products.length} Double Row Cylindrical Roller Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Double Row Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Double Row Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Double Row Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Double Row Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Double Row Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Double Row Script] Connected to MongoDB Atlas.');

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
    console.log(`[Double Row Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalDouble = await Product.countDocuments({ category: "Cylindrical Roller Bearings Double Row" });
    const totalFAG = await Product.countDocuments({ brand: "FAG" });
    const totalINA = await Product.countDocuments({ brand: "INA" });
    console.log(`[Double Row Script] Current Database Totals: ${totalDouble} Double Row Cylindrical Roller Bearings | ${totalFAG} FAG | ${totalINA} INA.`);
  } catch (err) {
    console.error('[Double Row Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Double Row Script] Done.');
  }
}

main();
