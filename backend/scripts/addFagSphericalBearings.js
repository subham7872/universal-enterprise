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

export const FAG_SPHERICAL_PRODUCTS = [
  {
    partNumber: "24134-BE-XL-K30",
    name: "FAG Spherical Roller Bearing 24134-BE-XL-K30",
    seriesGroup: "24100 Series",
    innerDiameter: 170,
    outerDiameter: 280,
    width: 109,
    weight: "26.5kg",
    boreType: "Tapered 1:30 (K30)",
    cageType: "Sheet Steel / Solid Brass (BE-XL)",
    clearance: "Normal",
    loadRating: "Dynamic: 1320 kN, Static: 1800 kN",
    speedRating: "1,600 RPM",
    price: 34500,
    stockCount: 15,
    equivalentProducts: [
      { brand: "SKF", partNumber: "24134 CCK30/W33", price: 38200 },
      { brand: "NTN", partNumber: "24134BK30D1", price: 35800 }
    ]
  },
  {
    partNumber: "24128-BE-XL-K30-C3",
    name: "FAG Spherical Roller Bearing 24128-BE-XL-K30-C3",
    seriesGroup: "24100 Series",
    innerDiameter: 140,
    outerDiameter: 225,
    width: 85,
    weight: "13.2kg",
    boreType: "Tapered 1:30 (K30)",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "C3 (Greater than Normal)",
    loadRating: "Dynamic: 850 kN, Static: 1180 kN",
    speedRating: "2,000 RPM",
    price: 22800,
    stockCount: 22,
    equivalentProducts: [
      { brand: "SKF", partNumber: "24128 CCK30/W33/C3", price: 25400 },
      { brand: "NSK", partNumber: "24128 CAMKE4C3", price: 23600 }
    ]
  },
  {
    partNumber: "23136-E1-XL-TVPB",
    name: "FAG Spherical Roller Bearing 23136-E1-XL-TVPB",
    seriesGroup: "23100 Series",
    innerDiameter: 180,
    outerDiameter: 300,
    width: 96,
    weight: "26.8kg",
    boreType: "Cylindrical",
    cageType: "Glass Fibre Reinforced Polyamide (TVPB)",
    clearance: "Normal",
    loadRating: "Dynamic: 1290 kN, Static: 1700 kN",
    speedRating: "1,500 RPM",
    price: 36200,
    stockCount: 18,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23136 CC/W33", price: 39500 },
      { brand: "TIMKEN", partNumber: "23136 YM", price: 37800 }
    ]
  },
  {
    partNumber: "23132-E1-XL-TVPB-C4",
    name: "FAG Spherical Roller Bearing 23132-E1-XL-TVPB-C4",
    seriesGroup: "23100 Series",
    innerDiameter: 160,
    outerDiameter: 270,
    width: 86,
    weight: "19.3kg",
    boreType: "Cylindrical",
    cageType: "Polyamide Cage (TVPB)",
    clearance: "C4 (Radial Clearance Greater than C3)",
    loadRating: "Dynamic: 1040 kN, Static: 1370 kN",
    speedRating: "1,700 RPM",
    price: 28400,
    stockCount: 20,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23132 CC/C4W33", price: 31200 },
      { brand: "NTN", partNumber: "23132BC4D1", price: 29000 }
    ]
  },
  {
    partNumber: "23130-E1A-XL-M-C4",
    name: "FAG Spherical Roller Bearing 23130-E1A-XL-M-C4",
    seriesGroup: "23100 Series",
    innerDiameter: 150,
    outerDiameter: 250,
    width: 80,
    weight: "15.2kg",
    boreType: "Cylindrical",
    cageType: "Machined Solid Brass Cage (M)",
    clearance: "C4",
    loadRating: "Dynamic: 890 kN, Static: 1200 kN",
    speedRating: "2,000 RPM",
    price: 24600,
    stockCount: 25,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23130 CC/C4W33", price: 27000 },
      { brand: "NSK", partNumber: "23130 CAMC4", price: 25200 }
    ]
  },
  {
    partNumber: "23130-E1A-XL-K-M",
    name: "FAG Spherical Roller Bearing 23130-E1A-XL-K-M",
    seriesGroup: "23100 Series",
    innerDiameter: 150,
    outerDiameter: 250,
    width: 80,
    weight: "14.9kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass Cage (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 890 kN, Static: 1200 kN",
    speedRating: "2,000 RPM",
    price: 23900,
    stockCount: 30,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23130 CCK/W33", price: 26500 },
      { brand: "NTN", partNumber: "23130BKD1", price: 24500 }
    ]
  },
  {
    partNumber: "23128-E1-XL-K-TVPB",
    name: "FAG Spherical Roller Bearing 23128-E1-XL-K-TVPB",
    seriesGroup: "23100 Series",
    innerDiameter: 140,
    outerDiameter: 225,
    width: 68,
    weight: "10.4kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Polyamide (TVPB)",
    clearance: "Normal",
    loadRating: "Dynamic: 735 kN, Static: 980 kN",
    speedRating: "2,200 RPM",
    price: 19800,
    stockCount: 28,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23128 CCK/W33", price: 21900 },
      { brand: "NSK", partNumber: "23128 CAMKE4", price: 20400 }
    ]
  },
  {
    partNumber: "23122-E1-XL-K-TVPB",
    name: "FAG Spherical Roller Bearing 23122-E1-XL-K-TVPB",
    seriesGroup: "23100 Series",
    innerDiameter: 110,
    outerDiameter: 180,
    width: 56,
    weight: "5.4kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Polyamide (TVPB)",
    clearance: "Normal",
    loadRating: "Dynamic: 485 kN, Static: 620 kN",
    speedRating: "2,800 RPM",
    price: 12500,
    stockCount: 40,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23122 CCK/W33", price: 13900 },
      { brand: "TIMKEN", partNumber: "23122 K", price: 13100 }
    ]
  },
  {
    partNumber: "23056-BE-XL-K-C4",
    name: "FAG Spherical Roller Bearing 23056-BE-XL-K-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 280,
    outerDiameter: 420,
    width: 106,
    weight: "46.5kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "C4",
    loadRating: "Dynamic: 1730 kN, Static: 2750 kN",
    speedRating: "1,100 RPM",
    price: 78500,
    stockCount: 8,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23056 CCK/C4W33", price: 86000 },
      { brand: "NTN", partNumber: "23056BKC4D1", price: 81000 }
    ]
  },
  {
    partNumber: "23056-BE-XL-C4",
    name: "FAG Spherical Roller Bearing 23056-BE-XL-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 280,
    outerDiameter: 420,
    width: 106,
    weight: "47.0kg",
    boreType: "Cylindrical",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "C4",
    loadRating: "Dynamic: 1730 kN, Static: 2750 kN",
    speedRating: "1,100 RPM",
    price: 77800,
    stockCount: 10,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23056 CC/C4W33", price: 85200 },
      { brand: "NSK", partNumber: "23056 CAMC4", price: 79500 }
    ]
  },
  {
    partNumber: "23040-E1A-XL-K-M-C4",
    name: "FAG Spherical Roller Bearing 23040-E1A-XL-K-M-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 200,
    outerDiameter: 310,
    width: 82,
    weight: "19.5kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "C4",
    loadRating: "Dynamic: 1060 kN, Static: 1560 kN",
    speedRating: "1,600 RPM",
    price: 38900,
    stockCount: 16,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23040 CCK/C4W33", price: 42800 },
      { brand: "TIMKEN", partNumber: "23040 YMC4", price: 40200 }
    ]
  },
  {
    partNumber: "23038-E1-XL-K-TVPB-C3",
    name: "FAG Spherical Roller Bearing 23038-E1-XL-K-TVPB-C3",
    seriesGroup: "23000 Series",
    innerDiameter: 190,
    outerDiameter: 290,
    width: 75,
    weight: "15.6kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Polyamide (TVPB)",
    clearance: "C3",
    loadRating: "Dynamic: 930 kN, Static: 1400 kN",
    speedRating: "1,800 RPM",
    price: 29800,
    stockCount: 24,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23038 CCK/W33/C3", price: 32900 },
      { brand: "NTN", partNumber: "23038BKC3D1", price: 30800 }
    ]
  },
  {
    partNumber: "23030-E1-XL-TVPB-C4",
    name: "FAG Spherical Roller Bearing 23030-E1-XL-TVPB-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 150,
    outerDiameter: 225,
    width: 56,
    weight: "7.4kg",
    boreType: "Cylindrical",
    cageType: "Polyamide (TVPB)",
    clearance: "C4",
    loadRating: "Dynamic: 560 kN, Static: 790 kN",
    speedRating: "2,200 RPM",
    price: 15900,
    stockCount: 35,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23030 CC/C4W33", price: 17500 },
      { brand: "NSK", partNumber: "23030 CAMC4", price: 16400 }
    ]
  },
  {
    partNumber: "23024-E1A-XL-M-C4",
    name: "FAG Spherical Roller Bearing 23024-E1A-XL-M-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 120,
    outerDiameter: 180,
    width: 46,
    weight: "4.0kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C4",
    loadRating: "Dynamic: 380 kN, Static: 530 kN",
    speedRating: "2,800 RPM",
    price: 10800,
    stockCount: 45,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23024 CC/C4W33", price: 11900 },
      { brand: "NTN", partNumber: "23024BC4D1", price: 11200 }
    ]
  },
  {
    partNumber: "23124-E1A-XL-K-M",
    name: "FAG Spherical Roller Bearing 23124-E1A-XL-K-M",
    seriesGroup: "23100 Series",
    innerDiameter: 120,
    outerDiameter: 200,
    width: 62,
    weight: "7.7kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 590 kN, Static: 780 kN",
    speedRating: "2,600 RPM",
    price: 14800,
    stockCount: 32,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23124 CCK/W33", price: 16400 },
      { brand: "TIMKEN", partNumber: "23124 YMK", price: 15300 }
    ]
  },
  {
    partNumber: "22215-E1A-XL-M-C3",
    name: "FAG Spherical Roller Bearing 22215-E1A-XL-M-C3",
    seriesGroup: "22200 Series",
    innerDiameter: 75,
    outerDiameter: 130,
    width: 31,
    weight: "1.6kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C3",
    loadRating: "Dynamic: 212 kN, Static: 240 kN",
    speedRating: "4,500 RPM",
    price: 4950,
    stockCount: 60,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22215 E/C3", price: 5400 },
      { brand: "NSK", partNumber: "22215 EAC3", price: 5100 }
    ]
  },
  {
    partNumber: "23128-E1A-XL-M",
    name: "FAG Spherical Roller Bearing 23128-E1A-XL-M",
    seriesGroup: "23100 Series",
    innerDiameter: 140,
    outerDiameter: 225,
    width: 68,
    weight: "10.8kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 750 kN, Static: 1020 kN",
    speedRating: "2,200 RPM",
    price: 21500,
    stockCount: 26,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23128 CC/W33", price: 23800 },
      { brand: "NTN", partNumber: "23128BD1", price: 22100 }
    ]
  },
  {
    partNumber: "23038-E1-XL-K-TVPB",
    name: "FAG Spherical Roller Bearing 23038-E1-XL-K-TVPB",
    seriesGroup: "23000 Series",
    innerDiameter: 190,
    outerDiameter: 290,
    width: 75,
    weight: "15.6kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Polyamide (TVPB)",
    clearance: "Normal",
    loadRating: "Dynamic: 930 kN, Static: 1400 kN",
    speedRating: "1,800 RPM",
    price: 28900,
    stockCount: 22,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23038 CCK/W33", price: 32000 },
      { brand: "TIMKEN", partNumber: "23038 K", price: 30200 }
    ]
  },
  {
    partNumber: "22322-E1A-XL-MA-T41A",
    name: "FAG Spherical Roller Bearing 22322-E1A-XL-MA-T41A (Vibrating Screen)",
    seriesGroup: "22300 Series",
    innerDiameter: 110,
    outerDiameter: 240,
    width: 80,
    weight: "18.2kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass Outer Ring Guided (MA)",
    clearance: "Special T41A Radial Clearance for High Vibration",
    loadRating: "Dynamic: 950 kN, Static: 1080 kN",
    speedRating: "2,400 RPM",
    price: 34800,
    stockCount: 14,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22322 CCJA/VA405", price: 38500 },
      { brand: "NTN", partNumber: "22322BL1D1", price: 35900 }
    ]
  },
  {
    partNumber: "23152-BE-XL",
    name: "FAG Spherical Roller Bearing 23152-BE-XL",
    seriesGroup: "23100 Series",
    innerDiameter: 260,
    outerDiameter: 440,
    width: 144,
    weight: "84.5kg",
    boreType: "Cylindrical",
    cageType: "High Capacity Sheet Steel (BE-XL)",
    clearance: "Normal",
    loadRating: "Dynamic: 2500 kN, Static: 3750 kN",
    speedRating: "1,000 RPM",
    price: 138000,
    stockCount: 6,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23152 CC/W33", price: 152000 },
      { brand: "TIMKEN", partNumber: "23152 YM", price: 143000 }
    ]
  },
  {
    partNumber: "24060-BE-XL-K30-C3",
    name: "FAG Spherical Roller Bearing 24060-BE-XL-K30-C3",
    seriesGroup: "24000 Series",
    innerDiameter: 300,
    outerDiameter: 460,
    width: 160,
    weight: "97.0kg",
    boreType: "Tapered 1:30 (K30)",
    cageType: "Steel (BE-XL)",
    clearance: "C3",
    loadRating: "Dynamic: 2950 kN, Static: 4650 kN",
    speedRating: "900 RPM",
    price: 159000,
    stockCount: 5,
    equivalentProducts: [
      { brand: "SKF", partNumber: "24060 CCK30/C3W33", price: 174000 },
      { brand: "NTN", partNumber: "24060BK30C3D1", price: 164000 }
    ]
  },
  {
    partNumber: "24038-BE-XL",
    name: "FAG Spherical Roller Bearing 24038-BE-XL",
    seriesGroup: "24000 Series",
    innerDiameter: 190,
    outerDiameter: 290,
    width: 100,
    weight: "22.0kg",
    boreType: "Cylindrical",
    cageType: "Steel (BE-XL)",
    clearance: "Normal",
    loadRating: "Dynamic: 1220 kN, Static: 1930 kN",
    speedRating: "1,400 RPM",
    price: 41200,
    stockCount: 12,
    equivalentProducts: [
      { brand: "SKF", partNumber: "24038 CC/W33", price: 45500 },
      { brand: "NSK", partNumber: "24038 CAM", price: 42800 }
    ]
  },
  {
    partNumber: "23224-E1A-XL-M-C3",
    name: "FAG Spherical Roller Bearing 23224-E1A-XL-M-C3",
    seriesGroup: "23200 Series",
    innerDiameter: 120,
    outerDiameter: 215,
    width: 76,
    weight: "11.2kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C3",
    loadRating: "Dynamic: 735 kN, Static: 965 kN",
    speedRating: "2,200 RPM",
    price: 22400,
    stockCount: 20,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23224 CC/C3W33", price: 24800 },
      { brand: "NTN", partNumber: "23224BC3D1", price: 23100 }
    ]
  },
  {
    partNumber: "23222-E1A-XL-K-M",
    name: "FAG Spherical Roller Bearing 23222-E1A-XL-K-M",
    seriesGroup: "23200 Series",
    innerDiameter: 110,
    outerDiameter: 200,
    width: 69.8,
    weight: "9.3kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 640 kN, Static: 830 kN",
    speedRating: "2,400 RPM",
    price: 18900,
    stockCount: 24,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23222 CCK/W33", price: 20900 },
      { brand: "TIMKEN", partNumber: "23222 YMK", price: 19600 }
    ]
  },
  {
    partNumber: "23218-E1A-XL-M-C3",
    name: "FAG Spherical Roller Bearing 23218-E1A-XL-M-C3",
    seriesGroup: "23200 Series",
    innerDiameter: 90,
    outerDiameter: 160,
    width: 52.4,
    weight: "4.5kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C3",
    loadRating: "Dynamic: 415 kN, Static: 530 kN",
    speedRating: "3,200 RPM",
    price: 11800,
    stockCount: 36,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23218 CC/C3W33", price: 13100 },
      { brand: "NSK", partNumber: "23218 CAMC3", price: 12200 }
    ]
  },
  {
    partNumber: "23122-E1A-XL-M",
    name: "FAG Spherical Roller Bearing 23122-E1A-XL-M",
    seriesGroup: "23100 Series",
    innerDiameter: 110,
    outerDiameter: 180,
    width: 56,
    weight: "5.6kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 490 kN, Static: 640 kN",
    speedRating: "2,800 RPM",
    price: 13900,
    stockCount: 34,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23122 CC/W33", price: 15400 },
      { brand: "NTN", partNumber: "23122BD1", price: 14300 }
    ]
  },
  {
    partNumber: "23120-E1A-XL-K-M-C3",
    name: "FAG Spherical Roller Bearing 23120-E1A-XL-K-M-C3",
    seriesGroup: "23100 Series",
    innerDiameter: 100,
    outerDiameter: 165,
    width: 52,
    weight: "4.3kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "C3",
    loadRating: "Dynamic: 420 kN, Static: 540 kN",
    speedRating: "3,200 RPM",
    price: 11200,
    stockCount: 40,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23120 CCK/C3W33", price: 12400 },
      { brand: "NSK", partNumber: "23120 CAMKC3", price: 11700 }
    ]
  },
  {
    partNumber: "23072-BEA-XL-K-MB1",
    name: "FAG Spherical Roller Bearing 23072-BEA-XL-K-MB1",
    seriesGroup: "23000 Series",
    innerDiameter: 360,
    outerDiameter: 540,
    width: 134,
    weight: "98.0kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Machined Solid Brass (MB1)",
    clearance: "Normal",
    loadRating: "Dynamic: 2850 kN, Static: 4650 kN",
    speedRating: "850 RPM",
    price: 168000,
    stockCount: 4,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23072 CCK/W33", price: 184000 },
      { brand: "TIMKEN", partNumber: "23072 YMK", price: 172000 }
    ]
  },
  {
    partNumber: "24072-BEA-XL-MB1-C4",
    name: "FAG Spherical Roller Bearing 24072-BEA-XL-MB1-C4",
    seriesGroup: "24000 Series",
    innerDiameter: 360,
    outerDiameter: 540,
    width: 180,
    weight: "145.0kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (MB1)",
    clearance: "C4",
    loadRating: "Dynamic: 3900 kN, Static: 6550 kN",
    speedRating: "750 RPM",
    price: 245000,
    stockCount: 3,
    equivalentProducts: [
      { brand: "SKF", partNumber: "24072 CC/C4W33", price: 268000 },
      { brand: "NTN", partNumber: "24072BC4D1", price: 252000 }
    ]
  },
  {
    partNumber: "23244-BE-XL-K-T52BW",
    name: "FAG Spherical Roller Bearing 23244-BE-XL-K-T52BW",
    seriesGroup: "23200 Series",
    innerDiameter: 220,
    outerDiameter: 400,
    width: 144,
    weight: "69.5kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "Normal",
    loadRating: "Dynamic: 2400 kN, Static: 3450 kN",
    speedRating: "1,200 RPM",
    price: 118000,
    stockCount: 6,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23244 CCK/W33", price: 130000 },
      { brand: "TIMKEN", partNumber: "23244 YMK", price: 122000 }
    ]
  },
  {
    partNumber: "23130-E1A-XL-M-C2",
    name: "FAG Spherical Roller Bearing 23130-E1A-XL-M-C2",
    seriesGroup: "23100 Series",
    innerDiameter: 150,
    outerDiameter: 250,
    width: 80,
    weight: "15.2kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C2 (Radial Clearance Less than Normal)",
    loadRating: "Dynamic: 890 kN, Static: 1200 kN",
    speedRating: "2,000 RPM",
    price: 24600,
    stockCount: 18,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23130 CC/C2W33", price: 27100 },
      { brand: "NSK", partNumber: "23130 CAMC2", price: 25300 }
    ]
  },
  {
    partNumber: "23044-BE-XL-K-W209B-C4",
    name: "FAG Spherical Roller Bearing 23044-BE-XL-K-W209B-C4",
    seriesGroup: "23000 Series",
    innerDiameter: 220,
    outerDiameter: 340,
    width: 90,
    weight: "26.5kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "C4",
    loadRating: "Dynamic: 1340 kN, Static: 2040 kN",
    speedRating: "1,500 RPM",
    price: 46500,
    stockCount: 14,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23044 CCK/C4W33", price: 51200 },
      { brand: "NTN", partNumber: "23044BKC4D1", price: 48000 }
    ]
  },
  {
    partNumber: "23036-E1A-XL-M-C2",
    name: "FAG Spherical Roller Bearing 23036-E1A-XL-M-C2",
    seriesGroup: "23000 Series",
    innerDiameter: 180,
    outerDiameter: 280,
    width: 74,
    weight: "14.8kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C2",
    loadRating: "Dynamic: 850 kN, Static: 1270 kN",
    speedRating: "1,900 RPM",
    price: 27500,
    stockCount: 20,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23036 CC/C2W33", price: 30400 },
      { brand: "TIMKEN", partNumber: "23036 YMC2", price: 28600 }
    ]
  },
  {
    partNumber: "23032-E1A-XL-K-M-C5",
    name: "FAG Spherical Roller Bearing 23032-E1A-XL-K-M-C5",
    seriesGroup: "23000 Series",
    innerDiameter: 160,
    outerDiameter: 240,
    width: 60,
    weight: "8.8kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "C5 (Extra Large Clearance)",
    loadRating: "Dynamic: 640 kN, Static: 950 kN",
    speedRating: "2,200 RPM",
    price: 18900,
    stockCount: 22,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23032 CCK/C5W33", price: 20900 },
      { brand: "NSK", partNumber: "23032 CAMKC5", price: 19600 }
    ]
  },
  {
    partNumber: "23032-E1A-XL-K-M-C2",
    name: "FAG Spherical Roller Bearing 23032-E1A-XL-K-M-C2",
    seriesGroup: "23000 Series",
    innerDiameter: 160,
    outerDiameter: 240,
    width: 60,
    weight: "8.8kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "C2",
    loadRating: "Dynamic: 640 kN, Static: 950 kN",
    speedRating: "2,200 RPM",
    price: 18900,
    stockCount: 20,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23032 CCK/C2W33", price: 20900 },
      { brand: "NTN", partNumber: "23032BKC2D1", price: 19500 }
    ]
  },
  {
    partNumber: "22220-E1-XL-C5",
    name: "FAG Spherical Roller Bearing 22220-E1-XL-C5",
    seriesGroup: "22200 Series",
    innerDiameter: 100,
    outerDiameter: 180,
    width: 46,
    weight: "4.9kg",
    boreType: "Cylindrical",
    cageType: "Sheet Steel (E1-XL)",
    clearance: "C5",
    loadRating: "Dynamic: 430 kN, Static: 490 kN",
    speedRating: "3,400 RPM",
    price: 9800,
    stockCount: 45,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22220 E/C5", price: 10800 },
      { brand: "TIMKEN", partNumber: "22220 EJW33C5", price: 10200 }
    ]
  },
  {
    partNumber: "22216-E1-XL-K-T52BD",
    name: "FAG Spherical Roller Bearing 22216-E1-XL-K-T52BD",
    seriesGroup: "22200 Series",
    innerDiameter: 80,
    outerDiameter: 140,
    width: 33,
    weight: "2.0kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Sheet Steel (E1-XL)",
    clearance: "Normal",
    loadRating: "Dynamic: 240 kN, Static: 270 kN",
    speedRating: "4,300 RPM",
    price: 5800,
    stockCount: 50,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22216 EK/W33", price: 6400 },
      { brand: "NSK", partNumber: "22216 EAK", price: 6000 }
    ]
  },
  {
    partNumber: "24124-BE-XL-2VSR-H40",
    name: "FAG Sealed Spherical Roller Bearing 24124-BE-XL-2VSR-H40",
    seriesGroup: "24100 Series",
    innerDiameter: 120,
    outerDiameter: 200,
    width: 80,
    weight: "10.2kg",
    boreType: "Cylindrical",
    cageType: "Sheet Steel",
    clearance: "Normal (Contact Seals 2VSR)",
    loadRating: "Dynamic: 670 kN, Static: 930 kN",
    speedRating: "1,200 RPM",
    price: 26500,
    stockCount: 15,
    equivalentProducts: [
      { brand: "SKF", partNumber: "BS2-24124-2CS/VT143", price: 29800 },
      { brand: "NTN", partNumber: "WA24124LL", price: 27400 }
    ]
  },
  {
    partNumber: "23240-BE-XL-H151B-C3",
    name: "FAG Spherical Roller Bearing 23240-BE-XL-H151B-C3",
    seriesGroup: "23200 Series",
    innerDiameter: 200,
    outerDiameter: 360,
    width: 128,
    weight: "51.5kg",
    boreType: "Cylindrical",
    cageType: "Sheet Steel (BE-XL)",
    clearance: "C3",
    loadRating: "Dynamic: 1960 kN, Static: 2750 kN",
    speedRating: "1,300 RPM",
    price: 89000,
    stockCount: 8,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23240 CC/C3W33", price: 98000 },
      { brand: "TIMKEN", partNumber: "23240 YMC3", price: 92500 }
    ]
  },
  {
    partNumber: "22216-E1A-XL-M-C4",
    name: "FAG Spherical Roller Bearing 22216-E1A-XL-M-C4",
    seriesGroup: "22200 Series",
    innerDiameter: 80,
    outerDiameter: 140,
    width: 33,
    weight: "2.1kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass (M)",
    clearance: "C4",
    loadRating: "Dynamic: 240 kN, Static: 270 kN",
    speedRating: "4,300 RPM",
    price: 6200,
    stockCount: 55,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22216 E/C4", price: 6800 },
      { brand: "NSK", partNumber: "22216 EAC4", price: 6400 }
    ]
  },
  {
    partNumber: "23192-MB-C3",
    name: "FAG Large Size Spherical Roller Bearing 23192-MB-C3",
    seriesGroup: "23100 Series",
    innerDiameter: 460,
    outerDiameter: 760,
    width: 240,
    weight: "440.0kg",
    boreType: "Cylindrical",
    cageType: "Machined Solid Brass (MB)",
    clearance: "C3",
    loadRating: "Dynamic: 6950 kN, Static: 11800 kN",
    speedRating: "600 RPM",
    price: 680000,
    stockCount: 2,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23192 CA/C3W33", price: 740000 },
      { brand: "TIMKEN", partNumber: "23192 YMC3", price: 705000 }
    ]
  },
  {
    partNumber: "20213-TVP-C3",
    name: "FAG Barrel Single Row Spherical Roller Bearing 20213-TVP-C3",
    seriesGroup: "20200 Series",
    innerDiameter: 65,
    outerDiameter: 120,
    width: 23,
    weight: "1.1kg",
    boreType: "Cylindrical",
    cageType: "Polyamide (TVP)",
    clearance: "C3",
    loadRating: "Dynamic: 110 kN, Static: 130 kN",
    speedRating: "4,800 RPM",
    price: 3850,
    stockCount: 30,
    equivalentProducts: [
      { brand: "SKF", partNumber: "20213 TN9/C3", price: 4250 },
      { brand: "NTN", partNumber: "20213C3", price: 3950 }
    ]
  },
  {
    partNumber: "222S.300",
    name: "FAG Inch Spherical Roller Bearing 222S.300 (3.000\" Bore)",
    seriesGroup: "22200 Inch Series",
    innerDiameter: 76.2,
    outerDiameter: 160,
    width: 52.4,
    weight: "4.8kg",
    boreType: "Cylindrical 3.000 Inch",
    cageType: "Machined Brass",
    clearance: "Normal",
    loadRating: "Dynamic: 415 kN, Static: 530 kN",
    speedRating: "3,200 RPM",
    price: 14500,
    stockCount: 18,
    equivalentProducts: [
      { brand: "TIMKEN", partNumber: "222S300", price: 15800 },
      { brand: "SKF", partNumber: "22218-300", price: 16200 }
    ]
  },
  {
    partNumber: "22322E1AK.M.C4",
    name: "FAG Spherical Roller Bearing 22322-E1A-K-M-C4",
    seriesGroup: "22300 Series",
    innerDiameter: 110,
    outerDiameter: 240,
    width: 80,
    weight: "18.0kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "C4",
    loadRating: "Dynamic: 950 kN, Static: 1080 kN",
    speedRating: "2,400 RPM",
    price: 33500,
    stockCount: 16,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22322 CCK/C4W33", price: 36900 },
      { brand: "NSK", partNumber: "22322 CAMKC4", price: 34500 }
    ]
  },
  {
    partNumber: "23240-B-MB",
    name: "FAG Spherical Roller Bearing 23240-B-MB",
    seriesGroup: "23200 Series",
    innerDiameter: 200,
    outerDiameter: 360,
    width: 128,
    weight: "52.0kg",
    boreType: "Cylindrical",
    cageType: "Solid Brass Cage (MB)",
    clearance: "Normal",
    loadRating: "Dynamic: 1960 kN, Static: 2750 kN",
    speedRating: "1,300 RPM",
    price: 88000,
    stockCount: 10,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23240 CC/W33", price: 97000 },
      { brand: "TIMKEN", partNumber: "23240 YM", price: 91000 }
    ]
  },
  {
    partNumber: "23138-E1A-K-M",
    name: "FAG Spherical Roller Bearing 23138-E1A-K-M",
    seriesGroup: "23100 Series",
    innerDiameter: 190,
    outerDiameter: 320,
    width: 104,
    weight: "32.5kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (M)",
    clearance: "Normal",
    loadRating: "Dynamic: 1490 kN, Static: 2080 kN",
    speedRating: "1,400 RPM",
    price: 49500,
    stockCount: 12,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23138 CCK/W33", price: 54500 },
      { brand: "NTN", partNumber: "23138BKD1", price: 51200 }
    ]
  },
  {
    partNumber: "23044-K-MB-C3",
    name: "FAG Spherical Roller Bearing 23044-K-MB-C3",
    seriesGroup: "23000 Series",
    innerDiameter: 220,
    outerDiameter: 340,
    width: 90,
    weight: "27.0kg",
    boreType: "Tapered 1:12 (K)",
    cageType: "Solid Brass (MB)",
    clearance: "C3",
    loadRating: "Dynamic: 1340 kN, Static: 2040 kN",
    speedRating: "1,500 RPM",
    price: 47200,
    stockCount: 15,
    equivalentProducts: [
      { brand: "SKF", partNumber: "23044 CCK/C3W33", price: 52000 },
      { brand: "NSK", partNumber: "23044 CAMKC3", price: 48900 }
    ]
  },
  {
    partNumber: "20312-TVP",
    name: "FAG Barrel Single Row Spherical Roller Bearing 20312-TVP",
    seriesGroup: "20300 Series",
    innerDiameter: 60,
    outerDiameter: 130,
    width: 31,
    weight: "1.8kg",
    boreType: "Cylindrical",
    cageType: "Polyamide (TVP)",
    clearance: "Normal",
    loadRating: "Dynamic: 145 kN, Static: 170 kN",
    speedRating: "4,300 RPM",
    price: 4600,
    stockCount: 30,
    equivalentProducts: [
      { brand: "SKF", partNumber: "20312 TN9", price: 5100 },
      { brand: "NTN", partNumber: "20312D1", price: 4750 }
    ]
  },
  {
    partNumber: "20228-MB",
    name: "FAG Barrel Single Row Spherical Roller Bearing 20228-MB",
    seriesGroup: "20200 Series",
    innerDiameter: 140,
    outerDiameter: 250,
    width: 42,
    weight: "8.5kg",
    boreType: "Cylindrical",
    cageType: "Machined Solid Brass (MB)",
    clearance: "Normal",
    loadRating: "Dynamic: 380 kN, Static: 520 kN",
    speedRating: "2,400 RPM",
    price: 18400,
    stockCount: 14,
    equivalentProducts: [
      { brand: "SKF", partNumber: "20228 M", price: 20500 },
      { brand: "TIMKEN", partNumber: "20228 YM", price: 19100 }
    ]
  },
  {
    partNumber: "22210-E1-H40AB",
    name: "FAG Spherical Roller Bearing 22210-E1-H40AB",
    seriesGroup: "22200 Series",
    innerDiameter: 50,
    outerDiameter: 90,
    width: 23,
    weight: "0.65kg",
    boreType: "Cylindrical",
    cageType: "Sheet Steel (E1)",
    clearance: "Normal (H40AB Internal Design)",
    loadRating: "Dynamic: 104 kN, Static: 108 kN",
    speedRating: "6,300 RPM",
    price: 2850,
    stockCount: 80,
    equivalentProducts: [
      { brand: "SKF", partNumber: "22210 E", price: 3150 },
      { brand: "NSK", partNumber: "22210 EA", price: 2950 }
    ]
  }
];

