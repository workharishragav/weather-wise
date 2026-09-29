# AI WeatherWise Backend — Project Documentation

## 1. Project Overview
AI WeatherWise is a RESTful backend that provides real-time weather information, AI-generated weather summaries, personalized weather/activity recommendations, secure authentication, and favorite-location management. The implementation is backend-only.

## 2. Objectives
- User registration and login
- JWT authentication and protected routes
- bcrypt password hashing
- Reader/admin role authorization
- Favorite location CRUD
- Live OpenWeatherMap weather data
- Gemini AI summaries and recommendations
- Fallback behavior when the Gemini API key is unavailable
- Request sanitization
- Centralized error handling
- Health/API verification
- Modular MVC-style organization

## 3. Technology Stack
| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| OpenWeatherMap | Live weather data |
| Google Gemini | AI weather insights |
| Axios | External HTTP requests |
| dotenv | Environment configuration |
| CORS | Cross-origin handling |
| Nodemon | Development utility |

## 4. Architecture
```text
Client / Thunder Client
        |
        v
    Express API
        |
    Middleware
   /    |     \
 Auth Sanitization Errors
        |
      Routes
        |
    Controllers
      /     \
 Services   Models
  /   \       |
Weather Gemini MongoDB
  |      |
OpenWeather Gemini API
```

The application entry point is `src/server.js`.

## 5. Database Design

### User
Fields:
- `_id`
- `name`
- `email`
- `password`
- `role`
- `isSuspended`

Roles are `reader` and `admin`. Passwords are protected from normal query output and hashed before storage.

### Location
Fields:
- `_id`
- `user`
- `city`
- `country`
- `createdAt`

Relationship:

```text
User 1 -------- * Location
```

One user can have multiple favorite locations.

## 6. API Endpoints

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

### AI
```http
POST /api/ai/weather-recommendation
```

Example request:
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

Administrator routes require authentication and the `admin` role.

## 7. Authentication and Authorization
The authentication flow is:

```text
Register -> Login -> JWT -> Bearer Token -> Protected Route
```

The authentication middleware verifies the JWT, loads the user, blocks suspended users, and applies admin authorization where required.

## 8. Password Security
Passwords are hashed using `bcryptjs`. Passwords are not exposed in normal user responses. Password changes require the current password before storing the new password.

## 9. AI Weather Features
Gemini provides:
1. A weather summary.
2. A personalized weather/activity recommendation.

When the Gemini API key is unavailable, the service returns a deterministic fallback summary and recommendation with `fallback: true`.

Gemini success was also verified with `fallback: false`.

## 10. Security
Implemented security controls include:
- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Suspended-account enforcement
- Protected routes
- Request sanitization
- ObjectId validation
- Centralized error handling
- Environment-based credentials
- Safe user responses without passwords

## 11. Testing and Verification
API verification was performed using Thunder Client.

| Feature | Result |
|---|---|
| Registration | Passed |
| Login + JWT | Passed |
| Protected profile | Passed |
| Reader/admin authorization | Passed |
| Favorite location CRUD | Passed |
| Live OpenWeatherMap data | Passed |
| Gemini AI generation | Passed |
| Gemini missing-key fallback | Passed |
| Admin listing/details | Passed |
| Admin suspension/enforcement | Passed |
| Admin unsuspension | Passed |
| Admin user deletion | Passed |
| Request sanitization | Passed |
| Invalid-ID error handling | Passed |
| Health endpoint | Passed |
| Profile retrieval | Passed |
| Password update | Passed |

### Verified live weather example
```json
{
  "success": true,
  "data": {
    "city": "Chennai",
    "temperature": 33.77,
    "humidity": 63,
    "windSpeed": 3.09,
    "condition": "Clouds",
    "feelsLike": 40.77,
    "isMock": false
  }
}
```

### Verified AI
Gemini returned a summary and recommendation with `fallback: false`.

### Verified fallback
Removing the Gemini key produced a successful response with `fallback: true`.

### Verified authorization
A reader attempting an admin-only endpoint received HTTP 403.

### Verified suspension
A suspended user's protected profile request received HTTP 403.

### Verified sanitization
An unexpected registration field was omitted from resulting user data.

### Verified error handling
An invalid administrator user ID produced a structured error response.

## 12. Project Structure
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

## 13. Setup

Install dependencies:
```bash
npm install
```

Create `.env` from `.env.example` and configure:
```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Never commit real credentials or the `.env` file.

Start:
```bash
npm start
```

Development:
```bash
npm run dev
```

## 14. API Testing
The project includes `postman_collection.json` and `TESTING.md`. Functional verification was performed through Thunder Client against the running backend.

## 15. Requirements Coverage
The implementation covers the WeatherWise-specific requirements for Node.js, Express.js, MongoDB/Mongoose, User and Location entities, JWT, bcrypt, favorite locations, OpenWeatherMap, Gemini, AI summaries, personalized recommendations, fallback behavior, protected routes, role authorization, sanitization, centralized errors, modular architecture, health verification, testing, and administrative user management.

Unrelated generic/template features are intentionally not documented as WeatherWise requirements.

## 16. Limitations
- Weather depends on OpenWeatherMap availability and credentials.
- AI depends on Gemini availability and credentials.
- The tested fallback specifically covers an unavailable/missing Gemini API key.
- External API responses can change independently of the application.
- No frontend is included in this backend project.

## 17. Conclusion
AI WeatherWise provides a modular authenticated backend for live weather services, favorite locations, and AI-assisted weather insights. The major authentication, authorization, database, weather, AI, fallback, security, administration, health, and error-handling features have been functionally verified.
