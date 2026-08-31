import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { INITIAL_PRODUCTS, INITIAL_BRANDS } from '../data/bearingsData.js';

// In-memory fallback cache in case MongoDB is in cold boot or detached
let inMemoryProducts = [...INITIAL_PRODUCTS];

export const getBrands = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const distinctBrands = await Product.distinct('brand');
        if (distinctBrands && distinctBrands.length > 0) {
          return res.json({ success: true, data: distinctBrands });
        }
      } catch (e) {
        // Fallback
      }
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

    if (mongoose.connection.readyState === 1) {
      try {
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
          const cat = category.trim();
          const lower = cat.toLowerCase();

          if (lower.includes('angular contact') && lower.includes('single row')) {
            filter.$and = filter.$and || [];
            filter.$and.push(
              { $or: [{ category: /Angular Contact/i }, { subcategory: /Angular Contact/i }] },
              { category: { $not: /Double Row/i } }
            );
          } else if (lower.includes('angular contact') && lower.includes('double row')) {
            filter.$and = filter.$and || [];
            filter.$and.push(
              { $or: [{ category: /Angular Contact/i }, { subcategory: /Angular Contact/i }] },
              { $or: [{ category: /Double Row/i }, { subcategory: /Double Row/i }, { seriesGroup: /Double Row/i }] }
            );
          } else if (lower.includes('deep groove') && lower.includes('double row')) {
            filter.$and = filter.$and || [];
            filter.$and.push(
              { $or: [{ category: /Deep Groove/i }, { subcategory: /Deep Groove/i }] },
              { $or: [{ category: /Double Row/i }, { subcategory: /Double Row/i }, { seriesGroup: /Double Row/i }] }
            );
          } else if (lower.includes('deep groove') && (lower.includes('single row') || !lower.includes('double'))) {
            filter.$and = filter.$and || [];
            filter.$and.push(
              { $or: [{ category: /Deep Groove/i }, { subcategory: /Deep Groove/i }] },
              { category: { $not: /Double Row/i } },
              { subcategory: { $not: /Double Row/i } },
              { seriesGroup: { $not: /Double Row/i } }
            );
          } else if (lower.includes('stainless steel')) {
            filter.$or = [
              { category: /Stainless Steel/i },
              { subcategory: /Stainless Steel/i },
              { material: /Stainless Steel/i },
              { name: /Stainless Steel/i }
            ];
          } else if (lower.includes('self aligning')) {
            filter.$or = [
              { category: /Self Aligning/i },
              { subcategory: /Self Aligning/i },
              { seriesGroup: /Self Aligning/i },
              { name: /Self Aligning/i }
            ];
          } else if (lower.includes('four point')) {
            filter.$or = [
              { category: /Four Point/i },
              { subcategory: /Four Point/i },
              { seriesGroup: /Four Point/i },
              { name: /Four Point/i }
            ];
          } else if (lower.includes('magneto')) {
            filter.$or = [
              { category: /Magneto/i },
              { subcategory: /Magneto/i },
              { seriesGroup: /Magneto/i },
              { name: /Magneto/i }
            ];
          } else if (lower.includes('housing')) {
            filter.$or = [
              { category: /Housing/i },
              { subcategory: /Housing/i },
              { seriesGroup: /Housing/i },
              { name: /Housing/i }
            ];
          } else {
            const catRegex = new RegExp(cat, 'i');
            filter.$or = [
              { category: catRegex },
              { subcategory: catRegex },
              { seriesGroup: catRegex }
            ];
          }
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
      const cat = category.trim();
      const lower = cat.toLowerCase();

      if (lower.includes('angular contact') && lower.includes('single row')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''}`.toLowerCase();
          return c.includes('angular contact') && !c.includes('double row');
        });
      } else if (lower.includes('angular contact') && lower.includes('double row')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''}`.toLowerCase();
          return c.includes('angular contact') && c.includes('double row');
        });
      } else if (lower.includes('deep groove') && lower.includes('double row')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''}`.toLowerCase();
          return (c.includes('deep groove') || p.seriesGroup?.toLowerCase().includes('double row')) && c.includes('double row');
        });
      } else if (lower.includes('deep groove') && (lower.includes('single row') || !lower.includes('double'))) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''}`.toLowerCase();
          return c.includes('deep groove') && !c.includes('double row');
        });
      } else if (lower.includes('stainless steel')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.material || ''} ${p.name || ''}`.toLowerCase();
          return c.includes('stainless steel') || c.includes('aisi 440');
        });
      } else if (lower.includes('self aligning')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''} ${p.name || ''}`.toLowerCase();
          return c.includes('self aligning');
        });
      } else if (lower.includes('four point')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''} ${p.name || ''}`.toLowerCase();
          return c.includes('four point');
        });
      } else if (lower.includes('magneto')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''} ${p.name || ''}`.toLowerCase();
          return c.includes('magneto');
        });
      } else if (lower.includes('housing')) {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''} ${p.name || ''}`.toLowerCase();
          return c.includes('housing');
        });
      } else {
        filtered = filtered.filter((p) => {
          const c = `${p.category || ''} ${p.subcategory || ''} ${p.seriesGroup || ''}`.toLowerCase();
          return c.includes(lower);
        });
      }
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

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData.partNumber || !productData.brand) {
      return res.status(400).json({ success: false, message: 'Part number and brand are required.' });
    }

    const newId = productData.id || `${productData.brand.toLowerCase()}-${productData.partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const productToCreate = {
      ...productData,
      id: newId,
      image: productData.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
    };

    try {
      const created = await Product.create(productToCreate);
      return res.status(201).json({ success: true, data: created });
    } catch (dbErr) {
      inMemoryProducts.unshift(productToCreate);
      return res.status(201).json({ success: true, data: productToCreate });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updated = await Product.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partNumber: id }] },
        { $set: updateData },
        { new: true }
      );

      if (updated) {
        return res.json({ success: true, data: updated });
      }
    } catch (dbErr) {
      // Memory fallback
    }

    const idx = inMemoryProducts.findIndex(p => p.id === id || p.partNumber === id);
    if (idx >= 0) {
      inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updateData };
      return res.json({ success: true, data: inMemoryProducts[idx] });
    }

    return res.status(404).json({ success: false, message: 'Product not found.' });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Product.findOneAndDelete({
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partNumber: id }]
      });
    } catch (dbErr) {
      // Memory fallback
    }

    inMemoryProducts = inMemoryProducts.filter(p => p.id !== id && p.partNumber !== id);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImage = async (req, res, next) => {
  try {
    const { imageBase64, filename = 'bearing.jpg', productId } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image data provided.' });
    }

    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Strip header if data URI
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(imageBase64, 'base64');
    
    const ext = filename.split('.').pop() || 'jpg';
    const cleanName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, cleanName);

    fs.writeFileSync(filePath, buffer);
    const imageUrl = `/uploads/${cleanName}`;

    // If productId is supplied, update the product directly
    if (productId) {
      try {
        await Product.findOneAndUpdate(
          { $or: [{ id: productId }, { partNumber: productId }] },
          { $set: { image: imageUrl } }
        );
      } catch (e) {
        // Fallback
      }

      const idx = inMemoryProducts.findIndex(p => p.id === productId || p.partNumber === productId);
      if (idx >= 0) {
        inMemoryProducts[idx].image = imageUrl;
      }
    }

    res.json({
      success: true,
      message: 'Bearing image uploaded successfully.',
      imageUrl
    });
  } catch (error) {
    next(error);
  }
};


