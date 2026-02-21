const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cache for market prices (refresh every 30 minutes)
let cachedPrices = null;
let lastPriceFetch = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Advanced Fuzzy Search Algorithm (Sørensen–Dice coefficient)
function getSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    s1 = s1.toLowerCase().replace(/[^a-z]/g, '');
    s2 = s2.toLowerCase().replace(/[^a-z]/g, '');
    if (s1 === s2) return 1;
    if (s1.length < 2 || s2.length < 2) return 0;

    let bigrams1 = new Set();
    for (let i = 0; i < s1.length - 1; i++) bigrams1.add(s1.substring(i, i + 2));
    let bigrams2 = new Set();
    for (let i = 0; i < s2.length - 1; i++) bigrams2.add(s2.substring(i, i + 2));

    let intersect = 0;
    for (let b of bigrams1) if (bigrams2.has(b)) intersect++;

    return (2.0 * intersect) / (bigrams1.size + bigrams2.size);
}

// Mock data for demonstration
const mockWeatherData = {
    location: "Ongole, Andhra Pradesh",
    current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: "Partly Cloudy",
        rainfall: 0
    },
    forecast: [
        { day: "Monday", temp: 29, condition: "Sunny", rainfall: 0 },
        { day: "Tuesday", temp: 27, condition: "Cloudy", rainfall: 5 },
        { day: "Wednesday", temp: 26, condition: "Rainy", rainfall: 15 },
        { day: "Thursday", temp: 28, condition: "Partly Cloudy", rainfall: 2 },
        { day: "Friday", temp: 30, condition: "Sunny", rainfall: 0 }
    ]
};

const mockMarketPrices = [
    { crop: "Wheat", price: 2500, unit: "per quintal", change: "+5%" },
    { crop: "Rice", price: 3200, unit: "per quintal", change: "+3%" },
    { crop: "Corn", price: 1800, unit: "per quintal", change: "-2%" },
    { crop: "Cotton", price: 6500, unit: "per quintal", change: "+8%" },
    { crop: "Sugarcane", price: 350, unit: "per quintal", change: "+1%" }
];

const mockPests = [
    {
        id: 1,
        name: "Aphids",
        description: "Small sap-sucking insects",
        treatment: "Use neem oil spray or insecticidal soap",
        severity: "Medium"
    },
    {
        id: 2,
        name: "Caterpillars",
        description: "Larvae that feed on leaves",
        treatment: "Apply Bacillus thuringiensis (Bt) or manual removal",
        severity: "High"
    },
    {
        id: 3,
        name: "Whiteflies",
        description: "Tiny white flying insects",
        treatment: "Use yellow sticky traps and neem oil",
        severity: "Medium"
    }
];

const mockMasterDatabase = [
    { type: 'disease', name: 'Late Blight', target: 'Tomato', info: 'Caused by Phytophthora infestans. Symptoms include dark spots on leaves.', rec: 'Use Metalaxyl-based fungicides.', tags: ['tomoto', 'blight', 'fungus'] },
    { type: 'disease', name: 'Early Blight', target: 'Tomato', info: 'Caused by Alternaria solani. Produces concentric rings on leaves.', rec: 'Apply Chlorothalonil sprays.', tags: ['tomato', 'leaves'] },
    { type: 'pest', name: 'Aphids', target: 'Universal', info: 'Small sap-sucking insects. Transmit plant viruses.', rec: 'Wash with high-pressure water or use Neem Oil.', tags: ['bugs', 'insects'] },
    { type: 'pest', name: 'Spider Mites', target: 'Universal', info: 'Tiny arachnids causing stippling on leaves.', rec: 'Increase humidity and use Abamectin.', tags: ['mites', 'webs'] },
    { type: 'crop', name: 'Wheat', info: 'Major cereal grain. Requires cool weather during tillering.', market: '₹2,500 per quintal' },
    { type: 'crop', name: 'Tomato', info: 'Widely grown fruit/vegetable. Susceptible to blights.', market: '₹20-30 per kg', tags: ['tomoto', 'tamatar'] },
    { type: 'crop', name: 'Rice', info: 'Staple food crop. Requires standing water.', market: '₹3,500 per quintal' },
    { type: 'crop', name: 'Maize', info: 'Versatile crop used for food, feed, and fuel.', market: '₹2,200 per quintal' }
];

