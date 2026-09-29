# AI WeatherWise Backend

AI WeatherWise is a RESTful backend for real-time weather information, AI-generated weather summaries, personalized weather/activity recommendations, secure authentication, and favorite-location management.

## Features

- User registration and login
- JWT authentication
- bcrypt password hashing
- Reader and admin roles
- Protected routes
- Suspended-account enforcement
- Favorite location CRUD
- Live OpenWeatherMap weather data
- Gemini AI weather summaries and recommendations
- Fallback insight when the Gemini API key is unavailable
- Request sanitization
- Centralized error handling
- API health check
- Administrative user management

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- OpenWeatherMap API
- Google Gemini API
- Axios
- dotenv
- CORS

## Project Structure

```text
ai-weatherwise-backend/
├── .env.example
├── .gitignore
├── COMPLIANCE_AUDIT.md
├── README.md
├── TESTING.md
├── package.json
├── package-lock.json
├── postman_collection.json
└── src/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    └── server.js
```

## Requirements

Install:

- Node.js
- MongoDB
- OpenWeatherMap API key
- Gemini API key

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Required variables:

```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Do not commit the real `.env` file or API credentials.

## Run the Server

Start normally:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The API was verified during development on port `5000`.

## Main API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### User

```http
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password
```

### Favorite Locations

```http
POST /api/locations
GET /api/locations
PUT /api/locations/:id
DELETE /api/locations/:id
```

### Weather

```http
GET /api/weather/:city
```

### AI Weather Recommendation

```http
POST /api/ai/weather-recommendation
```

Example:

```json
{
  "city": "Chennai",
  "temperature": 30,
  "condition": "Clear"
}
```

### Health

```http
GET /api/health
```

### Administrator

```http
GET /api/admin/users
GET /api/admin/users/:id
DELETE /api/admin/users/:id
PUT /api/admin/users/:id/suspend
```

Administrator endpoints require an authenticated user with the `admin` role.

## Authentication

After login, the API returns a JWT. Send it to protected endpoints as:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend verifies the token, loads the user, and checks authorization requirements.

## AI and Fallback

Gemini is used to generate:

- Weather summaries
- Personalized weather/activity recommendations

If the Gemini API key is unavailable, the backend can return a fallback weather summary and recommendation instead of requiring the AI response to complete successfully.

## Security

The backend implements:

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Protected routes
- Suspended-user enforcement
- Request sanitization
- ObjectId validation
- Centralized error handling
- Environment-based secrets
- Password exclusion from normal user responses

## Testing

API testing was performed with Thunder Client.

Verified areas include:

- Registration
- Login and JWT authentication
- Profile retrieval
- Password update
- Favorite location CRUD
- Live OpenWeatherMap data
- Gemini AI generation
- Gemini missing-key fallback
- Admin authorization
- User suspension and enforcement
- Admin user deletion
- Request sanitization
- Invalid-ID error handling
- Health endpoint

The repository also contains:

- `TESTING.md`
- `postman_collection.json`
- `COMPLIANCE_AUDIT.md`

## Scope

This repository contains the WeatherWise backend/API implementation. Frontend functionality is outside the backend project scope.

Unrelated generic/template features are not included as WeatherWise requirements.

## Documentation

For detailed project information, see:

- `WEATHERWISE_PROJECT_DOCUMENTATION.md` — complete project documentation
- `TESTING.md` — API testing information
- `COMPLIANCE_AUDIT.md` — requirement coverage
- `postman_collection.json` — API collection

## License

ISC
