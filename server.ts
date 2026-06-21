import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_BRANDS } from './src/data/bearingsData.js';
import { Product } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database initialized with default products
let productsDatabase: Product[] = [...INITIAL_PRODUCTS];

// In-Memory Database for Quotes & Logistics Tracking
let quotesDatabase: any[] = [
  {
    quoteId: "UE-885402",
    name: "Vikram Shah",
    companyName: "Reliance Industries Ltd",
    phone: "+91 98210 54102",
    email: "v.shah@ril.com",
    routing: "CRM",
    items: [
      { product: { partNumber: "16001JRX", brand: "NTN", price: 224, category: "Deep Groove Ball Bearings" }, quantity: 15 },
      { product: { partNumber: "16002JRX", brand: "NTN", price: 242, category: "Deep Groove Ball Bearings" }, quantity: 20 }
    ],
    status: "In Transit",
    statusTimeline: [
      { label: "Request Sourced", date: "Jun 18, 2026", done: true, desc: "Sourcing inquiry logged in Universal Enterprise CRM." },
      { label: "Technical Validation", date: "Jun 18, 2026", done: true, desc: "Tolerances and brand-crosses verified by Senior QA Inspector." },
      { label: "Custom Crating & Pack", date: "Jun 19, 2026", done: true, desc: "Export-grade double-layer timber crating applied for moisture protection." },
      { label: "Depot Dispatch", date: "Jun 20, 2026", done: true, desc: "Outbound clearance granted. Shipped via BlueDart Express (AWB #BD-884021)." },
      { label: "In Transit via Air Cargo", date: "Jun 21, 2026", done: true, desc: "Shipment arrived at regional cargo hub. Scheduled morning truck delivery." },
      { label: "Recipient Delivered", date: "", done: false, desc: "Awaiting final terminal gate manager signature." }
    ],
    updatedAt: "2026-06-21T02:30:11.000Z"
  },
  {
    quoteId: "UE-115049",
    name: "Arjun Mehta",
    companyName: "Mahindra & Mahindra Plant III",
    phone: "+91 97410 20384",
    email: "amehta@mahindra.com",
    routing: "WhatsApp",
    items: [
      { product: { partNumber: "HSR20A", brand: "THK", price: 6400, category: "THK Linear Motion Guides" }, quantity: 4 }
    ],
    status: "Custom Crating",
    statusTimeline: [
      { label: "Request Sourced", date: "Jun 20, 2026", done: true, desc: "Inquiry generated and dynamic WhatsApp routing agent assigned." },
      { label: "Technical Validation", date: "Jun 20, 2026", done: true, desc: "Pre-lubrication heavy load profile matched to M&M plant spec sheet." },
      { label: "Custom Crating & Pack", date: "Jun 21, 2026", done: true, desc: "Heavy-duty shock-absorbent vacuum palletizing verified." },
      { label: "Depot Dispatch", date: "", done: false, desc: "Awaiting road safety clearance permit corridors." },
      { label: "In Transit via Air Cargo", date: "", done: false, desc: "" },
      { label: "Recipient Delivered", date: "", done: false, desc: "" }
    ],
    updatedAt: "2026-06-21T05:15:22.000Z"
  }
];

// Initialize Gemini client lazily to handle missing API keys gracefully
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: GEMINI_API_KEY is not defined. AI Chatbot features will use simulated backup responses.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// PRODUCT CATALOG ENDPOINTS
// ----------------------------------------------------

// Get brand lists
app.get('/api/brands', (req, res) => {
  res.json(INITIAL_BRANDS);
});

