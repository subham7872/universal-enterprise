import { Product } from '../models/Product.js';
import { INITIAL_PRODUCTS, INITIAL_BRANDS } from '../data/bearingsData.js';

// In-memory fallback cache in case MongoDB is in cold boot or detached
let inMemoryProducts = [...INITIAL_PRODUCTS];

export const getBrands = async (req, res, next) => {
  try {
    try {
      const distinctBrands = await Product.distinct('brand');
      if (distinctBrands && distinctBrands.length > 0) {
        return res.json({ success: true, data: distinctBrands });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: INITIAL_BRANDS });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      query = '',
      field = 'any', // partNumber, name, brand, series, any
      matchType = 'contains', // contains, startsWith, exact
      category = '',
      brand = '',
      idMin = '',
      idMax = '',
      odMin = '',
      odMax = '',
      wMin = '',
      wMax = '',
      material = '',
      sealType = '',
      cageType = '',
      stockStatus = '',
      priceMin = '',
      priceMax = '',
      origin = '',
      sort = 'partNumber-asc', // price-asc, price-desc, partNumber-asc, partNumber-desc
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    try {
      // Build dynamic MongoDB filter
      const filter = {};

      if (query && query.trim()) {
        const cleanQuery = query.trim();
        let regex;
        if (matchType === 'exact') {
          regex = new RegExp(`^${cleanQuery}$`, 'i');
        } else if (matchType === 'startsWith') {
          regex = new RegExp(`^${cleanQuery}`, 'i');
        } else {
          regex = new RegExp(cleanQuery, 'i');
        }

        if (field === 'partNumber') {
          filter.partNumber = regex;
        } else if (field === 'name') {
          filter.name = regex;
        } else if (field === 'brand') {
          filter.brand = regex;
        } else if (field === 'series') {
          filter.seriesGroup = regex;
        } else {
          filter.$or = [
            { partNumber: regex },
            { name: regex },
            { brand: regex },
            { category: regex },
            { seriesGroup: regex }
          ];
        }
      }

      if (category) {
        filter.category = new RegExp(category.trim(), 'i');
      }

      if (brand) {
        const cleanBrand = brand.replace(/\s*\(\d+\)\s*$/, '').trim();
        filter.brand = new RegExp(`^${cleanBrand}$`, 'i');
      }

      if (idMin || idMax) {
        filter.innerDiameter = {};
        if (idMin) filter.innerDiameter.$gte = parseFloat(idMin);
        if (idMax) filter.innerDiameter.$lte = parseFloat(idMax);
      }

      if (odMin || odMax) {
        filter.outerDiameter = {};
        if (odMin) filter.outerDiameter.$gte = parseFloat(odMin);
        if (odMax) filter.outerDiameter.$lte = parseFloat(odMax);
      }

      if (wMin || wMax) {
        filter.width = {};
        if (wMin) filter.width.$gte = parseFloat(wMin);
        if (wMax) filter.width.$lte = parseFloat(wMax);
      }

      if (material) {
        filter.material = new RegExp(material.trim(), 'i');
      }

      if (sealType) {
        filter.sealType = new RegExp(sealType.trim(), 'i');
      }

      if (cageType) {
        filter.cageType = new RegExp(cageType.trim(), 'i');
      }

      if (stockStatus) {
        filter.stockStatus = new RegExp(`^${stockStatus.trim()}$`, 'i');
      }

      if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = parseFloat(priceMin);
        if (priceMax) filter.price.$lte = parseFloat(priceMax);
      }

      if (origin) {
        filter.countryOfOrigin = new RegExp(`^${origin.trim()}$`, 'i');
      }

      // Sort configuration
      const sortConfig = {};
      if (sort === 'price-asc') sortConfig.price = 1;
      else if (sort === 'price-desc') sortConfig.price = -1;
      else if (sort === 'partNumber-desc') sortConfig.partNumber = -1;
      else sortConfig.partNumber = 1;

      const total = await Product.countDocuments(filter);
      const items = await Product.find(filter)
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum)
        .lean();

      if (total > 0 || (items && items.length > 0)) {
        return res.json({
          success: true,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.max(1, Math.ceil(total / limitNum)),
          items
        });
      }
    } catch (mongoError) {
      console.warn('[MongoDB Product Query Fallback]:', mongoError.message);
    }

    // In-memory fallback if MongoDB has not yet been populated
    let filtered = [...inMemoryProducts];
    if (query) {
      const q = String(query).toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const val = `${p.partNumber} ${p.name} ${p.brand} ${p.category}`.toLowerCase();
        if (matchType === 'exact') return val === q || p.partNumber.toLowerCase() === q;
        if (matchType === 'startsWith') return val.startsWith(q) || p.partNumber.toLowerCase().startsWith(q);
        return val.includes(q);
      });
    }

    if (category) {
      const cat = String(category).toLowerCase();
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(cat));
    }

    if (brand) {
      const cleanB = String(brand).replace(/\s*\(\d+\)\s*$/, '').trim().toLowerCase();
      filtered = filtered.filter((p) => p.brand.toLowerCase() === cleanB);
    }

    if (idMin) filtered = filtered.filter((p) => p.innerDiameter >= parseFloat(idMin));
    if (idMax) filtered = filtered.filter((p) => p.innerDiameter <= parseFloat(idMax));
    if (odMin) filtered = filtered.filter((p) => p.outerDiameter >= parseFloat(odMin));
    if (odMax) filtered = filtered.filter((p) => p.outerDiameter <= parseFloat(odMax));
    if (wMin) filtered = filtered.filter((p) => p.width >= parseFloat(wMin));
    if (wMax) filtered = filtered.filter((p) => p.width <= parseFloat(wMax));
    if (priceMin) filtered = filtered.filter((p) => p.price >= parseFloat(priceMin));
    if (priceMax) filtered = filtered.filter((p) => p.price <= parseFloat(priceMax));

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'partNumber-desc') filtered.sort((a, b) => b.partNumber.localeCompare(a.partNumber));
    else filtered.sort((a, b) => a.partNumber.localeCompare(b.partNumber));

    const total = filtered.length;
    const paginatedItems = filtered.slice(skip, skip + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      items: paginatedItems
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;

    try {
      product = await Product.findOne({
        $or: [{ id }, { partNumber: id.toUpperCase() }]
      }).lean();
    } catch (e) {
      // Fallback
    }

    if (!product) {
      product = inMemoryProducts.find((p) => p.id === id || p.partNumber.toUpperCase() === id.toUpperCase());
    }

    if (!product) {
      return res.status(404).json({ success: false, message: `Product reference '${id}' not found.` });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const q = String(req.query.query || '').toLowerCase().trim();
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    try {
      const suggestions = await Product.find({
        $or: [
          { partNumber: new RegExp(q, 'i') },
          { name: new RegExp(q, 'i') },
          { brand: new RegExp(q, 'i') }
        ]
      })
      .select('partNumber brand name category price id')
      .limit(10)
      .lean();

      if (suggestions && suggestions.length > 0) {
        return res.json({ success: true, data: suggestions });
      }
    } catch (e) {
      // Fallback
    }

    const fallbackSuggestions = inMemoryProducts
      .filter((p) => p.partNumber.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 10)
      .map((p) => ({
        partNumber: p.partNumber,
        brand: p.brand,
        name: p.name,
        category: p.category,
        price: p.price,
        id: p.id
      }));

    res.json({ success: true, data: fallbackSuggestions });
  } catch (error) {
    next(error);
  }
};

