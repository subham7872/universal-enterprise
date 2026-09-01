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

const RAW_COLLARS = [
  "1. HJ324 FAG", "2. HJ332-E FAG", "3. HJ313-E FAG", "4. HJ2320-E FAG", "5. HJ2232-E FAG",
  "6. HJ219-E FAG", "7. HJ218-E FAG", "8. HJ1040 FAG", "9. HJ1038 FAG", "10. HJ228-E FAG",
  "11. HJ322E.F1 FAG", "12. HJ320-E FAG", "13. HJ310-E FAG", "14. HJ2236-E FAG", "15. HJ409 FAG",
  "16. HJ2052E FAG", "17. HJ1034 FAG", "18. HJ2311E FAG", "19. HJ317-E-F1 FAG", "20. HJ312-E-F1 FAG",
  "21. HJ2264-EX FAG", "22. HJ2238-E FAG", "23. HJ316-E FAG", "24. HJ311-E FAG", "25. HJ417 FAG",
  "26. HJ315E.F1 FAG", "27. HJ315-E-F1 FAG", "28. HJ232-E FAG", "29. HJ2256-E FAG", "30. HJ421 FAG",
  "31. HJ238-E FAG", "32. HJ2328-E FAG", "33. HJ2326-E FAG", "34. HJ2319-E FAG", "35. HJ2317-E FAG",
  "36. HJ2315-E FAG", "37. HJ224-E FAG", "38. HJ2218-E FAG", "39. HJ220-E FAG", "40. HJ217-E FAG",
  "41. HJ208-E FAG", "42. HJ416 FAG", "43. HJ1072 FAG", "44. HJ318-E-F1 FAG", "45. HJ2317-E-F2 FAG",
  "46. HJ219-E-F1 FAG", "47. HJ1084 FAG", "48. HJ1080 FAG", "49. HJ316 FAG", "50. HJ1076 FAG",
  "51. HJ252-E FAG", "52. HJ314-E-F1 FAG", "53. HJ216.F2 FAG", "54. HJ211E FAG", "55. HJ315-E FAG",
  "56. HJ2316-E FAG", "57. HJ2226-E FAG", "58. HJ214-E FAG", "59. HJ413 FAG", "60. HJ1060 FAG",
  "61. HJ1036 FAG", "62. HJ224-E-F1 FAG", "63. HJ406 FAG", "64. HJ2322E FAG", "65. HJ317-E FAG",
  "66. HJ312-E FAG", "67. HJ2318-E FAG", "68. HJ211-E FAG", "69. HJ1048 FAG", "70. HJ1044 FAG",
  "71. HJ411 FAG", "72. HJ326-E FAG", "73. HJ324-E FAG", "74. HJ319-E FAG", "75. HJ309-E FAG",
  "76. HJ212-E FAG", "77. HJ420 FAG", "78. HJ410 FAG", "79. HJ314-E FAG", "80. HJ306-E FAG",
  "81. HJ236-E FAG", "82. HJ234-E FAG", "83. HJ307-E FAG", "84. HJ248-E FAG", "85. HJ2311-E FAG",
  "86. HJ2228-E FAG", "87. HJ2224-E FAG", "88. HJ2213-E FAG", "89. HJ210-E FAG", "90. HJ1052 FAG",
  "91. HJ230-E FAG", "92. HJ328-E FAG", "93. HJ422 FAG", "94. HJ220E FAG", "95. HJ2244-EX FAG",
  "96. HJ322-E FAG", "97. HJ226-E FAG", "98. HJ2240-E FAG", "99. HJ216-E FAG", "100. HJ1056 FAG",
  "101. HJ2313-E FAG", "102. HJ213E FAG", "103. HJ318-E FAG", "104. HJ244-E FAG", "105. HJ2324-E FAG",
  "106. HJ2322-E FAG", "107. HJ215-E FAG", "108. HJ1032 FAG", "109. HJ320-E-F1 FAG", "110. HJ313-E-F1 FAG",
  "111. HJ2318 FAG", "112. HJ260-E FAG", "113. HJ308-E FAG", "114. HJ2230-E FAG", "115. HJ222-E FAG",
  "116. HJ1064 FAG", "117. HJ213-E FAG", "118. HJ207-E FAG", "119. HJ1068 FAG", "120. HJ2212 FAG",
  "121. HJ424 FAG", "122. HJ2324EC SKF", "123. HJ211 SKF", "124. HJ324EC/VA301 SKF",
  "125. HJ314EC/VA301 SKF", "126. HJ2213 SKF", "127. HJ220EC SKF", "128. HJ1076 SKF",
  "129. HJ317 SKF", "130. HJ207 SKF", "131. HJ216EC SKF", "132. HJ326EC/VA301 SKF",
  "133. HJ2230ECB/VA824 SKF", "134. HJ320EC SKF", "135. HJ318EC/VA301 SKF", "136. HJ312EC/VA301 SKF",
  "137. HJ2232EC SKF", "138. HJ309EC SKF", "139. HJ310 SKF", "140. HJ2205 SKF", "141. HJ320EC/VA301 SKF",
  "142. HJ315EC SKF", "143. HJ315EC/VA301 SKF", "144. HJ320EC/VA396 SKF", "145. HJ2311EC SKF",
  "146. HJ310EC SKF", "147. HJ308EC SKF", "148. HJ419 SKF", "149. HJ2228EC SKF", "150. HJ218EC SKF",
  "151. HJ217 SKF", "152. HJ2207 SKF", "153. HJ322EC/VA301 SKF", "154. HJ320 SKF", "155. HJ326/VA301 SKF",
  "156. HJ408 SKF", "157. HJ314EU AKN", "158. HJ1068 NKE", "159. HJ306EU AKN", "160. HJ413U AKN",
  "161. HJ2312EU AKN", "162. HJ2310EU AKN", "163. HJ2305EU AKN", "164. HJ1080 NKE", "165. HJ1076-E NKE",
  "166. HJ215EU AKN", "167. HJ2232E NSK", "168. HJ322EU AKN", "169. HJ312E.SQ1 NKE", "170. HJ320EC/SV1 Steyr",
  "171. HJ314-E-SQ1 NKE", "172. HJ2311EU AKN", "173. HJ208EU AKN", "174. HJ2218-E-SQ1 NKE",
  "175. HJ311U AKN", "176. HJ309EU AKN", "177. HJ2309EU AKN", "178. HJ214EU AKN", "179. HJ305EU AKN",
  "180. HJ2232E NTN", "181. HJ212EU AKN", "182. HJ2315EU AKN", "183. HJ218EU AKN", "184. 08-R1 FBJ",
  "185. HJ222E Neutral", "186. HJ313 Neutral", "187. WHL60 FAG", "188. HJ2208-E FAG", "189. HJ426 FAG",
  "190. HJ328E FAG", "191. HJ321 FAG", "192. HJ320E FAG", "193. HJ2213E FAG", "194. HJ2230E.F2 FAG",
  "195. HJ312E.F1 FAG", "196. HJ308-E-F1 FAG", "197. HJ248E FAG", "198. NHS40 FAG", "199. HJ417.F1 FAG",
  "200. HJ2318.F2 FAG", "201. HJ313E FAG", "202. HJ312 FAG", "203. HJ2318E FAG", "204. HJ2315E FAG",
  "205. HJ226 FAG", "206. HJ2205E FAG", "207. HJ217 FAG", "208. HJ210E FAG", "209. HJ207E FAG",
  "210. HJ202E FAG", "211. HJ414 FAG", "212. HJ230E FAG", "213. HJ322-E-F1 FAG", "214. HJ311 FAG",
  "215. HJ2220E FAG", "216. HJ307E FAG", "217. HJ322 FAG", "218. HJ324E FAG", "219. HJ408 FAG",
  "220. HJ338 FAG", "221. HJ318 FAG", "222. HJ1896 FAG", "223. HJ319.F1 FAG", "224. HJ416-F1 FAG",
  "225. HJ315 FAG", "226. HJ319E FAG", "227. HJ236E FAG", "228. HJ2232E FAG", "229. HJ205E FAG",
  "230. HJ330E FAG", "231. HJ322E FAG", "232. HJ2240E FAG", "233. HJ419 FAG", "234. HJ1088 FAG",
  "235. HJ240E FAG", "236. HJ310 FAG", "237. HJ2232E.F2 FAG", "238. HJ2320.F2 FAG", "239. HJ202-E FAG",
  "240. HJ311EC FAG", "241. HJ306E FAG", "242. HJ2320 FAG", "243. HJ222E FAG", "244. HJ2228E FAG",
  "245. HJ209E FAG", "246. HJ2306-E FAG", "247. HJ320E.F1 FAG", "248. HJ208E FAG", "249. HJ2208E FAG",
  "250. HJ216-E-F1 FAG", "251. HJ332E FAG", "252. HJ2306 FAG", "253. HJ306 FAG", "254. HJ244 FAG",
  "255. HJ2336 FAG", "256. HJ2208 FAG", "257. HJ2309-E FAG", "258. HJ320 FAG", "259. HJ314E.F1 FAG",
  "260. HJ232E FAG", "261. HJ2317E FAG", "262. HJ215E FAG", "263. HJ2214E.F1 FAG", "264. HJ2313 FAG",
  "265. HJ324-E-F1 FAG", "266. HJ316-E-F1 FAG", "267. HJ209-E FAG", "268. HJ314 FAG", "269. HJ321EC FAG",
  "270. HJ312E FAG", "271. HJ311E FAG", "272. HJ2326E FAG", "273. HJ2218 FAG", "274. HJ326 FAG",
  "275. HJ210 FAG", "276. HJ415 FAG", "277. HJ319 FAG", "278. HJ318E.F1 FAG", "279. HJ208 FAG",
  "280. HJ219E FAG", "281. HJ214E FAG", "282. HJ328.F1 FAG", "283. HJ2230E FAG", "284. HJ415-F1 FAG",
  "285. HJ1032-F1 FAG", "286. HJ314E FAG", "287. HJ317 FAG", "288. HJ206 FAG", "289. HJ316E FAG",
  "290. HJ313E.F1 FAG", "291. HJ2226E FAG", "292. HJ206E FAG", "293. HJ1980 FAG", "294. HJ308 FAG",
  "295. HJ2334EX FAG", "296. HJ2324E FAG", "297. HJ2314 FAG", "298. HJ218 FAG", "299. HJ216 FAG",
  "300. HJ212E FAG", "301. HJ2217-E FAG", "302. HJ228-E-F1 FAG", "303. HJ309 FAG", "304. HJ305 FAG",
  "305. HJ2216 FAG", "306. HJ240-E FAG", "307. HJ418 FAG", "308. HJ328 FAG", "309. HJ2206E FAG",
  "310. HJ326-E-F1 FAG", "311. HJ10/500 FAG", "312. HJ316E.F1 FAG", "313. HJ2211E FAG", "314. HJ2312E FAG",
  "315. HJ313 FAG", "316. HJ234 FAG", "317. HJ2320E FAG", "318. HJ2316E FAG", "319. HJ230E.F1 FAG",
  "320. HJ213 FAG", "321. HJ2309E FAG", "322. HJ212 FAG", "323. HJ326E FAG", "324. HJ2224E FAG",
  "325. HJ1036.F1 FAG", "326. HJ315E FAG", "327. HJ226E FAG", "328. HJ224E FAG", "329. HJ238E FAG",
  "330. HJ209 FAG", "331. HJ1968E FAG", "332. HJ2224-E-F2 FAG", "333. HJ2218-E-F1 FAG",
  "334. HJ1968-E FAG", "335. HJ18/560 FAG", "336. HJ2310E FAG", "337. HJ2309 FAG", "338. HJ2236E FAG",
  "339. HJ2206 FAG", "340. HJ215 FAG", "341. HJ316EC FAG", "342. HJ244E FAG", "343. HJ318E FAG",
  "344. HJ317E FAG", "345. HJ218E FAG", "346. HJ2318-F2 FAG", "347. NHM45 FAG", "348. HJ2213 FAG",
  "349. HJ2314E FAG", "350. HJ2238E FAG", "351. HJ310E FAG", "352. HJ308E FAG", "353. HJ2317 FAG",
  "354. HJ2230E.803182 FAG", "355. HJ221E FAG", "356. HJ220 FAG", "357. HJ217E FAG", "358. HJ316EC SKF",
  "359. HJ219/WM044 SKF", "360. HJ408EC SKF", "361. HJ2205EC SKF", "362. HJ2320EC SKF", "363. HJ2314 SKF",
  "364. HJ234 SKF", "365. HJ322 SKF", "366. HJ411 SKF", "367. HJ1064 SKF", "368. HJ2317 SKF",
  "369. HJ208EC SKF", "370. HJ410 SKF", "371. HJ206EC SKF", "372. HJ228EC/VA301 SKF", "373. HJ1032/VA301 SKF",
  "374. HJ324E SKF", "375. HJ2319 SKF", "376. HJ407 SKF", "377. HJ2311 SKF", "378. HJ221 SKF",
  "379. HJ213 SKF", "380. HJ224 SKF", "381. HJ1036 SKF", "382. HJ318 SKF", "383. HJ413 RHP",
  "384. HJ412 SKF", "385. HJ305 SKF", "386. 635072 SKF", "387. HJ316 SKF", "388. HJ312 SKF",
  "389. HJ2226E SKF", "390. HJ215 SKF", "391. HJ2310 SKF", "392. HJ2304 SKF", "393. HJ319EC SKF",
  "394. HJ421 SKF", "395. HJ305EC SKF", "396. HJ326C/VA301 SKF", "397. HJ219EC SKF", "398. HJ226EC SKF",
  "399. HJ2318 SKF", "400. HJ304 SKF", "401. HJ205 SKF", "402. HJ214 SKF", "403. HJ309 SKF",
  "404. HJ213EC SKF", "405. HJ306EC SKF", "406. HJ234EC SKF", "407. HJ2210 SKF", "408. HJ422 SKF",
  "409. HJ313EC SKF", "410. HJ2208 SKF", "411. HJ2316EC SKF", "412. HJ1032 SKF", "413. HJ2312 SKF",
  "414. HJ215EC SKF", "415. HJ240EC SKF", "416. HJ322/VA301 SKF", "417. HJ315/VA301 SKF",
  "418. HJ321 SKF", "419. HJ2206 SKF", "420. HJ414 SKF", "421. HJ212 SKF", "422. HJ413 SKF",
  "423. HJ306 SKF", "424. HJ332EC SKF", "425. HJ2326EC SKF", "426. HJ226 SKF", "427. HJ315 SKF",
  "428. HJ304EC SKF", "429. HJ1034 SKF", "430. HJ326C SKF", "431. HJ324/VA301 SKF", "432. HJ228EC SKF",
  "433. HJ405 SKF", "434. HJ406 SKF", "435. HJ308 SKF", "436. HJ208 SKF", "437. HJ2305 SKF",
  "438. HJ2208EC SKF", "439. HJ216 SKF", "440. HJ1048 SKF", "441. HJ210 SKF", "442. HJ2212 SKF",
  "443. HJ2306 SKF", "444. HJ234E SKF", "445. HJ311 SKF", "446. HJ218 SKF", "447. HJ207EC SKF",
  "448. HJ420 SKF", "449. HJ416 SKF", "450. HJ217EC SKF", "451. HJ206 SKF", "452. HJ2218EC SKF",
  "453. HJ417 SKF", "454. HJ2214 SKF", "455. HJ205EC SKF", "456. HJ222EC SKF", "457. HJ222 SKF",
  "458. HJ312EC SKF", "459. HJ210EC SKF", "460. HJ311EC SKF", "461. HJ2308 SKF", "462. HJ219 SKF",
  "463. HJ209 SKF", "464. HJ409 SKF", "465. HJ232EC SKF", "466. HJ328 Steyr", "467. 9DAA/K RIV",
  "468. HJ2232E RKB", "469. HJ2317EU AKN", "470. 10DA/K RIV", "471. HJ406 RIV", "472. HJ206EU AKN",
  "473. HJ2072-E NKE", "474. HJ409 Steyr", "475. HJ304EU AKN", "476. HJ318 NSK", "477. HJ305 RIV",
  "478. HJ2318C3 Koyo (JTEKT)", "479. HJ405 RIV", "480. HJ209EU AKN", "481. HJ211 RIV", "482. 2DA/K RIV",
  "483. 10DB/K RIV", "484. 9DA/K RIV", "485. 8DA/K RIV", "486. 12DBB/K RIV", "487. HJ224 RIV",
  "488. HJ318E NSK", "489. HJ2320 Koyo (JTEKT)", "490. HJ326 Steyr", "491. HJ2213 Steyr", "492. HJ406 Steyr",
  "493. HJ1080 RKB", "494. 5DAA/K RIV", "495. HJ413 AKN", "496. HJ221 Steyr"
];

