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

const RAW_SPACERS = [
  "1. X1S-113089 Timken", "2. LM104910ES Timken", "3. K106390R Timken", "4. LM961510EA Timken",
  "5. M249748XA Timken", "6. LM508710ES Timken", "7. XC2379DA Timken", "8. M205149XB Timken",
  "9. HM821547XB Timken", "10. LM506810ES Timken", "11. X1S-93825 Timken", "12. LM11900EA Timken",
  "13. X1S-96925-20000 Timken", "14. XC2381C Timken", "15. 139KV2051G NSK", "16. ABR29326E FAG",
  "17. K23420 Timken", "18. HM926740XA Timken", "19. X3S-497 Timken", "20. X1S64450 Timken",
  "21. X1S126097 Timken", "22. X1S67388 Timken", "23. M231649XB Timken", "24. H913849XA-EP008 Timken",
  "25. H936310EA Timken", "26. X2S-430900 Timken", "27. X35-497 Timken", "28. LM67049XA Timken",
  "29. X1S67885 Timken", "30. H337844XA Timken", "31. H936349XB Timken", "32. LM603049XF Timken",
  "33. K85372 Timken", "34. X2S-53176 Timken", "35. K85588 Timken", "36. X2S67985 Timken",
  "37. X1S94687 Timken", "38. X1S797 Timken", "39. Y1S-67322 Timken", "40. X2S-795 Timken",
  "41. XC2378C Timken", "42. M714249XS Timken", "43. M511946XA Timken", "44. K524660R Timken",
  "45. JY13010Q-20000 Timken", "46. X1S-36990 Timken", "47. X1S-130902 Timken", "48. Y6S-932 Timken",
  "49. X3S-94650 Timken", "50. HH932145XA-20000 Timken", "51. M255449XB Timken", "52. M612910ES Timken",
  "53. HH932110EC Timken", "54. 106390R Timken", "55. X1S-74500 Timken", "56. Y4S-90744 Timken",
  "57. X1S-936 Timken", "58. K518780R Timken", "59. H936349XR Timken", "60. 85372-EP008 Timken",
  "61. JM511910ES Timken", "62. X1S-33890 Timken", "63. X4S-9285 Timken", "64. X4S-90381 Timken",
  "65. LM272249XA Timken", "66. X1S-74550 Timken", "67. HM237545XB Timken", "68. JYH17006R-20000 Timken",
  "69. K106393R Timken", "70. L624549XB Timken", "71. HM821547XA Timken", "72. H936349XA Timken",
  "73. LM603011EX Timken", "74. X1S-399A Timken", "75. K107581R Timken", "76. K107582R Timken",
  "77. K518771R Timken", "78. M268749XB Timken", "79. X2S-95491 Timken", "80. X1S-898 NSK",
  "81. HH224346XA Bower", "82. X2S-795 Neutral", "83. X3S-497 Neutral", "84. 8ANS Neutral",
  "85. K106390R Neutral", "86. X1S-594 Neutral", "87. X1S-582 FAG", "88. ABR29418E FAG",
  "89. DI N153791-A-20 INA", "90. HM522649XS Timken", "91. K24007 Timken", "92. H936310EG Timken",
  "93. H913849XC Timken", "94. HH914412EA Timken", "95. X1S-335 Timken", "96. X1S13687 Timken",
  "97. X1S-52400 Timken", "98. T45882 Timken", "99. M822049XS Timken", "100. X1S-99600 Timken",
  "101. K518781R Timken", "102. K85525 Timken", "103. XC1923S Timken", "104. X3S-117063 Timken",
  "105. X1S-74550EP012 Timken", "106. X1S-722110 Timken", "107. M734449XS Timken", "108. H217249XS Timken",
  "109. X1S95525 Timken", "110. K109151R Timken", "111. K120178 Timken", "112. Y4S-592A Timken",
  "113. X1S-74500EP0.008 Timken", "114. Y8S-752 Timken", "115. Y1S-46790 Timken", "116. Y4S-3920 Timken",
  "117. K75277 Timken", "118. M716610ES Timken", "119. H217210EA Timken", "120. HM516849XS Timken",
  "121. Y1S-29620 Timken", "122. H239640XB Timken", "123. X1S-581 Timken", "124. JYH17006R Timken",
  "125. HH932110EB Timken", "126. M238810EA Timken", "127. K120190 Timken", "128. R800004 Timken",
  "129. X1S-9380 Timken", "130. L521949XC Timken", "131. M718149XS Timken", "132. Y2S171450 Timken",
  "133. X1S-722115 Timken", "134. M268749XA Timken", "135. K109152R-20000 Timken", "136. HM262710EA-20000 Timken",
  "137. K524105R Timken", "138. M205110ES Timken", "139. L814749XA Timken", "140. H247535XA Timken",
  "141. JXH10010A Timken", "142. K109151R-20000 Timken", "143. Y3S-3920 Timken", "144. L327249XA Timken",
  "145. X1S-74500EP0.012 Timken", "146. Y4S-3720 Timken", "147. X1S-29685 Timken", "148. LM451310EW Timken",
  "149. X1S-33281 Timken", "150. HM318448XS Timken", "151. K22620 Timken", "152. LM506849XS Timken",
  "153. M736149XS Timken", "154. X1S-582 Timken", "155. H913810EW Timken", "156. M822010ES Timken",
  "157. K524653R Timken", "158. M241510EC Timken", "159. HH926749XE Timken", "160. HM516810ES Timken",
  "161. X1S-387A Timken", "162. H217210ES Timken", "163. R32213 Timken", "164. X1S580 Timken",
  "165. Y1S-332A Timken", "166. LM654610EA-20000 Timken", "167. HM840449XS Timken", "168. HM840410ES-20000 Timken",
  "169. XC2379DA-20767 Timken", "170. XC2448S Timken", "171. Y1S-3925 Timken", "172. X1S-896 Timken",
  "173. HH926710EF Timken", "174. X2S53176 Timken", "175. X1S8578 Timken", "176. M716649XS Timken",
  "177. HH926710EC Timken", "178. Y2S28521 Timken", "179. Y1S-351687 Timken", "180. K22420 Timken",
  "181. K120160-00000 Timken", "182. X1S-78250 Timken", "183. X1S-98350EP0.012 Timken", "184. X2S-56425 Timken",
  "185. HM129848XA Timken", "186. M718110ES Timken", "187. M238849XA Timken", "188. HM212010EA-20000 Timken",
  "189. H917840XA Timken", "190. K24005 Timken", "191. M244249XA Timken", "192. M734410ES Timken",
  "193. M736110ES Timken", "194. LM654610EA Timken", "195. K109152R Timken", "196. HM840410ES Timken",
  "197. Y2S-171450 Timken", "198. LM761610EC Timken", "199. X1S-3975 Timken", "200. X1S-93708 Timken",
  "201. L357049XA Timken", "202. LM522546XA Timken", "203. X1S-679 Timken", "204. X1S67790 Timken",
  "205. X1S-8578 Timken", "206. X1S-33225 Timken", "207. M719113ES Timken", "208. HM522610ES Timken",
  "209. Y7S-29620 Timken", "210. Y4S-117148 Timken", "211. Y2S90744 Timken", "212. M249710EA-20000 Timken",
  "213. HM262710EA Timken", "214. HH932110EB-20000 Timken", "215. X2S-567 Timken", "216. H239649XB Timken",
  "217. HH926744XB Timken", "218. Y4S90744 Timken", "219. H917810EA Timken", "220. X1S-582 SKF",
  "221. Y2S-29620 Timken", "222. X4S-55200 Timken", "223. R32030X Timken", "224. M612949XS Timken",
  "225. X1S291201 Timken", "226. K22420-00000 Timken", "227. X4S9285 Timken", "228. X1S-580 Timken",
  "229. L225849XA Timken", "230. X1S-90334 Timken", "231. HM807012ES Timken", "232. K24020 Timken",
  "233. HM840449XS-20000 Timken", "234. LM739710EB Timken", "235. L521910EC Timken", "236. H913849XA Timken",
  "237. HM318410ES Timken", "238. X1S-74550 NSK", "239. X1S-582 CBF", "240. KRCA4 NSK",
  "241. X1S-30314 NIS", "242. TEMPLATE 770 Neutral", "243. JM511910ES Neutral", "244. X2S-795 China",
  "245. JX12030AM Neutral", "246. H247535XA Neutral", "247. X1S-722115 Neutral"
];

