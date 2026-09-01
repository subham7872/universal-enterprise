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

const RAW_LINES = [
  "1. HF3020-L564 INA", "2. K20X26X12-B/-2-4 INA", "3. NKXR40-XL INA", "4. ZARN50110-L-TV-A INA",
  "5. F-50463 INA", "6. NA4912-XL-C3 INA", "7. IR40X45X20,5-EGS INA", "8. RPNA35/52-XL INA",
  "9. NX25-Z-XL INA", "10. IR25X30X38,5-EGS INA", "11. IR110X125X40-EGS INA", "12. HK3516-AS1-B INA",
  "13. RNA6907-ZW-XL INA", "14. RNA4902-2RSR-XL INA", "15. NA4926-XL INA", "16. HFL1226-L564 INA",
  "17. NA6910-ZW-XL INA", "18. IR35X42X21-IS1-OF INA", "19. HK5520-HLA INA", "20. HK4020-2RS-A-L271 INA",
  "21. HK2816-B INA", "22. BK5020 INA", "23. HK1014-2RS-FPM-B-L271 INA", "24. HK1216-2RS-AS1-L271 INA",
  "25. NKI85/26-XL INA", "26. RNAO30X42X32 INA", "27. K305X325X55 INA", "28. HK0408 INA",
  "29. SCH1616 INA", "30. SCH2020 INA", "31. SCE86 INA", "32. NA6901 INA", "33. LR10X13X12,5 INA",
  "34. RNAO40X50X34 INA", "35. NKI45/35 INA", "36. NK70/35 INA", "37. NK5/12TN INA", "38. NK28/30 INA",
  "39. K8X11X8-TV/-2-4 INA", "40. K80X88X30-B/-2-4 INA", "41. K7X10X10-TV/-4-6 INA", "42. K47X52X27/-2-4 INA",
  "43. K38X46X20-B/-2-4 INA", "44. K24X30X17-A/-2-4 INA", "45. K22X26X13-A/-1-3 INA", "46. K17X21X17-A/-5-7 INA",
  "47. K17X21X10-A/-2-4 INA", "48. K170X180X46/-2-4 INA", "49. K16X22X16-A/-4-6 INA", "50. IR90X100X30-VGS INA",
  "51. IR60X68X25-VGS INA", "52. HN2820 INA", "53. HK1210-B-L285 INA", "54. IR85X100X35-EGS INA",
  "55. IR70X80X25-EGS INA", "56. ZARN70130-L-TV-A INA", "57. ZARN4090-L-TV-A INA", "58. IR50X58X22-EGS INA",
  "59. S1112-AS1 INA", "60. K75X83X23-A-3-5 INA", "61. LR40X45X20,5 INA", "62. LR25X30X12,5 INA",
  "63. LR20X25X16,5 INA", "64. IR20X24X20 INA", "65. NKJ70/35ASR1 FAG", "66. RNA4906A.RS FAG",
  "67. K40X45X13F FAG", "68. K24X30X17FVH86 FAG", "69. K3X6X7-TV/-2-4 INA", "70. K25X30X20-B-3-5 INA",
  "71. K55X63X32-A-0-2 INA", "72. BF3020X105-4-6 INA", "73. BF5023X75/-5-7 INA", "74. H10X43 INA",
  "75. K48X54X19/-4-6 INA", "76. ZARF45105TN INA", "77. K42X47X13-A-2-4 INA", "78. K21X25X17-D-A/-5-7 INA",
  "79. K12X18X12-TV/-5-7 INA", "80. K42X47X30-ZW-A/-2-4 INA", "81. K26X30X17-A/-2-4 INA", "82. K3X5X9-TV/-2-4 INA",
  "83. K110X118X30/-3-5 INA", "84. K110X118X30/-1-3 INA", "85. K68X74X30-H-B/0-2 INA", "86. NK19/20C3 INA",
  "87. K95X102X31 INA", "88. BBUB3652-P-B INA", "89. K35X40X30-ZW-A-5-7 INA", "90. K115X123X27-A/-3-5 INA",
  "91. K32X38X20A-1-3 INA", "92. K50X58X20B-2-4 INA", "93. K95X103X40-ZW-A/-2-4 INA", "94. K18X25X22-B/-5-7 INA",
  "95. K58X63X17/0-2 INA", "96. K55X60X27-B-5-7 INA", "97. K43X48X17-B/-3-5 INA", "98. K28X40X18/-4-6 INA",
  "99. K70X78X23-TV/3-5 INA", "100. K28X33X27TN- 2-4 INA", "101. BF5023X1003 INA",
  "102. HMTR24X69,5X26-ISR2-2RS INA", "103. K21X25X13-D-A/-1-3 INA", "104. BF3020X1005 INA",
  "105. K15X21X21-A/0-2 INA", "106. K38X46X32-A/-4-6 INA", "107. K55X62X30 INA", "108. NA6906-IS1-XL INA",
  "109. K35X45X49/0-2 INA", "110. IR35X42X20-XL INA", "111. NA6918-ZW-H-S3-XL-R200-250 INA",
  "112. BF3020X2001-4-6 INA", "113. K155X163X26-A-3-5 INA", "114. K47X52X17-B-1-3 INA",
  "115. K22X28X17-A/-1-3 INA", "116. K165X173X26-A/0-2 INA", "117. ZARN3570-L-TV-A INA",
  "118. RNAO22X30X26 INA", "119. NKS25-XL INA", "120. NKI75/35-XL-C3 INA", "121. NA4906-XL-C2 INA",
  "122. K25X32X24F.VZ55 FAG", "123. KBK12X15X17,5/-4-6 INA", "124. IR65X73X25-XL INA",
  "125. IR50X60X25-XL INA", "126. IR50X58X22-XL INA", "127. IR50X55X25-XL INA", "128. IR45X52X40-XL INA",
  "129. IR40X45X30-XL INA", "130. IR15X19X16-XL INA", "131. IR12X16X16-XL INA", "132. IR12X15X22,5-XL INA",
  "133. K50X55X13,5-B/-4-6 INA", "134. NA6903-XL-C3 INA", "135. K55X60X30-B/-2-4 INA", "136. PI101414 INA",
  "137. RNA49/32-S INA", "138. NK12/12-OS-XL INA", "139. NA4830-XL-C3 INA", "140. K6X10X13-TV/0-2 INA",
  "141. K25X32X16-B/-3-5 INA", "142. K25X31X21-B/0-2 INA", "143. HFL0615-KF-R-L564 INA",
  "144. IR130X145X35-EGS INA", "145. NKIS25-XL INA", "146. NKIA5904-XL INA", "147. IR300X330X80-EGS INA",
  "148. ZARF40115-L-TV-A INA", "149. NKI7/16-TV-XL INA", "150. ZARF2068-L-TV-A INA", "151. NKI9/16TN INA",
  "152. HK1012-B-L271 INA", "153. K15X19X17-A/-1-3 INA", "154. K60X68X23-A/-4-6 INA", "155. BK1514-RS-L271 INA",
  "156. NA4900-XL-C3 INA", "157. NK8/12-TV-XL INA", "158. NK7/12-TV-XL INA", "159. NK105/26-XL INA",
  "160. NA4836-XL INA", "161. IR70X80X54-EGS INA", "162. IR30X35X17-EGS INA", "163. NX30-Z-XL INA",
  "164. RNA4911-XL INA", "165. NKXR35-A INA", "166. NKIA5901C2 INA", "167. NK60/35-XL INA",
  "168. K24X28X10-A/0-7 INA", "169. IR260X285X60-EGS INA", "170. NK18/16-XL INA", "171. NKI32/20-XL INA",
  "172. NA4908-XL-C3 INA", "173. SCE2824AS1 INA", "174. NK45/20-TV-XL INA", "175. RNA6906-XL INA",
  "176. NA4909-2RSR-XL INA", "177. HK2010-B INA", "178. HFL1826-L564 INA", "179. NK40/30-XL INA",
  "180. RNA4909-XL INA", "181. RNA4903-XL INA", "182. NA4900-XL INA", "183. K15X21X15-A/0-7 INA",
  "184. HK2516-B INA", "185. HK2020-B INA", "186. HK0810-B INA", "187. NKIS120 INA",
  "188. IR10X14X16 INA", "189. NAO12X24X13 INA", "190. RNAO50X62X20 INA", "191. SCE78 INA",
  "192. IR25X32X22 INA", "193. NKI5/16TN INA", "194. NKI45/25 INA", "195. HK0608 INA",
  "196. NKIB5914 INA", "197. SCE47 INA", "198. IR35X42X21 INA", "199. K30X40X30-A/-2-4 INA",
  "200. NKJ38/20A FAG", "201. SC146 FAG", "202. HK2218-RS-L271 INA", "203. K35X45X30/-3-5 INA",
  "204. K8X11X8-TV/0-2 INA", "205. K15X19X17-A/-2-4 INA", "206. RNA6906-XL-H+33+25 INA",
  "207. ZARN2557-L-TV-A INA", "208. F-90591 INA", "209. RNA4844-XL INA", "210. ZARN2572-L-TV-A INA",
  "211. NKI85/36-XL-C3 INA", "212. NKXR17-Z-XL INA", "213. NKXR15-XL INA", "214. RNA6909-ZW-XL INA",
  "215. RNA4903-2RSR-XL INA", "216. HK1814-RS-L271 INA", "217. HK1516-AS1-B INA", "218. HK1414-RS-L271 INA"
];

