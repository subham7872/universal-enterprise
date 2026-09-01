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

const RAW_DOUBLE_TAPERED = [
  "1. F-622923.TR1-WPOS-J30PC-DF-A400-450 FAG", "2. 515496 FAG", "3. F-586919.TR2-WPOS-U0515-8203 FAG",
  "4. Z-511997.TR2 FAG", "5. F-807332.TR2SK FAG", "6. F-600066.TR2S FAG", "7. F-572672.TR2K-J30PC FAG",
  "8. 515126 FAG", "9. 541235 FAG", "10. 538177 FAG", "11. 533370TVP FAG",
  "12. F-808133.01.TR2SK-A250-300 FAG", "13. 546547 FAG", "14. F-808254.TR2 FAG",
  "15. 548893.A550.600.N11BA FAG", "16. F-569763.M41X FAG", "17. 809747A FAG", "18. Z-511990.TR2 FAG",
  "19. F-574824.TR2S-WPOS FAG", "20. F-803795-TR2 FAG", "21. 567571.W209D.VA50.100 FAG",
  "22. NA48990SW-99401 Timken", "23. 368A/363D Timken", "24. BTH-1206AB SKF", "25. 55194X/55452D Timken",
  "26. 55197/55433D Timken", "27. XC06536CD/JXC06536DC Timken", "28. NA483SW-90291 Timken",
  "29. 368/363DPREC.3 Timken", "30. 124070/124112XGNE+30 Gamet", "31. NA366/363D Timken",
  "32. NA24776SW-90042 Timken", "33. NA497SW-90221 Timken", "34. NA81550/81963CD Timken",
  "35. L357049NW/L357010CD Timken", "36. 495/493D Timken", "37. JXC25763C/JXC25763D Timken",
  "38. BY-BT2-8049A/HB1 SKF", "39. 29675/29622D Timken", "40. BT2-0093A SKF",
  "41. 130070/130120HEO Gamet", "42. LM501334SD/LM501310 Timken", "43. C-7390-G Timken",
  "44. BY-BT2-0337/PEX SKF", "45. NA33895SW-90085 Timken", "46. M224742TA-90011 Timken",
  "47. 07100/07196D Timken", "48. 397/394D Timken", "49. NA44143/44363D Timken",
  "50. 09074A-90018 Timken", "51. NA94700-90159 Timken", "52. HM959738DW-902A1 Timken",
  "53. NP025753-90KA1 Timken", "54. NA33895SW/K103272A Timken", "55. BT2-0108 SKF",
  "56. NA476/472D Timken", "57. 133075/133130HEO Gamet", "58. 331714A SKF",
  "59. 56418-90015 Timken", "60. 122TDOS9550AO1249G2 Timken", "61. 495AS/493DPREC.3 Timken",
  "62. 67388/67322D Timken", "63. HM261049/HM261010CD Timken", "64. HM252344NA/315D Timken",
  "65. 131097/131152XGE Gamet", "66. FW115 SKF", "67. NA439SW-90043 Timken",
  "68. NA483SW-90209 Timken", "69. BTH-5401 SKF", "70. BT2-8366/HM1L4BVR684 SKF",
  "71. 593/592D Timken", "72. NA33895SW-90093 Timken", "73. LM665949DW-902B6 Timken",
  "74. NP837197/NP863447 Timken", "75. 366/363D Timken", "76. 43118/43319D Timken",
  "77. XC10237CH/XC10237DC Timken", "78. 71450/71751D Timken", "79. 07210X/07100D Timken",
  "80. M268730/M268710CD Timken", "81. LM251649NW-99401 Timken", "82. L610549/L610510D Timken",
  "83. NA46790SW/46720CD Timken", "85. 112045/112085G Gamet", "86. NA596SW/592D Timken",
  "87. NA558/552D Timken", "88. NA643/632D Timken", "89. JXC25381CH/JXC25381DC Timken",
  "90. 180100/180180HEO Gamet", "91. 497/493D Timken", "92. NA48685SW/48620D Timken",
  "93. NA439SW-90037 Timken", "94. NA759/752D Timken", "95. 94700/94114CD Timken",
  "96. 43118-90045 Timken", "97. 97450-902A2 Timken", "98. BT2-0140 SKF",
  "99. BTHB1866047A SKF", "100. NA497SW-90235 Timken", "101. NA41125/41294D Timken",
  "102. LL483449-90024 Timken", "103. NA483SW-90251 Timken", "104. BTH1229 SKF",
  "105. NA48290SW/48220D Timken", "106. M244249DW/M244210 Timken", "107. 180105/180190HEO Gamet",
  "108. BT2-8606-BD/V03 SKF", "109. NA539/533D Timken", "110. HM237536-237510D Timken",
  "111. L357049/L357010CD Timken", "112. WBK10 Timken", "113. NP694163-90UA4 Timken",
  "114. 113060/113100HEO Gamet", "115. EE234156/216CD+L NSK", "116. NA56425SWR/650DRC3 NSK",
  "117. 575 00 48110 RIV", "118. 4T-46790/46720D+A-3 NTN", "119. STF400KDH6505DGAS8 NSK",
  "120. JHM720249D/JHM720210D NTN", "121. EE130902/131401CD+L NSK", "123. NA580R/572DR NSK",
  "124. HM261049/HM261010DA+AC3 NTN", "125. 67780/20D+LC3 NSK", "126. 130KBE030+L1 Nachi",
  "127. 46334AS1C3 Koyo (JTEKT)", "128. NA94700/94114DC3 NSK", "129. HM262749/710D+LC3 NSK",
  "130. 320KBE030+L NSK", "131. FC10557V SNR", "132. 260KBE030+L NSK",
  "133. 305KDH5004YGCS8SD NSK", "134. 4T-938/932CD+AC508 NTN", "135. 45T604411M-1H2 Koyo (JTEKT)",
  "136. EE420850/451D+LCA508 NSK", "137. STF400KDH6509GAS8S01 NSK", "138. M268730/M268710D+L NSK",
  "139. 175KBE3201+LC3 NSK", "140. EE130902/401CD+L NSK", "142. EE843220/843291CD+L NSK",
  "143. HH840249/HH840210DB+12.7CS300 NTN", "144. TDO071102/029108A1ZBB RKB",
  "145. HM231149G/111CDG+L02 NSK", "146. EE700090D/700167 NTN", "147. 4T-NA46790SW/46720CD NTN",
  "149. 4T-594/592D+A NTN", "150. TRB119244 NKE", "151. STF305KDH5004X2GAS01 NSK",
  "152. EE234156/216D+L NSK", "153. FC12180S02 SNR", "154. 4T-CRI0685 NTN",
  "155. 305KDH5501GBS8SA NSK", "156. EE161400/901D+L NSK", "157. 413040E1 NTN",
  "158. 46T604215-1FC3 Koyo (JTEKT)", "159. 46T343120-1FC3 Koyo (JTEKT)",
  "160. 46T080604-1LFTCS76 Koyo (JTEKT)", "161. FC12180.S04 SNR", "162. NA759SW/752D NTN",
  "163. M667947D/M667910W6G2+ NTN", "164. 300KDH4401FGAS8+KA01 NSK", "165. 4T-580/572D+ACS40 NTN",
  "166. 110KBE31+L NSK", "167. 150KBE2503E+LC3 NSK", "168. 280KBE030+L NSK",
  "169. NA95500/95927D NSK", "170. HM237545G/510DG+LC01 NSK", "171. 273KH3951-A-+KC3 NSK",
  "172. STF482KDH6501GAS8 NSK", "173. 4T-NA48291/48220D NTN", "174. 400KDH6505CGS8SBU1 NSK",
  "175. 95525/95927CD+L NSK", "176. STF365KDH5151GAS8 NSK", "177. 160KBE030+LC3 NSK",
  "178. FC12180.S04 CMB", "179. M249732/M249710CDXA ISB", "180. BT250-51DBC3 BTC",
  "181. E-38288 ISB", "182. DT458448DBG KBC", "183. FC12025 Top Machinery & Equipment",
  "184. BTH1024C Top Machinery & Equipment", "185. BTH1132B Top Machinery & Equipment",
  "186. 47KWD02AU42C-01LB Top Machinery & Equipment", "187. 516008 Top Machinery & Equipment",
  "188. 511795B FAG", "189. F-569763.TR2 FAG", "190. Z-548505.TR2S FAG", "191. Z-546363.TR2 FAG",
  "192. Z-539192.TR2 FAG", "193. TAROL90/154-R-TVP-M32AX FAG", "194. Z-546348.TR2 FAG",
  "195. Z-532950.TR2 FAG", "196. NA483SW/472D FAG", "197. Z-531590.TR2 FAG",
  "198. Z-531295.01.TR2 FAG", "199. Z-511992.TR2 FAG", "200. F-800912.TR2S-M15CE FAG",
  "201. Z-525858.TR2 FAG", "202. Z-544014B FAG", "203. 515135 FAG", "204. TAROL.6-1/2X9-U-JP FAG",
  "205. TAROL120/195-R-TVP FAG", "206. NA46790SW/46720D FAG", "207. 807284 FAG",
  "208. TAROL150/250-R-TVP-M32AX FAG", "209. Z-573513.TR2S FAG", "210. Z-547757.TR2 FAG",
  "211. 803722 FAG", "212. 531296A FAG", "213. Z-531296.01.TR2 FAG", "214. Z-531216.TR2-W209C FAG",
  "215. F-607332.TR2 FAG", "216. Z-575080.TR2 FAG", "217. Z-547099.TR2 FAG",
  "218. F-804108.01.TR2 FAG", "219. F-808453.TR2 FAG", "220. 800792E FAG", "221. Z-511994.TR2 FAG",
  "222. Z-543987.TR2 FAG", "223. Z-525090.TR2-H76-A200-250 FAG", "224. Z-515090.TR2-A230-280 FAG",
  "225. Z-514502.TR2 FAG", "226. 535083 FAG", "227. Z-531814.03.TR2 FAG", "228. Z-523280.TR2 FAG",
  "229. Z-517499.02.TR2 FAG", "230. 803194A FAG", "231. 515917 FAG", "232. 517563A FAG",
  "233. 539571 FAG", "234. 510961B FAG", "235. Z-517905.04.TAROL120/195-U-TVP FAG",
  "236. F-585081.03.TR2K-WPOS FAG", "237. Z-573517.02.TR2SK FAG", "238. Z-511989.TR2 FAG",
  "239. 512878 FAG", "240. 546238A FAG", "241. Z-515495.TR2 FAG", "242. F-614366.TR2 FAG",
  "243. Z-528841.TR2-OZWR-Q3-J26C-M13A FAG", "244. F-807327.01.TR2SK-J30PC FAG",
  "245. F-804108.TR2 FAG", "246. F-803422.TR2 FAG", "247. Z-564607.TR2S FAG",
  "248. Z-541397.TR2 FAG", "249. Z-511987.TR2 FAG", "250. Z-533433.TR2-H54 FAG",
  "251. Z-524241.TR2 FAG", "252. Z-521467.01.TR2 FAG", "253. F-804781.TR2SK-A490-550 FAG",
  "254. Z-531817.04.TR2-M15ID-M15IZ FAG"
];