const mockSoilData = {
    pH: 6.5,
    nitrogen: "Medium",
    phosphorus: "High",
    potassium: "Medium",
    organicMatter: "Good",
    recommendations: [
        "Maintain current pH levels",
        "Consider adding nitrogen-rich fertilizer",
        "Soil is well-balanced for most crops"
    ]
};

// API Routes

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Agri365 API Server',
        version: '1.0.0',
        endpoints: {
            weather: '/api/weather',
            marketPrices: '/api/market-prices',
            pests: '/api/pests',
            pestById: '/api/pests/:id',
            soilTest: '/api/soil-test',
            cropHealth: '/api/crop-health',
            diagnostics: '/api/diagnostics',
            community: '/api/community/posts',
            auth: '/api/auth/login'
        }
    });
});

// Weather API
app.get('/api/weather', (req, res) => {
    const { location } = req.query;
    res.json({
        success: true,
        data: {
            ...mockWeatherData,
            location: location || mockWeatherData.location
        }
    });
});

// Market Prices API
app.get('/api/market-prices', async (req, res) => {
    try {
        const { state = 'Andhra Pradesh', market = 'Ongole' } = req.query;
        
        // Check cache
        const now = Date.now();
        if (cachedPrices && lastPriceFetch && (now - lastPriceFetch) < CACHE_DURATION) {
            return res.json({
                success: true,
                data: cachedPrices,
                source: 'AGMARKNET API (Cached)',
                timestamp: new Date().toISOString(),
                cacheAge: Math.round((now - lastPriceFetch) / 1000) + ' seconds'
            });
        }

        // Fetch from AGMARKNET API (data.gov.in)
        const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
        const response = await axios.get(apiUrl, {
            params: {
                'api-key': 'undefined', // data.gov.in API doesn't require key for public datasets
                'format': 'json',
                'limit': 100,
                'filters[state]': state,
                'filters[market]': market
            },
            timeout: 10000
        });

        let prices = [];

        if (response.data && response.data.records) {
            prices = response.data.records.map(record => ({
                id: `${record.commodity}-${record.market}`,
                name: record.commodity || 'Unknown',
                market: record.market || market,
                state: record.state || state,
                minPrice: parseFloat(record.min_price) || 0,
                maxPrice: parseFloat(record.max_price) || 0,
                modalPrice: parseFloat(record.modal_price) || 0,
                avgPrice: (parseFloat(record.min_price) + parseFloat(record.max_price)) / 2 || 0,
                unit: '₹/kg',
                lastUpdated: record.arrival_date || new Date().toISOString(),
                trend: 'stable'
            }));
        }

        // Cache the results
        cachedPrices = prices;
        lastPriceFetch = now;

        res.json({
            success: true,
            data: prices.length > 0 ? prices : getMockPricesAsBackup(),
            source: prices.length > 0 ? 'AGMARKNET API (Real Data)' : 'Mock Data (API unavailable)',
            timestamp: new Date().toISOString(),
            recordCount: prices.length,
            filters: { state, market }
        });
    } catch (error) {
        console.error('Error fetching market prices from AGMARKNET:', error.message);
        
        // Return mock data as fallback
        res.json({
            success: true,
            data: getMockPricesAsBackup(),
            source: 'Mock Data (API Error)',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Helper function to get mock prices as backup
function getMockPricesAsBackup() {
    return [
        { id: '1', name: 'Rice (Basmati)', market: 'Ongole', state: 'Andhra Pradesh', minPrice: 72, maxPrice: 78, modalPrice: 75, avgPrice: 75, unit: '₹/kg', lastUpdated: new Date().toISOString(), trend: 'up' },
        { id: '2', name: 'Chillies (Dried)', market: 'Ongole', state: 'Andhra Pradesh', minPrice: 95, maxPrice: 102, modalPrice: 98, avgPrice: 98.5, unit: '₹/kg', lastUpdated: new Date().toISOString(), trend: 'up' },
        { id: '3', name: 'Turmeric', market: 'Ongole', state: 'Andhra Pradesh', minPrice: 62, maxPrice: 68, modalPrice: 65, avgPrice: 65, unit: '₹/kg', lastUpdated: new Date().toISOString(), trend: 'stable' },
        { id: '4', name: 'Cotton', market: 'Ongole', state: 'Andhra Pradesh', minPrice: 50, maxPrice: 55, modalPrice: 52, avgPrice: 52.5, unit: '₹/kg', lastUpdated: new Date().toISOString(), trend: 'up' },
        { id: '5', name: 'Groundnut', market: 'Ongole', state: 'Andhra Pradesh', minPrice: 65, maxPrice: 70, modalPrice: 67, avgPrice: 67.5, unit: '₹/kg', lastUpdated: new Date().toISOString(), trend: 'stable' }
    ];
}

// Get prices by commodity name
app.get('/api/market-prices/commodity/:name', async (req, res) => {
    try {
        const commodityName = req.params.name;
        const { state = 'Andhra Pradesh' } = req.query;

        const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
        const response = await axios.get(apiUrl, {
            params: {
                'api-key': 'undefined',
                'format': 'json',
                'limit': 100,
                'filters[state]': state,
                'filters[commodity]': commodityName
            },
            timeout: 10000
        });

        let prices = [];
        if (response.data && response.data.records) {
            prices = response.data.records.map(record => ({
                id: `${record.commodity}-${record.market}`,
                name: record.commodity || commodityName,
                market: record.market || 'Various',
                state: record.state || state,
                minPrice: parseFloat(record.min_price) || 0,
                maxPrice: parseFloat(record.max_price) || 0,
                modalPrice: parseFloat(record.modal_price) || 0,
                avgPrice: (parseFloat(record.min_price) + parseFloat(record.max_price)) / 2 || 0,
                unit: '₹/kg',
                lastUpdated: record.arrival_date || new Date().toISOString()
            }));
        }

        res.json({
            success: true,
            data: prices.length > 0 ? prices : [],
            source: prices.length > 0 ? 'AGMARKNET API' : 'No data',
            timestamp: new Date().toISOString(),
            commodity: commodityName,
            state
        });
    } catch (error) {
        console.error('Error fetching commodity prices:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch commodity prices',
            error: error.message
        });
    }
});

// Pest Identification API
app.get('/api/pests', (req, res) => {
    res.json({
        success: true,
        data: mockPests
    });
});

app.get('/api/pests/:id', (req, res) => {
    const pest = mockPests.find(p => p.id === parseInt(req.params.id));
    if (pest) {
        res.json({
            success: true,
            data: pest
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Pest not found'
        });
    }
});

// Advanced Fuzzy Search Endpoint
app.post('/api/search', (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: "Query required" });

    const q = query.toLowerCase();
    const results = mockMasterDatabase.map(item => {
        const score = Math.max(
            getSimilarity(q, item.name),
            getSimilarity(q, item.target || ""),
            ...(item.tags || []).map(t => getSimilarity(q, t))
        );
        return { ...item, score };
    })
        .filter(item => item.score > 0.25) // Threshold for "Best Algorithm"
        .sort((a, b) => b.score - a.score);

    res.json({
        success: true,
        data: results,
        algorithm: "Dice's Coefficient Fuzzy Search"
    });
});

// Pest identification by image (mock)
app.post('/api/pests/identify', (req, res) => {
    const { imageData, context } = req.body;

    // Intelligent Identification: Use context (like search query) to refine biological results
    let identifiedPest;
    if (context && context.toLowerCase().includes('tomato')) {
        identifiedPest = mockMasterDatabase.find(i => i.name === 'Late Blight');
    } else {
        identifiedPest = mockMasterDatabase.find(i => i.type === 'pest') || mockPests[0];
    }

    res.json({
        success: true,
        data: {
            identified: true,
            pest: identifiedPest,
            confidence: 0.94,
            location: "Ongole, Andhra Pradesh"
        }
    });
});

// Soil Test API
app.get('/api/soil-test', (req, res) => {
    res.json({
        success: true,
        data: mockSoilData
    });
});

app.post('/api/soil-test', (req, res) => {
    const { location, sampleData } = req.body;
    res.json({
        success: true,
        message: 'Soil test submitted successfully',
        data: {
            ...mockSoilData,
            location,
            testId: `ST-${Date.now()}`
        }
    });
});

// Crop Health API
app.post('/api/crop-health', (req, res) => {
    const { cropType, symptoms } = req.body;
    res.json({
        success: true,
        data: {
            cropType: cropType || 'Unknown',
            diagnosis: 'Possible nutrient deficiency',
            severity: 'Medium',
            recommendations: [
                'Apply balanced NPK fertilizer',
                'Ensure proper irrigation',
                'Monitor for pest activity',
                'Consider soil pH testing'
            ],
            treatmentPlan: 'Apply 10-10-10 fertilizer at recommended rates'
        }
    });
});

// Diagnostics API
app.get('/api/diagnostics', (req, res) => {
    res.json({
        success: true,
        data: {
            systemStatus: 'Operational',
            lastUpdate: new Date().toISOString(),
            sensors: [
                { name: 'Soil Moisture', status: 'Active', value: '45%' },
                { name: 'Temperature', status: 'Active', value: '28°C' },
                { name: 'Humidity', status: 'Active', value: '65%' }
            ]
        }
    });
});

// Community Posts API
app.get('/api/community/posts', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                author: 'Farmer John',
                title: 'Best practices for wheat cultivation',
                content: 'Here are some tips I learned over the years...',
                likes: 45,
                comments: 12,
                timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                author: 'AgriExpert',
                title: 'Dealing with drought conditions',
                content: 'Water conservation techniques that work...',
                likes: 78,
                comments: 23,
                timestamp: new Date(Date.now() - 172800000).toISOString()
            }
        ]
    });
});