function parseNeedleItem(line) {
  // e.g. "1. HF3020-L564 INA" or "65. NKJ70/35ASR1 FAG"
  let cleanLine = line.replace(/^\d+[\.\s]+/, '').trim();
  let parts = cleanLine.split(/\s+/);
  let brand = parts.pop().toUpperCase(); // "INA" or "FAG"
  let partNumber = parts.join(' ');

  let cleanPart = partNumber.replace(/,/g, '.');

  // Dimensions estimation
  let id = 25, od = 32, width = 16;
  let typeDesc = "Needle Roller and Cage Assembly";

  // Check K (radial needle roller and cage assembly) e.g. K20X26X12
  let kMatch = cleanPart.match(/K(\d+)X(\d+)X([\d\.]+)/);
  let irMatch = cleanPart.match(/IR(\d+)X(\d+)X([\d\.]+)/);
  let lrMatch = cleanPart.match(/LR(\d+)X(\d+)X([\d\.]+)/);
  let rnaoMatch = cleanPart.match(/RNAO(\d+)X(\d+)X([\d\.]+)/);
  let naMatch = cleanPart.match(/NA(\d{4})/);
  let rnaMatch = cleanPart.match(/RNA(\d{4})/);
  let hkMatch = cleanPart.match(/HK(\d{2})(\d{2})/);
  let bkMatch = cleanPart.match(/BK(\d{2})(\d{2})/);
  let hfMatch = cleanPart.match(/HF(\d{2})(\d{2})/);
  let hflMatch = cleanPart.match(/HFL(\d{2})(\d{2})/);
  let zarnMatch = cleanPart.match(/ZARN(\d{2})(\d{2,3})/);
  let zarfMatch = cleanPart.match(/ZARF(\d{2})(\d{2,3})/);
  let nkMatch = cleanPart.match(/NK(\d+)\/(\d+)/);
  let nkiMatch = cleanPart.match(/NKI(\d+)\/(\d+)/);

  if (kMatch) {
    id = parseFloat(kMatch[1]);
    od = parseFloat(kMatch[2]);
    width = parseFloat(kMatch[3]);
    typeDesc = "Radial Needle Roller and Cage Assembly (K-Series)";
  } else if (irMatch) {
    id = parseFloat(irMatch[1]);
    od = parseFloat(irMatch[2]);
    width = parseFloat(irMatch[3]);
    typeDesc = "Precision Needle Bearing Inner Ring (IR-Series)";
  } else if (lrMatch) {
    id = parseFloat(lrMatch[1]);
    od = parseFloat(lrMatch[2]);
    width = parseFloat(lrMatch[3]);
    typeDesc = "Machined Inner Ring Ground (LR-Series)";
  } else if (rnaoMatch) {
    id = parseFloat(rnaoMatch[1]);
    od = parseFloat(rnaoMatch[2]);
    width = parseFloat(rnaoMatch[3]);
    typeDesc = "Needle Roller Bearing Without Ribs (RNAO-Series)";
  } else if (hkMatch) {
    id = parseInt(hkMatch[1], 10);
    width = parseInt(hkMatch[2], 10);
    od = id + (id < 20 ? 6 : id < 40 ? 7 : 8);
    typeDesc = "Drawn Cup Needle Roller Bearing with Open Ends (HK-Series)";
  } else if (bkMatch) {
    id = parseInt(bkMatch[1], 10);
    width = parseInt(bkMatch[2], 10);
    od = id + 8;
    typeDesc = "Drawn Cup Needle Roller Bearing with Closed End (BK-Series)";
  } else if (hfMatch || hflMatch) {
    let m = hfMatch || hflMatch;
    id = parseInt(m[1], 10);
    width = parseInt(m[2], 10);
    od = id + 7;
    typeDesc = "Drawn Cup Roller Clutch / Bearing Assembly (HF/HFL-Series)";
  } else if (zarnMatch || zarfMatch) {
    let m = zarnMatch || zarfMatch;
    id = parseInt(m[1], 10);
    od = parseInt(m[2], 10);
    width = Math.round(id * 1.1);
    typeDesc = "Combined Needle Roller / Axial Cylindrical Roller Bearing (ZARN/ZARF)";
  } else if (nkMatch || nkiMatch) {
    let m = nkMatch || nkiMatch;
    id = parseInt(m[1], 10);
    width = parseInt(m[2], 10);
    od = id + (id < 30 ? 8 : 12);
    typeDesc = "Heavy Duty Needle Roller Bearing (NK/NKI-Series)";
  } else if (naMatch || rnaMatch) {
    let code = (naMatch || rnaMatch)[1];
    let bCode = parseInt(code.substring(2), 10);
    id = bCode * 5;
    if (bCode === 0) id = 10;
    if (bCode === 1) id = 12;
    if (bCode === 2) id = 15;
    if (bCode === 3) id = 17;
    od = id + 15;
    width = 16;
    typeDesc = "Machined Needle Roller Bearing with Ribs (NA/RNA-Series)";
  }

  // Cage type
  let cage = "Pressed Steel / Polyamide";
  if (cleanPart.includes("TV") || cleanPart.includes("TN")) cage = "Glass Fibre Reinforced Polyamide (TV/TN)";
  else if (cleanPart.includes("-M") || cleanPart.includes(".M") || cleanPart.includes("MB")) cage = "Machined Solid Brass (M/MB)";
  else if (cleanPart.includes("-B") || cleanPart.includes("-A")) cage = "Sheet Steel Precision Window Cage";

  let estWeight = (Math.PI * (od*od - id*id) * width * 7.85 / (4 * 1000000)).toFixed(2);
  if (parseFloat(estWeight) < 0.01) estWeight = "0.02";

  let dyn = Math.round(id * width * 0.09);
  if (dyn < 2) dyn = 2;
  let stat = Math.round(dyn * 1.4);

  let price = Math.round(parseFloat(estWeight) * 2200 + 450);
  if (price < 380) price = 380;
  if (cleanPart.includes("ZARN") || cleanPart.includes("ZARF")) price = Math.round(price * 2.5 + 4500);

  let cleanId = `${brand.toLowerCase()}-${cleanPart.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return {
    id: cleanId,
    partNumber: cleanPart,
    name: `${brand} ${typeDesc} ${cleanPart}`,
    brand: brand,
    category: "Needle Roller And Cage Assemblies",
    seriesGroup: "Needle Roller Series",
    price: price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: Math.floor(Math.random() * 40) + 15,
    weight: `${estWeight}kg`,
    innerDiameter: id,
    outerDiameter: od,
    width: width,
    material: "High-Carbon 100Cr6 Chrome Bearing Steel (INA/FAG Quality)",
    sealType: cleanPart.includes("2RS") || cleanPart.includes("2RSR") || cleanPart.includes(".RS") ? "Lip Contact Rubber Seals (2RS)" : "Open",
    cageType: cage,
    loadRating: `Dynamic: ${dyn} kN, Static: ${stat} kN`,
    speedRating: `${Math.round(380000 / od)} RPM`,
    countryOfOrigin: "Germany",
    application: "Planetary gearboxes, machine tool spindles, automotive transmissions, robotics, packaging automation, hydraulic pumps",
    description: `Genuine ${brand} Schaeffler precision needle roller and cage assembly ${cleanPart}. Compact cross-section engineered for maximum radial load carrying capacity with high rotational speed capability.`,
    equivalentProducts: [
      { brand: "SKF", partNumber: cleanPart.replace(/-XL|-EGS|-VGS|-HLA|-L564|-L271/g, ''), price: Math.round(price * 1.08) },
      { brand: "IKO", partNumber: cleanPart.replace(/K/g, 'KT ').replace(/HK/g, 'TA ').replace(/-XL/g, ''), price: Math.round(price * 1.02) }
    ]
  };
}

async function main() {
  const products = RAW_LINES.map(line => parseNeedleItem(line));
  console.log(`[Needle Script] Parsed ${products.length} Needle Roller & Cage Bearings.`);

  const brandsCount = {};
  products.forEach(p => {
    brandsCount[p.brand] = (brandsCount[p.brand] || 0) + 1;
  });
  console.log('[Needle Script] Brand Breakdown:', brandsCount);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const toAdd = products.filter(p => !dataContent.includes(`"partNumber": "${p.partNumber}"`));
  console.log(`[Needle Script] ${toAdd.length} new products to append to backend/data/bearingsData.js`);

  if (toAdd.length > 0) {
    const productsString = toAdd.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Needle Script] Updated backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and Upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Needle Script Warning] MONGODB_URI not found in .env');
    return;
  }

  try {
    console.log('[Needle Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Needle Script] Connected to MongoDB Atlas.');

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
    console.log(`[Needle Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalINA = await Product.countDocuments({ brand: "INA" });
    const totalNeedleCage = await Product.countDocuments({ category: "Needle Roller And Cage Assemblies" });
    console.log(`[Needle Script] Current Database Totals: ${totalINA} INA bearings | ${totalNeedleCage} Needle Roller And Cage Assemblies.`);
  } catch (err) {
    console.error('[Needle Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Needle Script] Done.');
  }
}

main();