// Map into standard product schema
export const FULL_FAG_PRODUCTS = FAG_SPHERICAL_PRODUCTS.map((p, idx) => {
  const cleanId = p.partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return {
    id: `fag-${cleanId}-${idx + 1}`,
    partNumber: p.partNumber,
    name: p.name,
    brand: "FAG",
    category: "Spherical Roller Bearings",
    seriesGroup: p.seriesGroup,
    price: p.price,
    currency: "INR",
    stockStatus: "Available",
    stockCount: p.stockCount || 20,
    weight: p.weight,
    innerDiameter: p.innerDiameter,
    outerDiameter: p.outerDiameter,
    width: p.width,
    material: "High-Grade 100Cr6 Chrome Bearing Steel (X-life)",
    sealType: p.partNumber.includes("2VSR") ? "Contact Rubber Seals (2VSR)" : "Open (Lubrication Groove W33)",
    cageType: p.cageType,
    loadRating: p.loadRating,
    speedRating: p.speedRating,
    countryOfOrigin: "Germany",
    application: "Heavy crushing equipment, vibrating screens, continuous casters, paper mills, wind turbines, rolling mills",
    description: `Genuine FAG Schaeffler high-capacity X-life spherical roller bearing ${p.partNumber}. Self-aligning design accommodates severe shaft deflection, heavy radial loads, and shock impulses in severe industrial environments.`,
    equivalentProducts: p.equivalentProducts || []
  };
});

