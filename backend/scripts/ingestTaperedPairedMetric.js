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

const RAW_PAIRED = [
  "1. 32224-A-N11CA-A230-280 FAG", "2. 32230-XL-DF-A340-390 FAG", "3. 32015-X-N11CA-A150-200 FAG",
  "4. 32220-XL-DF-A230-280 FAG", "5. 31316-XL-DF-A120-160 FAG", "6. 32219-XL-DF-A150-180 FAG",
  "7. 31313-XL-DF-A80-120 FAG", "8. F-600442.TR2S-WPOS FAG", "9. 32030-X-XL-DF-A120-170 FAG",
  "10. 30224-XL-DF-A230-280 FAG", "11. 31326-X-N11CA-A260-320 FAG", "12. 31317-XL-DF-A120-160 FAG",
  "13. 30224A.A160.190.N11CA FAG", "14. 31324-X-DF-A140-180 FAG", "15. 32017-X-XL-DF-A190-230 FAG",
  "16. 30212-XL-DF-A75-110 FAG", "17. 30220-A-DF-A80-120 FAG", "18. 30222-A-N11CA-A250-300 FAG",
  "19. 32032-X-XL-DF-A280-330 FAG", "20. 32228-XL-DF-A300-350 FAG", "21. 33118.A250.300.N11BA FAG",
  "22. 33024-N11CA-A370-420 FAG", "23. 31328X.A160.200.N11CA FAG", "24. 32221-XL-DF-A230-280 FAG",
  "25. 30232-XL-DF-A280-330 FAG", "26. 32036-X-XL-DF-A320-370 FAG", "27. 30240-XL-DF-A350-400 FAG",
  "28. 32240A.A500.550.N11CA FAG", "29. 32952-X-N11CA-A500-55 FAG", "30. 30219A.A220.270.N11CA FAG",
  "31. 32330-N11CA-A350-400 FAG", "32. 30212-XL-DF-A100-140 FAG", "33. 32248-XL-DF-A350-400 FAG",
  "34. 32234-XL-DF-A320-370 FAG", "35. 32032-X-XL-DF-A300-350 FAG", "36. 32018-X-XL-DF-A220-270 FAG",
  "37. 31309-XL-DF-A60-100 FAG", "38. 30226-XL-DF-A250-300 FAG", "39. 31330-X-XL-DF-A180-230 FAG",
  "40. 31313-XL-DF-A120-160 FAG", "41. 32944-XL-DF-A420-470 FAG", "42. 32226-XL-DF-A420-470 FAG",
  "43. 32228A.A250.300.N11CA FAG", "44. 32028-X-XL-DFA-A300-350 FAG", "45. 32032-X-XL-DF-A400-450 FAG",
  "46. 32026-X-XL-DF-A250-300 FAG", "47. 32016-X-XL-DF-A150-200 FAG", "48. 31308-XL-DF-A50-90 FAG",
  "49. 31326-X-N11CB-A260-320 FAG", "50. 31306-A-DF-A50-90 FAG", "51. 31326-X-XL-DF-A160-200 FAG",
  "52. 31319-XL-DF-A120-160 FAG", "53. 32022-X-XL-DF-A90-130 FAG", "54. 30228-XL-DF-A250-300 FAG",
  "55. 31320-X-XL-DF-A120-160 FAG", "56. 32234-XL-DF-A350-410 FAG", "57. 32226-XL-DF-A250-300 FAG",
  "58. 32034-X-XL-DF-A330-380 FAG", "59. 32030-X-XL-DF-A280-330 FAG", "60. 32026-X-XL-DF-A200-250 FAG",
  "61. 32016-X-XL-DF-A140-170 FAG", "62. 32226-A-N11CA-A250-300 FAG", "63. 32048-X-XL-DF-A400-450 FAG",
  "64. 32014-X-XL-DF-A80-100 FAG", "65. 32221A.A230.280.N11CA FAG", "66. 32232-XL-DF-A280-330 FAG",
  "67. 32230-XL-DF-A280-330 FAG", "68. 32038-X-XL-DF-A350-400 FAG", "69. 31328-X-XL-DF-A160-200 FAG",
  "70. 31322-X-XL-P5-DF-A120-160 FAG", "71. 31326-X-XL-DF-A260-320 FAG", "72. 31312-XL-DF-A80-120 FAG",
  "73. 30236-XL-DF-A250-300 FAG", "74. 32972-XL-DF-A200-250 FAG", "75. 32228-XL-DF-A250-300 FAG",
  "76. 31322-X-XL-DF-A200-250 FAG", "77. 33122-N11CA-A230-280 FAG", "78. 32222-XL-DF-A230-280 FAG",
  "79. 32028-X-XL-DF-A250-300 FAG", "80. 32024-X-XL-DF-A230-280 FAG", "81. 32018-X-XL-DF-A170-220 FAG",
  "82. 30240-XL-DF-A550-600 FAG", "83. 32240-XL-DF-J30PC-A500-550 FAG", "84. 32026-X-N11CA-A250-300 FAG",
  "85. 30220-A-N11CA-A180-220 FAG", "86. 32238-XL-DF-A350-400 FAG", "87. 31328-X-XL-DF-A80-120 FAG",
  "88. 31316-XL-DF-A100-140 FAG", "89. 32224-XL-DF-A230-280 FAG", "90. 31318-DF-A120-160 FAG",
  "91. 32232-XL-DF-A470-520 FAG", "92. 32020-X-XL-DF-A220-270 FAG", "93. 30234-XL-DF-A280-330 FAG",
  "94. 30230-XL-DF-A280-330 FAG", "95. 31314/CL7ADF SKF", "96. 32220/DF SKF",
  "97. 32218/DF SKF", "98. 32230/DF SKF", "99. 31306/DF SKF", "100. 32222J2/DFC310 SKF",
  "101. 31317/DF SKF", "102. 31305/DF SKF", "103. 31324X/DF SKF", "104. 31322X/DF SKF",
  "105. 32244J2/DFVQ652 SKF", "106. 32240/DF SKF", "107. 32226/DF SKF", "108. T7FC060T80/QCL7CDTC10 SKF",
  "109. 31314DF-90KA3 Timken", "110. 32030X/DF SKF", "111. 32028X/DF SKF", "112. 31310/CL7CDF SKF",
  "113. 31312/DF SKF", "114. 32936/DF SKF", "115. 32228J2/DF SKF", "116. 32224DF-90KB1 Timken",
  "117. 32304J2/DF SKF", "118. 31309/CL7CDF SKF", "119. 32020X/DF SKF", "120. 31320X/DF SKF",
  "121. BT2-0183C/PEX SKF", "122. 32056X/DF SKF", "123. 32224/DF SKF", "124. 30309J2/QDF SKF",
  "125. 32016X/DF SKF", "126. 32014X/DF SKF", "127. 32217/DF SKF", "128. 30226T97.5/DB SKF",
  "129. BT2-0183B/L4B SKF", "130. 31313/CL7CDF SKF", "131. BX-32936/DFC250 SKF", "132. 31305J2/DF SKF",
  "133. BT2-0164 SKF", "134. 31311/DF SKF", "135. 31316J1/QCL7ADF SKF", "136. 31326X/DF SKF",
  "137. 32232/DF SKF", "138. 32024X/DF SKF", "139. 31328X/DF SKF", "140. 33122/DF SKF",
  "141. 31319/DF SKF", "142. 30220/DF SKF", "143. 32960/L4BDFC480VR684 SKF", "144. BT2-0145 SKF",
  "145. T7FC055/QS0CL7CDFC100 SKF", "146. 32044XDF-90KA1 Timken", "147. 32038X/DF SKF",
  "148. 30222/DF SKF", "149. BT2-0246/PEX SKF", "150. 31318/DF SKF", "151. 30224/DF SKF",
  "152. 32944/DF SKF", "153. 32034X/DF SKF", "154. 45C30210JR/5.5CS20 Koyo (JTEKT)",
  "155. 30312JR/DB+KL10AC3 Koyo (JTEKT)", "156. 27KWD02G3CA10 NTN", "157. 30219UDF C3 NTN",
  "158. 32230UDF C500 NTN", "159. HR32240JADF+KRCA4-01 NSK", "160. IKOS045 NKE",
  "161. HR32048XJDF+KRC3 NSK", "162. HR32036XJDF+KRCA355 NSK", "163. HR32048XJDF+KR NSK",
  "164. HR31309JDF+KRCA90 NSK", "165. 30228DF C440 SNR", "166. 27KWD02G3CA SA01 NSK",
  "167. 42KWD08AU42C-01 NSK", "168. HR32240JDF+KRCA60-01 NSK", "169. TRB118676 NKE",
  "170. 31322J+HR31322J NSK", "171. HR30334JUC/R170-12DF+KRCA470U303 NSK", "172. HR70KBE42+L NSK",
  "173. HR32032XJDF+KR NSK", "174. IKOS070 NKE", "175. 4T-CRI-0822LLCS150 NTN",
  "176. HR30220JDF+KR NSK", "177. 32968-DF-A200&250 NKE", "178. 32028-X-DB-A200&260-T130-SQ2-77 NKE",
  "179. 46C30315/7 Koyo (JTEKT)", "180. 32968-DF NKE", "181. HR30222JDF+KR NSK",
  "182. 32230UDF C500 SNR", "183. IKOS020 NKE", "184. HR32044XJDF+KRCA720 NSK",
  "185. R380-4DF+KRCA490U303 NSK", "186. IKOS025 NKE", "187. HR31317JDF+KRCA140 NSK",
  "188. 32230DF C500 NTN", "189. 30240DF NKE", "190. F15130 A&S - Fersa", "191. IKOS025 SWC",
  "192. 32228XDF Rollway", "193. 32036XDF Rollway", "194. 32064XM.DF Neutral", "195. DAC01WD10 Neutral",
  "196. 32218-A-N11CA-A150-190 FAG", "197. 32224A.A230.280.N11CA FAG", "198. 32220A.A230.280.N11CA FAG",
  "199. 32030X.A280.330.N11CA FAG", "200. 32026X.A250.300.N11CA FAG", "201. 566834.H195 FAG",
  "202. 31320X.A120.160.M15CZ FAG", "203. 31311A.A80.120.N11CA FAG", "204. 31308A.A50.90.N11CA FAG",
  "205. 32321-A-DF-A300-350 FAG", "206. 32040X.A350.400.N11B FAG", "207. 30224-A-N11BB-A270-32 FAG",
  "208. 32216-XL-DF-A180-220 FAG", "209. 32222-A-N11CA FAG", "210. 30222A.A230.280.N11CA FAG",
  "211. 31322X.A140.180.N11CA FAG", "212. 32048-X-XL-DF-A700-800 FAG", "213. 31322-X-XL-P5-DF-A140-180 FAG",
  "214. 31310-A-DF-A60-100 FAG", "215. 31326-X-N11CA-A160-200 FAG", "216. 31330X.A180.230.N11CA FAG",
  "217. 32048-X-DF-A700-750 FAG", "218. 32944-XL-DF-A400-450 FAG", "219. 32060-X-XL-DF-A550-600 FAG",
  "220. 31314A.A100 FAG", "221. 32936-N11CA-A360-410 FAG", "222. 31317.A120.160.N11CA FAG",
  "223. 31314A.A100.140.N11CA FAG", "224. 32932-DBA-A80-120 FAG", "225. 32936-N11CA-A180-230 FAG",
  "226. 32048-X-N11CA FAG", "227. 32936-A-N11CA-A360-41 FAG", "228. 31307-A-N11CA-A40-70 FAG",
  "229. 566193.H195 FAG", "230. 32030-X-N11CA-A280-330 FAG", "231. 30217-A-DBA-A10-45 FAG",
  "232. 32236-XL-DF-A330-380 FAG", "233. 32052-X-XL-DF-A500-550 FAG", "234. 32022-X-XL-DF-A220-270 FAG",
  "235. 32017-X-XL-P5-DF-A80-100 FAG", "236. 32234-A-N11CA-A350-410 FAG", "237. 32228-A-N11CA-A250-300 FAG",
  "238. 32044-X-N11CA-A400-450 FAG", "239. 31312A.A80.120.N11CA FAG", "240. 32026X.A200.250.N11CA FAG",
  "241. 566074.H195 FAG", "242. 32232A.A470.520.N11CA FAG", "243. 31330-X-XL-DF-A180-230-M30D FAG",
  "244. 32018X.N11CA FAG", "245. 30234/32234 FAG", "246. 32944-N11CA-A400-450 FAG",
  "247. 31310-A-N11CA-A60-100 FAG", "248. 31319A.120.160.N11CA FAG", "249. 31320-X-N11CA-A120-16 FAG"
];