app.post('/api/community/posts', (req, res) => {
    const { title, content, author } = req.body;
    res.json({
        success: true,
        message: 'Post created successfully',
        data: {
            id: Date.now(),
            title,
            content,
            author,
            likes: 0,
            comments: 0,
            timestamp: new Date().toISOString()
        }
    });
});

// Authentication API
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Mock authentication
    if (email && password) {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 1,
                    email: email,
                    name: 'Demo User',
                    role: 'farmer'
                }
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    if (email && password && name) {
        res.json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: Date.now(),
                    email,
                    name,
                    role: 'farmer'
                }
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          🌾 Agri365 API Server Running! 🌾               ║
║                                                           ║
║  Server: http://localhost:${PORT}                           ║
║  Status: ✅ Operational                                   ║
║                                                           ║
║  Available Endpoints:                                     ║
║  • GET  /                    - API Information            ║
║  • GET  /api/weather         - Weather Data               ║
║  • GET  /api/market-prices   - Market Prices              ║
║  • GET  /api/pests           - Pest Database              ║
║  • POST /api/pests/identify  - Identify Pest              ║
║  • GET  /api/soil-test       - Soil Test Results          ║
║  • POST /api/crop-health     - Crop Health Analysis       ║
║  • GET  /api/diagnostics     - System Diagnostics         ║
║  • GET  /api/community/posts - Community Posts            ║
║  • POST /api/auth/login      - User Login                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
