# Agri365 API Server

REST API backend for the Agri365 agricultural management application.

## Features

- **Weather API** - Get current weather and forecasts
- **Market Prices** - Live agricultural commodity prices
- **Pest Identification** - Identify and get treatment for pests
- **Soil Testing** - Soil analysis and recommendations
- **Crop Health** - Diagnose crop health issues
- **Diagnostics** - System and sensor monitoring
- **Community** - Social features for farmers
- **Authentication** - User login and registration

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### General
- `GET /` - API information and available endpoints

### Weather
- `GET /api/weather?location=YourLocation` - Get weather data

### Market Prices
- `GET /api/market-prices` - Get current market prices

### Pest Management
- `GET /api/pests` - Get all pests in database
- `GET /api/pests/:id` - Get specific pest by ID
- `POST /api/pests/identify` - Identify pest from image
  ```json
  {
    "imageData": "base64_encoded_image"
  }
  ```

### Soil Testing
- `GET /api/soil-test` - Get sample soil test results
- `POST /api/soil-test` - Submit soil test
  ```json
  {
    "location": "Field A",
    "sampleData": {}
  }
  ```

### Crop Health
- `POST /api/crop-health` - Analyze crop health
  ```json
  {
    "cropType": "wheat",
    "symptoms": ["yellowing leaves", "wilting"]
  }
  ```

### Diagnostics
- `GET /api/diagnostics` - Get system diagnostics

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
  ```json
  {
    "title": "Post Title",
    "content": "Post content",
    "author": "Author Name"
  }
  ```

### Authentication
- `POST /api/auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/register` - User registration
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```

## Testing with cURL

### Get Weather
```bash
curl http://localhost:3000/api/weather
```

### Get Market Prices
```bash
curl http://localhost:3000/api/market-prices
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL to `http://localhost:3000`
3. Test each endpoint with appropriate request bodies

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=3000
NODE_ENV=development
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body-Parser** - Request body parsing
- **dotenv** - Environment configuration

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real weather API integration
- Machine learning for pest identification
- WebSocket support for real-time updates
- File upload for images
- JWT authentication
- Rate limiting
- API documentation with Swagger

## License

MIT