async function main() {
  console.log(`[Script] Preparing to ingest ${FULL_FAG_PRODUCTS.length} FAG Spherical Roller Bearings...`);

  // 1. Update backend/data/bearingsData.js
  const dataFilePath = path.join(__dirname, '../data/bearingsData.js');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Add Spherical Roller Bearings to CATEGORY_TREE if not present
  if (!dataContent.includes('"name": "Spherical Roller Bearings"')) {
    dataContent = dataContent.replace(
      /"name": "Roller Bearings",\s*"id": "roller-bearings",\s*"subcategories": \[/,
      `"name": "Roller Bearings",\n    "id": "roller-bearings",\n    "subcategories": [\n      {\n        "name": "Spherical Roller Bearings",\n        "id": "spherical-roller"\n      },`
    );
  }

  // Insert the products into INITIAL_PRODUCTS array if not present
  const firstId = FULL_FAG_PRODUCTS[0].id;
  if (!dataContent.includes(firstId)) {
    const productsString = FULL_FAG_PRODUCTS.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
    dataContent = dataContent.replace(
      'export const INITIAL_PRODUCTS = [',
      `export const INITIAL_PRODUCTS = [\n${productsString},`
    );
    fs.writeFileSync(dataFilePath, dataContent, 'utf8');
    console.log(`[Script] Updated backend/data/bearingsData.js with ${FULL_FAG_PRODUCTS.length} products.`);
  } else {
    console.log(`[Script] Products already present in backend/data/bearingsData.js.`);
  }

  // 2. Connect to MongoDB Atlas and bulk upsert
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Script Warning] MONGODB_URI not found in .env. Skipping MongoDB Atlas direct insert.');
    return;
  }

  try {
    console.log('[Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Script] Connected to MongoDB Atlas.');

    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

    const bulkOps = FULL_FAG_PRODUCTS.map(prod => ({
      updateOne: {
        filter: { partNumber: prod.partNumber },
        update: { $set: prod },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(bulkOps);
    console.log(`[Script] MongoDB Atlas BulkWrite Complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    const totalFAG = await Product.countDocuments({ brand: "FAG" });
    const totalSpherical = await Product.countDocuments({ category: "Spherical Roller Bearings" });
    console.log(`[Script] Database Stats: ${totalFAG} total FAG bearings | ${totalSpherical} Spherical Roller Bearings.`);
  } catch (err) {
    console.error('[Script Database Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Script] Disconnected from MongoDB.');
  }
}

main();
