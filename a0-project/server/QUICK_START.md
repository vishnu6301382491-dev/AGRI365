# 🌾 Agri365 API Server - Successfully Running!

## ✅ Status: OPERATIONAL

Your REST API server is now running on **http://localhost:3000**

---

## 🚀 Quick Start

### Access the Interactive API Interface
Open in your browser: `d:\agri365\a0-project\server\api-interface.html`

This provides a beautiful web interface where you can:
- View all available endpoints
- Test each endpoint with one click
- See real-time responses
- Copy endpoint URLs

---

## 📡 Available API Endpoints

### 1. **General Information**
```
GET http://localhost:3000/
```
Returns API information and all available endpoints

### 2. **Weather Forecast**
```
GET http://localhost:3000/api/weather
GET http://localhost:3000/api/weather?location=YourLocation
```
Get current weather and 5-day forecast

### 3. **Market Prices**
```
GET http://localhost:3000/api/market-prices
```
Get current agricultural commodity prices

### 4. **Pest Management**
```
GET  http://localhost:3000/api/pests
GET  http://localhost:3000/api/pests/1
POST http://localhost:3000/api/pests/identify
```
Pest database and identification

### 5. **Soil Testing**
```
GET  http://localhost:3000/api/soil-test
POST http://localhost:3000/api/soil-test
```
Soil analysis and recommendations

### 6. **Crop Health**
```
POST http://localhost:3000/api/crop-health
```
Analyze crop health issues

### 7. **System Diagnostics**
```
GET http://localhost:3000/api/diagnostics
```
System status and sensor data

### 8. **Community**
```
GET  http://localhost:3000/api/community/posts
POST http://localhost:3000/api/community/posts
```
Farmer community posts

### 9. **Authentication**
```
POST http://localhost:3000/api/auth/login
POST http://localhost:3000/api/auth/register
```
User authentication

---

## 🧪 Testing Examples

### Using PowerShell:
```powershell
# Get weather data
Invoke-WebRequest -Uri http://localhost:3000/api/weather -UseBasicParsing

# Get market prices
Invoke-WebRequest -Uri http://localhost:3000/api/market-prices -UseBasicParsing

# Login (POST request)
$body = @{
    email = "demo@agri365.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/auth/login `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

### Using cURL:
```bash
# Get weather
curl http://localhost:3000/api/weather

# Get market prices
curl http://localhost:3000/api/market-prices

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@agri365.com","password":"password123"}'
```

### Using JavaScript/Fetch:
```javascript
// Get weather data
fetch('http://localhost:3000/api/weather')
  .then(response => response.json())
  .then(data => console.log(data));

// Login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'demo@agri365.com',
    password: 'password123'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response:
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔧 Server Management

### Start the server:
```bash
cd d:\agri365\a0-project\server
npm start
```

### Development mode (with auto-reload):
```bash
npm run dev
```

### Stop the server:
Press `Ctrl + C` in the terminal

---

## 📁 Project Structure

```
server/
├── server.js           # Main API server
├── package.json        # Dependencies
├── .env               # Environment variables
├── api-interface.html # Interactive API testing UI
└── README.md          # Documentation
```

---

## 🎯 Integration with Mobile App

To connect your React Native app to this API:

1. Update your API base URL in the mobile app:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

2. For testing on physical device, use your computer's IP:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000';
```

3. Make API calls:
```javascript
const getWeather = async () => {
  const response = await fetch(`${API_BASE_URL}/api/weather`);
  const data = await response.json();
  return data;
};
```

---

## 🌟 Features

✅ RESTful API architecture
✅ CORS enabled for cross-origin requests
✅ JSON request/response format
✅ Mock data for all endpoints
✅ Error handling
✅ Interactive testing interface
✅ Comprehensive documentation

---

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real weather API integration
- [ ] JWT authentication
- [ ] File upload for images
- [ ] WebSocket for real-time updates
- [ ] Rate limiting
- [ ] API versioning
- [ ] Swagger/OpenAPI documentation
- [ ] Unit tests
- [ ] Docker containerization

---

## 📞 Support

For issues or questions:
- Check the console for error messages
- Ensure the server is running on port 3000
- Verify no other service is using port 3000

---

**🎉 Your API server is ready to use!**

Access the interactive interface at: `api-interface.html`