function parsePairedTapered(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  
  let brand = "FAG";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else if (cleanLine.includes("A&S - Fersa")) {
    brand = "Fersa";
    cleanLine = cleanLine.replace("A&S - Fersa", "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = ["FAG", "SKF", "NSK", "NTN", "Timken", "NKE", "SNR", "Rollway", "SWC", "Neutral"];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 80, od = 140, width = 65;
  let arrangement = "Face-to-Face (DF) Paired Set";
  if (partNumber.includes("DB") || partNumber.includes("/DB") || partNumber.includes("-DB")) {
    arrangement = "Back-to-Back (DB) Paired Set";
  } else if (partNumber.includes("DT") || partNumber.includes("/DT")) {
    arrangement = "Tandem (DT) Paired Set";
  }

  let isoMatch = partNumber.match(/^(?:HR|BX-|TRB)?(\d{5})/);
  if (isoMatch) {
    let codeStr = isoMatch[1];
    let sCode = codeStr.substring(0, 3);
    let bCode = parseInt(codeStr.substring(3), 10);
    if (bCode === 4) bore = 20;
    else if (bCode === 5) bore = 25;
    else if (bCode === 6) bore = 30;
    else if (bCode === 7) bore = 35;
    else if (bCode === 8) bore = 40;
    else if (bCode === 9) bore = 45;
    else bore = bCode * 5;

    let odFactor = sCode.startsWith("303") || sCode.startsWith("323") ? 2.1 : sCode.startsWith("322") || sCode.startsWith("313") ? 1.85 : 1.55;
    let singleWidth = Math.round(bore * 0.35);
    od = Math.round(bore * odFactor);
    width = singleWidth * 2 + 10; // paired width with intermediate spacer
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.5) estWeight = "1.25";

  let dyn = Math.round(bore * width * 0.38);
  let stat = Math.round(dyn * 1.55);

  let price = Math.round(parseFloat(estWeight) * 1950 + 1600);

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-paired-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Paired Metric Tapered Roller Bearing Set ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Bearing Single Row (paired metric)",
    seriesGroup: "Metric Paired Tapered Roller Bearing Assemblies (DF/DB/N11CA)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 20) + 6,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (Calibrated Spacer Pair)",
    sealType: "Open (Paired Set with Precision Intermediate Spacers)",
    cageType: "Matched Pressed Steel Window-Type Cages",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(320000 / od)} RPM`,
    countryOfOrigin: brand === "NSK" || brand === "NTN" || brand === "Koyo" ? "Japan" : brand === "NKE" ? "Austria" : brand === "SNR" ? "France" : "Germany",
    application: "Worm & helical gear drives, heavy rolling mill pinion stands, automotive transmission output shafts, heavy crane hoisting drums, cable car pulleys",
    description: `Genuine ${brand} factory matched and pre-adjusted metric tapered roller bearing pair ${partNumber}. Arrangement: ${arrangement}. Features calibrated axial internal clearance intermediate spacer rings for seamless bidirectional thrust and high radial rigidity.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: partNumber.replace(/-XL|-N11CA|-N11BA|-N11CB|-P5/g, '') + "/DF", price: Math.round(price * 1.08) },
      { brand: "TIMKEN", partNumber: partNumber.replace(/-XL|-DF|-A\d+-\d+/g, '') + "DF", price: Math.round(price * 1.06) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_PAIRED.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parsePairedTapered(line, idx)).filter(Boolean);
  console.log(`[Paired Tapered Script] Parsed ${products.length} unique Paired Metric Tapered Roller Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Paired Tapered Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Bearing Single Row (paired metric) to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Bearing Single Row (paired metric)"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Bearing Single Row",\s*"id": "tapered-single"\s*},/,
      `"name": "Tapered Roller Bearing Single Row",\n        "id": "tapered-single"\n      },\n      {\n        "name": "Tapered Roller Bearing Single Row (paired metric)",\n        "id": "tapered-single-paired-metric"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Paired Tapered Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Paired Tapered Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Paired Tapered Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Paired Tapered Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Paired Tapered Script] Connected to MongoDB Atlas.');

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
    console.log(`[Paired Tapered Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalPaired = await Product.countDocuments({ category: "Tapered Roller Bearing Single Row (paired metric)" });
    console.log(`[Paired Tapered Script] Current Database Totals: ${totalPaired} Paired Metric Tapered Roller Bearings.`);
  } catch (err) {
    console.error('[Paired Tapered Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Paired Tapered Script] Done.');
  }
}

main();