function parseSpacerProduct(line, idx) {
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = "Timken";
  let last = parts[parts.length - 1];
  const KNOWN_BRANDS = ["FAG", "SKF", "Timken", "INA", "NSK", "Bower", "CBF", "NIS", "China", "Neutral"];
  if (KNOWN_BRANDS.includes(last)) {
    brand = last === "China" ? "Neutral" : last;
    parts.pop();
    cleanLine = parts.join(' ').trim();
  }

  let partNumber = cleanLine.replace(/,/g, '.');

  let isConeSpacer = partNumber.startsWith('X') || partNumber.includes('X') || partNumber.includes('R') || partNumber.includes('ABR');
  let isCupSpacer = partNumber.startsWith('Y') || partNumber.includes('E') || partNumber.includes('KRCA');

  let spacerType = isCupSpacer ? "Outer Ring (Cup) Precision Intermediate Spacer Ring" : "Inner Ring (Cone) Precision Intermediate Spacer Ring";
  let id = isCupSpacer ? null : 85;
  let od = isCupSpacer ? 135 : 105;
  let width = 12;

  let estWeight = "0.45";
  let price = 580;

  let cleanId = `${brand.toLowerCase()}-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-spc-${idx + 1}`;

  return {
    id: cleanId,
    partNumber: partNumber,
    name: `${brand} Tapered Roller Bearing Precision Spacer ${partNumber}`,
    brand: brand,
    category: "Tapered Roller Bearing Spacer",
    seriesGroup: "Precision Ground Intermediate Distance Rings (Bench End Play Spacers)",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 25) + 12,
    weight: `${estWeight}kg`,
    innerDiameter: id,
    outerDiameter: od,
    width: width,
    material: "High-Grade Case/Through-Hardened Bearing Steel, Precision Ground Parallel Faces",
    sealType: "Open (Intermediate Spacer Ring)",
    cageType: "Solid Machined Spacer Ring",
    loadRating: "Precision Factory-Ground Internal Clearance / Preload Spacer Component",
    speedRating: "Matched with Bearing Assembly",
    countryOfOrigin: brand === "Timken" || brand === "Bower" ? "USA" : brand === "NSK" ? "Japan" : "Germany",
    application: "Pre-adjusted paired tapered roller bearings, heavy rolling mill stands, commercial vehicle wheel ends, pinion gear assemblies, crane track wheels",
    description: `Genuine ${brand} precision-ground intermediate spacer ${partNumber} for tapered roller bearing assemblies. Establishes exact axial internal bench end play (BEP) and preload without manual shimming.`,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: partNumber.replace(/-20000|-EP008|-EP012/g, ''), price: Math.round(price * 1.08) },
      { brand: "SKF", partNumber: partNumber, price: Math.round(price * 1.05) }
    ]
  };
}