// Search & filter products with pagination
app.get('/api/products', (req, res) => {
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
      sort = 'partNumber-asc', // price-asc, price-desc, partNumber-asc
      page = '1',
      limit = '10'
    } = req.query;

    let filtered = [...productsDatabase];

    // Filter by text query using advanced matches
    if (query) {
      const q = String(query).toLowerCase().trim();
      filtered = filtered.filter((p) => {
        let valueToSearch = '';
        if (field === 'partNumber') valueToSearch = p.partNumber.toLowerCase();
        else if (field === 'name') valueToSearch = p.name.toLowerCase();
        else if (field === 'brand') valueToSearch = p.brand.toLowerCase();
        else if (field === 'series') {
          // Series is usually numeric part of part number or first few letters
          const match = p.partNumber.match(/[a-zA-Z]+|\d+/g);
          valueToSearch = match ? match[0].toLowerCase() : p.partNumber.toLowerCase();
        } else {
          // Match any field
          valueToSearch = `${p.partNumber} ${p.name} ${p.brand} ${p.category}`.toLowerCase();
        }

        if (matchType === 'exact') {
          return valueToSearch === q;
        } else if (matchType === 'startsWith') {
          return valueToSearch.startsWith(q);
        } else {
          return valueToSearch.includes(q);
        }
      });
    }

    // Category filter
    if (category) {
      const cat = String(category).toLowerCase();
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(cat) || cat.includes(p.category.toLowerCase()));
    }

    // Brand filter
    if (brand) {
      const cleanBrand = (b: string) => b.replace(/\s*\(\d+\)\s*$/, '').trim().toLowerCase();
      const bName = cleanBrand(String(brand));
      filtered = filtered.filter((p) => cleanBrand(p.brand) === bName);
    }

    // Inner Diameter (Inner Bore) Range
    if (idMin) {
      filtered = filtered.filter((p) => p.innerDiameter >= parseFloat(String(idMin)));
    }
    if (idMax) {
      filtered = filtered.filter((p) => p.innerDiameter <= parseFloat(String(idMax)));
    }

    // Outer Diameter Range
    if (odMin) {
      filtered = filtered.filter((p) => p.outerDiameter >= parseFloat(String(odMin)));
    }
    if (odMax) {
      filtered = filtered.filter((p) => p.outerDiameter <= parseFloat(String(odMax)));
    }

    // Width Range
    if (wMin) {
      filtered = filtered.filter((p) => p.width >= parseFloat(String(wMin)));
    }
    if (wMax) {
      filtered = filtered.filter((p) => p.width <= parseFloat(String(wMax)));
    }

    // Material
    if (material) {
      filtered = filtered.filter((p) => p.material.toLowerCase() === String(material).toLowerCase());
    }

    // Seal Type
    if (sealType) {
      filtered = filtered.filter((p) => p.sealType.toLowerCase().includes(String(sealType).toLowerCase()));
    }

    // Cage Type
    if (cageType) {
      filtered = filtered.filter((p) => p.cageType.toLowerCase().includes(String(cageType).toLowerCase()));
    }

    // Stock status
    if (stockStatus) {
      filtered = filtered.filter((p) => p.stockStatus.toLowerCase() === String(stockStatus).toLowerCase());
    }

    // Price range
    if (priceMin) {
      filtered = filtered.filter((p) => p.price >= parseFloat(String(priceMin)));
    }
    if (priceMax) {
      filtered = filtered.filter((p) => p.price <= parseFloat(String(priceMax)));
    }

    // Country of Origin
    if (origin) {
      filtered = filtered.filter((p) => p.countryOfOrigin.toLowerCase() === String(origin).toLowerCase());
    }

    // Sort order
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'partNumber-asc') {
      filtered.sort((a, b) => a.partNumber.localeCompare(b.partNumber));
    } else if (sort === 'partNumber-desc') {
      filtered.sort((a, b) => b.partNumber.localeCompare(a.partNumber));
    }

    // Paginate results
    const pNum = parseInt(String(page)) || 1;
    const limitNum = parseInt(String(limit)) || 10;
    const startIndex = (pNum - 1) * limitNum;
    const paginatedItems = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      total: filtered.length,
      page: pNum,
      limit: limitNum,
      totalPages: Math.ceil(filtered.length / limitNum),
      items: paginatedItems
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Autocomplete recommendations
app.get('/api/products/suggestions', (req, res) => {
  const q = String(req.query.query || '').toLowerCase().trim();
  if (!q) {
    return res.json([]);
  }

  // Find matches of partNumber or brand
  const suggestions = productsDatabase
    .filter((p) => p.partNumber.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .slice(0, 10)
    .map((p) => ({
      partNumber: p.partNumber,
      brand: p.brand,
      name: p.name,
      category: p.category
    }));

  res.json(suggestions);
});

// ----------------------------------------------------
// BULK DOCUMENT UPLOAD / DATABASE IN-MEMORY UPDATES
// ----------------------------------------------------
app.post('/api/products/upload', (req, res) => {
  try {
    const { csvText } = req.body;
    if (!csvText || typeof csvText !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid file layout' });
    }

    // Parse simple CSV / multi-line format
    // E.g.
    // PartNumber,Brand,Category,Price,InnerDiameter,OuterDiameter,Width,StockStatus,Origin
    // or direct format: "16001JRX - ₹224"
    const lines = csvText.split('\n').filter((l) => l.trim() !== '');
    let addedCount = 0;
    let errors: string[] = [];

    lines.forEach((line) => {
      try {
        // Option 1: PartNumber - ₹Value pair format
        if (line.includes(' - ₹') || line.includes(' - ')) {
          const parts = line.split(/-|₹|Rs/);
          const rawPart = parts[0].trim();
          const rawPrice = parseFloat(parts[parts.length - 1].replace(/[^0-9.]/g, ''));
          
          if (rawPart && !isNaN(rawPrice)) {
            // Find if exists
            const existing = productsDatabase.find((p) => p.partNumber.toLowerCase() === rawPart.toLowerCase());
            if (existing) {
              existing.price = rawPrice;
              existing.stockStatus = 'Available';
            } else {
              productsDatabase.unshift({
                id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                partNumber: rawPart.toUpperCase(),
                name: `Deep Groove Bearing ${rawPart.toUpperCase()}`,
                brand: 'NTN', // Default to NTN for short lists, as specified in prompt
                category: 'Deep Groove Ball Bearings',
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
                loadRating: 'Dynamic: 11.2 kN',
                speedRating: '10,000 RPM',
                countryOfOrigin: 'Japan',
                application: 'General Industrial Sourcing'
              });
            }
            addedCount++;
          }
        } else if (line.includes(',') || line.includes(';')) {
          // Option 2: Full CSV format
          const separator = line.includes(',') ? ',' : ';';
          const cols = line.split(separator).map(c => c.trim().replace(/^["']|["']$/g, ''));
          
          // Skip headers
          if (cols[0].toLowerCase() === 'partnumber' || cols[0].toLowerCase() === 'product number') {
            return;
          }

          const partNumber = cols[0];
          const brand = cols[1] || 'NTN';
          const category = cols[2] || 'Deep Groove Ball Bearings';
          const price = parseFloat(cols[3]) || 500;
          const stock = cols[4] || 'Available';
          
          if (partNumber) {
            const existing = productsDatabase.find((p) => p.partNumber.toLowerCase() === partNumber.toLowerCase());
            if (existing) {
              existing.brand = brand;
              existing.category = category;
              existing.price = price;
              existing.stockStatus = stock as any;
            } else {
              productsDatabase.unshift({
                id: `uploaded-csv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                partNumber: partNumber.toUpperCase(),
                name: `${brand} ${partNumber} Bearings`,
                brand: brand,
                category: category,
                price: price,
                stockStatus: stock as any,
                stockCount: 100,
                weight: cols[5] || '0.25kg',
                innerDiameter: parseFloat(cols[6]) || 20,
                outerDiameter: parseFloat(cols[7]) || 47,
                width: parseFloat(cols[8]) || 14,
                material: cols[9] || 'Chrome Steel',
                sealType: cols[10] || 'Open',
                cageType: cols[11] || 'Pressed Steel',
                loadRating: 'Dynamic: 12.8 kN',
                speedRating: '8,500 RPM',
                countryOfOrigin: cols[12] || 'Japan',
                application: 'Sourced Industrial Machinery'
              });
            }
            addedCount++;
          }
        }
      } catch (err: any) {
        errors.push(err.message);
      }
    });

    res.json({
      success: true,
      addedCount,
      errors,
      totalCount: productsDatabase.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// AI CHATBOT ENDPOINT USING THE MODERN @google/genai SDK
// ----------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [] } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Please send message threads.' });
    }

    // Grab the last message to pre-process matching products to inject as grounding
    const lastUserMessage = messages[messages.length - 1]?.text || '';
    
    // Find any mentions of part numbers in the database
    const relatedProducts = productsDatabase.filter((p) => {
      const partWord = p.partNumber.toLowerCase();
      // Look for part number matched as a whole token or exact matches
      return lastUserMessage.toLowerCase().includes(partWord);
    });

    // Pick top catalog samples to keep Gemini grounded on exact products & equivalents
    const databaseSample = productsDatabase.slice(0, 15).map(p => ({
      partNumber: p.partNumber,
      brand: p.brand,
      category: p.category,
      price: `₹${p.price}`,
      stock: p.stockStatus,
      weight: p.weight,
      dimensions: `ID:${p.innerDiameter}mm, OD:${p.outerDiameter}mm, W:${p.width}mm`,
      equivalents: p.equivalentProducts?.map(eq => `${eq.brand} ${eq.partNumber} (₹${eq.price})`).join(', ') || 'None'
    }));

    // Formulate a robust bearing expert system instruction
    const systemInstruction = `
You are the elite AI Assistant for "UNIVERSAL ENTERPRISE" (https://www.ue-asia.com), a top-tier industrial bearings distributor. We are authorized suppliers for NTN, NSK, THK, and other global power brands.
Your purpose is to assist procurement heads, factory managers, and engineers with technical consultation, catalog search, parts replacement lookup, and instant quotation.

--- CORE BUSINESS INFORMATION ---
Company Name: UNIVERSAL ENTERPRISE
Website: https://www.ue-asia.com
Tagline: "Precision Bearings. Trusted Industrial Solutions."
Authorized Brands: NSK, THK, NTN, SKF, FAG, TIMKEN, KOYO, NACHI, FYH, IKO, HIWIN.
Industry Sectors Served: Manufacturing, Automotive, Steel, Textile, Packaging, Food Processing, Automation, Heavy Engineering, Power Plants, Mining.
Contact Email: sales@ntnbearing.in
Contact Phone: +91 44 6686 7700
Office Locations:
- Chennai (Head Office): Polyhose Tower, Mount Road, Guindy, Chennai 600032
- Mumbai: Unit No 1104, DLH Park, S V Road, Goregaon West, Mumbai 400062
- Delhi: 904, 9th Floor, International Trade Tower, Nehru Place, New Delhi 110019
- Kolkata: Unit No 13, 7th Floor, Acropolis Office Complex, Kolkata 700107

--- DYNAMIC REAL-TIME BEARING INVENTORY CONTEXT ---
Here is our actual real-time bearing catalog sample:
${JSON.stringify(databaseSample, null, 2)}

--- PRE-MATCHED USER SPECIFIC BEARING INVENTORY INJECTED ---
User queries about the following bearing(s):
${JSON.stringify(relatedProducts, null, 2)}

--- CHATBOT BEHAVIORS ---
1. PRODUCT AVAILABILITY: If the user asks about deep groove bearings like NTN 16001JRX or 16002 up to 16032, check the list. Affirm that we distribute these items, quote the exact listed price in Indian Rupees (₹), and state their stock availability.
2. EQUIVALENT SEARCH: Always offer matching equivalents for competitors. E.g. If user asks "Do you have NTN 16001JRX?", offer "Yes! Price is ₹224. We also have NSK 16001 (₹245) or SKF 16001 (₹290) as premium equivalents!"
3. INTERACTIVE QUOTE LIST: Encourage them to use our on-screen "Request Quote" sidebar, add products to their quote cart, and click "Submit Quote" to trigger automated dispatch to our sales team.
4. GREETINGS & EXPORTS: Keep answers objective, highly technical, structured, and helpful. Use bullet points for specs!
`;

    const client = getGeminiClient();

    if (!client) {
      // API Key missing fallback simulation
      // Parse last word or query to give simulated smart responses
      let replyText = `Thanks for contacting Universal Enterprise sales block. `;
      if (lastUserMessage.toUpperCase().includes('16001')) {
        replyText += `Yes, we have NTN 16001JRX available for ₹224. Premium alternative equivalents include NSK 16001 (₹245) and SKF 16001 (₹290) in stock. Would you like to request a quotation?`;
      } else if (lastUserMessage.toUpperCase().includes('THK') || lastUserMessage.toUpperCase().includes('SCREW')) {
        replyText += `We have THK Precision Linear Motion products in stock, including the HSR20A linear guides and BNK1208 ball screws (₹9,400). Would you like specification sheets?`;
      } else {
        replyText += `I am the Universal Enterprise AI Sourcing Assistant. I can recommend equivalent bearings, check stock parameters for NTN 16001JRX to 16032, and generate quotations. Call us at +91 44 6686 7700 or email sales@ntnbearing.in.`;
      }
      return res.json({ text: replyText, preMatchedProducts: relatedProducts });
    }

    // Format chat messages thread for Gemini API schema
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Generate output utilizing gemini-3.5-flash
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      text: response.text,
      preMatchedProducts: relatedProducts
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to retrieve AI advice. ' + error.message });
  }
});

// ----------------------------------------------------
// QUOTE AND SALES LOGIC API WITH TRACKING PATHS
// ----------------------------------------------------
app.post('/api/quote', (req, res) => {
  try {
    const { name, companyName, phone, email, productRequirements, message, items, routing } = req.body;
    
    // Create random 6 digit numeric code
    const quoteId = `UE-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const newQuoteRecord = {
      quoteId,
      name,
      companyName,
      phone,
      email,
      routing: routing || "CRM",
      items: items || [],
      status: "Technical Validation",
      statusTimeline: [
        { label: "Request Sourced", date: formattedDate, done: true, desc: "Inquiry generated and corporate engineering assignment complete." },
        { label: "Technical Validation", date: formattedDate, done: true, desc: "Pristine tolerances and competitor brand cross-equivalents verified successfully." },
        { label: "Custom Crating & Pack", date: "", done: false, desc: "Heavy-duty anti-shock palletized packaging scheduled." },
        { label: "Depot Dispatch", date: "", done: false, desc: "Awaiting final terminal gate logistics routing permits." },
        { label: "In Transit via Air Cargo", date: "", done: false, desc: "Scheduled dispatch via regional freight carrier." },
        { label: "Recipient Delivered", date: "", done: false, desc: "Awaiting recipient yard manager seal verification." }
      ],
      updatedAt: new Date().toISOString()
    };
    
    quotesDatabase.push(newQuoteRecord);
    
    // Return a structured professional quotation invoice block
    res.json({
      success: true,
      quoteId,
      submissionDate: formattedDate,
      estimatedResponseTime: 'Within 2 hours',
      salesOfficer: 'Universal Enterprise Sourcing Desk',
      summary: `Your quote inquiry ${quoteId} has been submitted to the engineering desk at ${email}. This request contains ${items?.length || 0} unique items.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get quotation tracking details
app.get('/api/quote/:id', (req, res) => {
  try {
    const { id } = req.params;
    const quote = quotesDatabase.find((q) => q.quoteId.toLowerCase() === id.trim().toLowerCase());
    if (!quote) {
      return res.status(404).json({ error: `Quotation/Order reference '${id}' not found. Please try a valid pre-seeded ID like 'UE-885402' or submit a quote first to track.` });
    }
    res.json(quote);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Search quotations by email address
app.get('/api/quotes/by-email', (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }
    const matches = quotesDatabase.filter((q) => q.email.trim().toLowerCase() === email);
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// DEV / PRODUCTION STATIC BUILD ROUTING
// ----------------------------------------------------
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Integrate Vite in development mode as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Universal Enterprise server running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch(err => {
  console.error('Failing to start Express server:', err);
});