export const uploadProducts = async (req, res, next) => {
  try {
    const { csvText } = req.body;
    if (!csvText || typeof csvText !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid CSV text format' });
    }

    const lines = csvText.split('\n').filter((l) => l.trim() !== '');
    let addedCount = 0;
    let updatedCount = 0;
    const errors = [];
    const productsToUpsert = [];

    for (const line of lines) {
      try {
        // Format 1: "16001JRX - ₹224" or "16001JRX - 224"
        if (line.includes(' - ₹') || line.includes(' - ') || line.includes(' - Rs')) {
          const parts = line.split(/-|₹|Rs/);
          const rawPart = parts[0].trim().toUpperCase();
          const rawPrice = parseFloat(parts[parts.length - 1].replace(/[^0-9.]/g, ''));

          if (rawPart && !isNaN(rawPrice)) {
            productsToUpsert.push({
              id: `imported-${rawPart.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              partNumber: rawPart,
              name: `Deep Groove Bearing ${rawPart}`,
              brand: 'NTN',
              category: 'Deep Groove Ball Bearings Single Row',
              seriesGroup: '16000 Series',
              price: rawPrice,
              stockStatus: 'Available',
              stockCount: 50,
              weight: '0.15kg',
              innerDiameter: 25,
              outerDiameter: 52,
              width: 15,
              material: 'Chrome Steel',
              sealType: 'Open',
              cageType: 'Steel',
              loadRating: 'Dynamic: 11.2 kN, Static: 5.6 kN',
              speedRating: '10,000 RPM',
              countryOfOrigin: 'Japan',
              application: 'General Industrial Sourcing'
            });
          }
        } else if (line.includes(',') || line.includes(';')) {
          // Format 2: CSV columns
          const separator = line.includes(',') ? ',' : ';';
          const cols = line.split(separator).map((c) => c.trim().replace(/^["']|["']$/g, ''));

          if (cols[0].toLowerCase() === 'partnumber' || cols[0].toLowerCase() === 'product number') {
            continue;
          }

          const partNumber = cols[0].toUpperCase();
          const brand = cols[1] || 'NTN';
          const category = cols[2] || 'Deep Groove Ball Bearings Single Row';
          const price = parseFloat(cols[3]) || 500;
          const stock = cols[4] || 'Available';

          if (partNumber) {
            productsToUpsert.push({
              id: `csv-${partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              partNumber,
              name: `${brand} ${partNumber} Bearings`,
              brand,
              category,
              price,
              stockStatus: stock,
              stockCount: 100,
              weight: cols[5] || '0.25kg',
              innerDiameter: parseFloat(cols[6]) || 20,
              outerDiameter: parseFloat(cols[7]) || 47,
              width: parseFloat(cols[8]) || 14,
              material: cols[9] || 'Chrome Steel',
              sealType: cols[10] || 'Open',
              cageType: cols[11] || 'Pressed Steel',
              loadRating: 'Dynamic: 12.8 kN, Static: 6.4 kN',
              speedRating: '8,500 RPM',
              countryOfOrigin: cols[12] || 'Japan',
              application: 'Sourced Industrial Machinery'
            });
          }
        }
      } catch (err) {
        errors.push(`Error on line: "${line}" - ${err.message}`);
      }
    }

    // Upsert into MongoDB
    for (const p of productsToUpsert) {
      try {
        const result = await Product.findOneAndUpdate(
          { partNumber: p.partNumber },
          { $set: p },
          { upsert: true, new: true }
        );
        if (result) addedCount++;
      } catch (dbErr) {
        // Upsert into memory fallback
        const existingIdx = inMemoryProducts.findIndex((item) => item.partNumber === p.partNumber);
        if (existingIdx >= 0) {
          inMemoryProducts[existingIdx] = { ...inMemoryProducts[existingIdx], ...p };
          updatedCount++;
        } else {
          inMemoryProducts.unshift(p);
          addedCount++;
        }
      }
    }

    res.json({
      success: true,
      message: `Processed ${productsToUpsert.length} records. Added/Updated: ${addedCount + updatedCount}`,
      addedCount,
      updatedCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};