function parseDoubleTaperedItem(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  if (cleanLine.includes("equivalent") || cleanLine.includes("File ")) return null;

  let brand = "FAG";
  if (cleanLine.includes("Koyo (JTEKT)")) {
    brand = "Koyo";
    cleanLine = cleanLine.replace("Koyo (JTEKT)", "").trim();
  } else if (cleanLine.includes("Top Machinery")) {
    brand = "Top Machinery";
    cleanLine = cleanLine.replace(/Top Machinery & Equipment|Top Machinery/g, "").trim();
  } else {
    let parts = cleanLine.split(/\s+/);
    let last = parts[parts.length - 1];
    const KNOWN_BRANDS = [
      "FAG", "Timken", "SKF", "Gamet", "NSK", "NTN", "SNR", "Nachi", "RKB", "NKE",
      "RIV", "CMB", "ISB", "BTC", "KBC", "Rollway", "Neutral"
    ];
    if (KNOWN_BRANDS.includes(last)) {
      brand = last;
      parts.pop();
      cleanLine = parts.join(' ').trim();
    }
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let bore = 110, od = 180, width = 85;
  let typeDesc = "Double Row Tapered Roller Bearing (TDO / TR2 / TAROL)";
  let seriesGroup = "Double Row Tapered Roller Bearing Series";

  if (partNumber.includes("TAROL")) {
    typeDesc = "Tapered Roller Railway Axlebox Bearing Unit (TAROL Series)";
    seriesGroup = "FAG TAROL Railway Axlebox Series";
    let tarolMatch = partNumber.match(/TAROL(\d{2,3})\/(\d{2,3})/);
    if (tarolMatch) {
      bore = parseInt(tarolMatch[1], 10);
      od = parseInt(tarolMatch[2], 10);
      width = Math.round(bore * 0.85);
    } else {
      bore = 130; od = 220; width = 115;
    }
  } else if (partNumber.includes("KBE") || partNumber.includes("KDH")) {
    let m = partNumber.match(/(\d{3})K(?:BE|DH)/);
    if (m) {
      bore = parseInt(m[1], 10);
      od = Math.round(bore * 1.55);
      width = Math.round(bore * 0.7);
    }
    typeDesc = "Heavy Duty Double Row Tapered Roller Bearing (KBE/KDH Series)";
    seriesGroup = "NSK KBE/KDH Heavy Series";
  } else if (brand === "Gamet") {
    typeDesc = "High Precision Machine Tool Spindle Double Tapered Roller Unit";
    seriesGroup = "Gamet Machine Tool Spindle Series";
    let gMatch = partNumber.match(/^(\d{3})(\d{3})/);
    if (gMatch) {
      bore = parseInt(gMatch[2], 10);
      od = Math.round(bore * 1.5);
      width = Math.round(bore * 0.55);
    }
  } else if (partNumber.includes("TR2") || partNumber.includes("TR1")) {
    bore = 140; od = 230; width = 95;
    typeDesc = "Double Row Tapered Roller Mill & Transmission Unit (FAG TR2 Series)";
    seriesGroup = "FAG TR2 Rolling Mill & Gearbox Series";
  }

  let estWeight = (Math.PI * (od*od - bore*bore) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 1.0) estWeight = "3.20";

  let dyn = Math.round(bore * width * 0.35);
  let stat = Math.round(dyn * 1.6);

  let price = Math.round(parseFloat(estWeight) * 2100 + 2800);

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-t2-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Double Row Tapered Roller Bearing ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Double Row",
    seriesGroup: seriesGroup,
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 15) + 5,
    weight: `${estWeight}kg`,
    innerDiameter: bore,
    outerDiameter: od,
    width: width,
    material: "High-Grade Case/Through-Hardened 100Cr6 Chrome Bearing Steel",
    sealType: partNumber.includes("TAROL") || partNumber.includes("BTH") || partNumber.includes("WPOS") ? "Integrated Contact Rubber Lip Seals (Pre-Lubricated)" : "Open (One Double Outer Cup / Two Single Cones)",
    cageType: "Solid Machined Steel / Heavy Gauge Pressed Window-Type Cage",
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(290000 / od)} RPM`,
    countryOfOrigin: brand === "Timken" ? "USA" : brand === "Gamet" ? "UK" : brand === "NSK" || brand === "NTN" || brand === "Koyo" || brand === "Nachi" ? "Japan" : brand === "SNR" ? "France" : brand === "RKB" ? "Switzerland" : "Germany",
    application: "Railway locomotive axleboxes, heavy steel & aluminum rolling mill roll necks, crane sheaves, high-load industrial gearboxes, CNC lathe spindles, off-highway vehicle planetary hubs",
    description: `Genuine ${brand} double row tapered roller bearing ${partNumber}. Pre-adjusted double outer cup (TDO arrangement) handling bidirectional axial thrust and heavy radial shock loads with high tilting stiffness.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/FAG|SKF|NSK/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber.replace(/FAG|Timken/g, ''), price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_DOUBLE_TAPERED.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseDoubleTaperedItem(line, idx)).filter(Boolean);
  console.log(`[Double Tapered Script] Parsed ${products.length} unique Tapered Roller Double Row Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Double Tapered Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Double Row to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Double Row"')) {
    dataContent = dataContent.replace(
      /"name": "Tapered Roller Bearing Single Row \(paired metric\)",\s*"id": "tapered-single-paired-metric"\s*},/,
      `"name": "Tapered Roller Bearing Single Row (paired metric)",\n        "id": "tapered-single-paired-metric"\n      },\n      {\n        "name": "Tapered Roller Double Row",\n        "id": "tapered-double"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Double Tapered Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Double Tapered Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Double Tapered Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Double Tapered Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Double Tapered Script] Connected to MongoDB Atlas.');

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
    console.log(`[Double Tapered Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalDoubleTapered = await Product.countDocuments({ category: "Tapered Roller Double Row" });
    console.log(`[Double Tapered Script] Current Database Totals: ${totalDoubleTapered} Tapered Roller Double Row Bearings.`);
  } catch (err) {
    console.error('[Double Tapered Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Double Tapered Script] Done.');
  }
}

main();