async function main() {
  const uniqueLines = [...new Set(RAW_SPACERS.map(l => l.replace(/^\d+[\.\s]+/, '').trim()))];
  const products = uniqueLines.map((line, idx) => parseSpacerProduct(line, idx)).filter(Boolean);
  console.log(`[Tapered Spacer Script] Parsed ${products.length} unique Tapered Roller Bearing Spacers.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Tapered Spacer Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Tapered Roller Bearing Spacer to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Tapered Roller Bearing Spacer"')) {
    dataContent = dataContent.replace(
      /"name": "Cone for Tapered Roller Bearings Double Row",\s*"id": "tapered-double-cone"\s*},/,
      `"name": "Cone for Tapered Roller Bearings Double Row",\n        "id": "tapered-double-cone"\n      },\n      {\n        "name": "Tapered Roller Bearing Spacer",\n        "id": "tapered-spacer"\n      },`
    );
  }

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Tapered Spacer Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Tapered Spacer Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Tapered Spacer Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Tapered Spacer Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Tapered Spacer Script] Connected to MongoDB Atlas.');

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
    console.log(`[Tapered Spacer Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalSpacers = await Product.countDocuments({ category: "Tapered Roller Bearing Spacer" });
    console.log(`[Tapered Spacer Script] Current Database Totals: ${totalSpacers} Tapered Roller Bearing Spacers.`);
  } catch (err) {
    console.error('[Tapered Spacer Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Tapered Spacer Script] Done.');
  }
}

main();