function parseThrustCollar(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  
  let brand = "FAG";
  let last = parts[parts.length - 1];
  let secondLast = parts.length > 2 ? parts[parts.length - 2] : "";

  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else if (last === "SKF" || last === "NKE" || last === "AKN" || last === "Steyr" || last === "RIV" || last === "RKB" || last === "NSK" || last === "RHP" || last === "FBJ" || last === "Neutral" || last === "FAG") {
    brand = last;
    parts.pop();
    cleanLine = parts.join(' ').trim();
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 80;
  let od = 110;
  let width = 12;

  let hjMatch = partNumber.match(/HJ(\d{1,2})(\d{2})/);
  let hjSlash = partNumber.match(/HJ(\d{2})\/(\d{3})/);

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

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx + 1}`;

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
    countryOfOrigin: brand === "NSK" || brand === "Koyo" || brand === "FBJ" ? "Japan" : brand === "RIV" ? "Italy" : brand === "NKE" || brand === "Steyr" || brand === "AKN" ? "Austria" : brand === "RKB" ? "Switzerland" : "Germany",
    application: "Used with NU series cylindrical roller bearings to form axial semi-locating units, or with NJ series to create double-direction axial locating assemblies in gearboxes, heavy electric motors, and pumps.",
    description: `Genuine ${brand} precision L-section angle ring / thrust collar ${partNumber}. Precision ground side and collar face accommodates axial thrust forces when mounted with single-row cylindrical roller bearings. Bore: ${bore}mm, Outer Flange: ${od}mm, Flange Width: ${width}mm.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: partNumber.replace(/-E|-F1|-F2|-SQ1|\.F1|\.F2/g, ''), price: Math.round(price * 1.08) },
      { brand: "FAG", partNumber: partNumber.replace(/EC|EU|\/VA301|\/SV1/g, ''), price: Math.round(price * 1.02) }
    ]
  };
}

async function main() {
  // Deduplicate lines by trimmed content
  const uniqueLines = [...new Set(RAW_COLLARS.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseThrustCollar(line, idx));
  console.log(`[Thrust Collar Script] Parsed ${products.length} unique Thrust Collars.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Thrust Collar Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Cylindrical Roller Thrust Collar to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Cylindrical Roller Thrust Collar"')) {
    dataContent = dataContent.replace(
      /"name": "Combined Needle Roller Bearings",\s*"id": "combined-needle"\s*},/,
      `"name": "Combined Needle Roller Bearings",\n        "id": "combined-needle"\n      },\n      {\n        "name": "Cylindrical Roller Thrust Collar",\n        "id": "cylindrical-thrust-collar"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Thrust Collar Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Thrust Collar Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Thrust Collar Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Thrust Collar Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Thrust Collar Script] Connected to MongoDB Atlas.');

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
    console.log(`[Thrust Collar Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalCollars = await Product.countDocuments({ category: "Cylindrical Roller Thrust Collar" });
    console.log(`[Thrust Collar Script] Current Database Totals: ${totalCollars} Cylindrical Roller Thrust Collars.`);
  } catch (err) {
    console.error('[Thrust Collar Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Thrust Collar Script] Done.');
  }
}

main();
