# AI WeatherWise — Backend Test Plan & Results

This document consolidates everything that was tested during backend
development (STEPs 3–10), and lays out exactly what remains to be verified
against a real MongoDB connection.

## How to read this document

- **PASS** = an assertion was actually executed against real code and its
  result checked programmatically. Nothing here is a claim without a test
  run behind it.
- **Mocked** items had one external dependency (MongoDB, OpenWeatherMap, or
  Gemini) replaced with a fake/injected version so the surrounding logic
  could be verified without network or database access, which this
  development environment does not have.
- **Live/unmocked** items were run as real HTTP requests against the fully
  assembled Express app on a real (ephemeral) port, or as direct calls
  against real, unmocked application code.
- **Requires real MongoDB** items could not be run at all in this
  environment and are your responsibility to verify locally — exact steps
  are given below.

---

## 1. Summary of automated results so far

| Step | Area | Tests | Result |
|---|---|---|---|
| 3 | MongoDB connection module (`connectDB`) | 3 (mocked `mongoose.connect`) | 3/3 PASS |
| 4 | User model (validation + bcrypt hashing) | 9 (schema validation live, bcrypt live) | 9/9 PASS |
| 5 | Auth (register/login/JWT middleware/adminOnly) | 16 (mocked User model, real bcrypt/JWT) | 16/16 PASS |
| 6 | Location model + favorite CRUD + ownership isolation | 14 (3 model validation live, 11 mocked DB) | 14/14 PASS |
| 7 | Weather service (fallback mode + OpenWeatherMap handling) | 10 (3 live fallback, 4 mocked axios, 3 mocked controller) | 10/10 PASS |
| 8 | Gemini AI insight service (fallback + parsing + error handling) | 14 (5 live fallback, 5 injected fake client, 4 mocked controller) | 14/14 PASS |
| 9 | Centralized error handling + request sanitization | 17 (all live, pure-function middleware) | 17/17 PASS |
| 10 | Full app integration (live HTTP, no DB routes) | 11 (live HTTP against real running app) | 11/11 PASS |
| — | Full regression re-run after the STEP 10 error-handler fix | 12 test files re-run | All clean |

**Total: 108/108 automated checks passed** across every part of the backend
that does not require a live MongoDB connection.

One real bug was found and fixed during this process (STEP 10): the
centralized error handler defaulted malformed-JSON request bodies to `500`
instead of `400`, because it only checked a pre-set response status, not
the error object's own status. This is fixed and covered by test 11 in the
STEP 10 integration suite ("LIVE malformed JSON body -> 400").

---

## 2. What could not be tested in this environment, and why

This backend was built in a sandboxed development container with:
- No MongoDB server available (not in Ubuntu's default apt repos; MongoDB's
  own repo and Atlas are both outside the container's network allowlist).
- No network access to `api.openweathermap.org` or
  `generativelanguage.googleapis.com` (Gemini).

Every external dependency was therefore either (a) tested through its real
code path when no network was needed (e.g. the fallback modes for weather
and AI, which are genuinely part of the codebase, not test scaffolding), or
(b) tested with the dependency mocked/injected, with the surrounding logic
(validation, error mapping, status codes, ownership checks) exercised for
real.

**Nothing below has been run against a real MongoDB instance:**
- User registration/login actually writing to and reading from a database
- The `unique: true` index on `email` and the compound unique index on
  `{user, city, country}` actually firing at the database level
- Favorite-location CRUD persisting across requests
- `server.js`'s full startup sequence (`connectDB()` → `app.listen()`)

---

## 3. Exact steps to run the MongoDB-dependent tests yourself

You said you'll put real credentials directly into your local `.env` rather
than pasting them here — that's the right call. Here's exactly what to do:

### 3.1 Get a MongoDB connection string
Either:
- **Local install**: install MongoDB Community Server for your OS, run
  `mongod`, and use `MONGO_URI=mongodb://127.0.0.1:27017/weatherwise`
  (this is already the fallback the code uses if `MONGO_URI` is unset), or
- **MongoDB Atlas** (free tier is fine): create a cluster, create a
  database user, allow your current IP in Network Access, and copy the
  connection string it gives you (`mongodb+srv://...`).

### 3.2 Fill in your local `.env`
Open the `.env` file in the project root (already scaffolded with the
right variable names) and fill in real values for:
```
MONGO_URI=<your real connection string>
JWT_SECRET=<any long random string>
OPENWEATHER_API_KEY=<your real OpenWeatherMap key, optional — fallback mode covers its absence>
GEMINI_API_KEY=<your real Gemini key, optional — fallback mode covers its absence>
```

### 3.3 Install dependencies and start the server
```bash
npm install
npm run dev
```
You should see:
```
MongoDB connected: <your-host>
AI WeatherWise server running on port 5000
```
If instead you see `MongoDB connection failed: ...` and the process exits,
your `MONGO_URI` or network access (e.g. Atlas IP allowlist) needs fixing
before anything else here will work.

### 3.4 Run the Postman collection against it
Import `postman_collection.json` (in the project root) into Postman. It's
organized into folders: **Health → Auth → Favorite Locations → Weather →
AI Insights → Error Handling**. Run it top-to-bottom within each folder —
requests are ordered so that `login`/`register` save a `{{token}}`
collection variable that later requests reuse automatically, and
`POST /api/locations` saves `{{locationId}}` for the update/delete tests
that follow it.

Specifically confirm these, which is the part I genuinely could not verify
for you:
- [ ] Register a user → check the user actually appears in your database
- [ ] Register the same email again → real `409` from MongoDB's own unique
      index, not just the application-level check
- [ ] Add the same favorite city twice for one user → real `409` from the
      compound unique index
- [ ] Add a favorite, restart the server, `GET /api/locations` again → the
      favorite is still there (proves real persistence, not an in-memory
      fluke)

### 3.5 A note on the two "requires real key" Postman requests
Two requests in the collection are only meaningful once you add real
external API keys:
- **`GET /api/weather/:city` (invalid city)** — with no `OPENWEATHER_API_KEY`,
  fallback mode returns `200` for any city name (by design, per the
  reference doc's resilience requirement). Add a real key to see the true
  `404` behavior for a nonexistent city.
- **`POST /api/ai/weather-recommendation`** — with no `GEMINI_API_KEY`, you'll get a
  rule-based fallback recommendation (`fallback: true` in the response).
  Add a real key to see actual Gemini-generated summaries.

---

## 4. Postman collection contents

`postman_collection.json` (project root) contains, organized by folder:

- **Health** — `GET /api/health`
- **Auth** — register (success, duplicate-email, missing-fields), login
  (success, wrong-password), a second user registration for ownership
  tests. The register test now also asserts the new user's `role` is
  `"reader"` by default.
- **Favorite Locations** — no-token rejection, add, duplicate-add
  rejection, list, update (own), update (other user's — expects `404`,
  proving ownership isolation), delete (own), delete-again (expects `404`)
- **User Profile** — no-token rejection, `GET /api/users/profile`
  (confirms `role` is present and `password` is never returned),
  `PUT /api/users/profile` (update name), an attempt to change `role`
  through this endpoint (expects `400`), and `PUT /api/users/password`
  (wrong current password → `401`, correct current password → `200`).
- **Admin** — no-token rejection (`401`), a `reader` token rejected with
  `403`, list users as admin (asserts no response ever contains a
  `password` field), a malformed `:id` rejected with `400`, suspend a
  user, and two "cannot act on self" checks (`400`) for both suspend and
  delete. **This folder needs an admin account and its token —
  see §5 below, since there is intentionally no API that lets a user
  promote themselves to admin.**
- **Weather** — valid city, invalid city, confirms no auth header is
  required
- **AI Insights** — no-token rejection, authenticated success, missing
  required fields
- **Error Handling** — unknown route → clean `404` JSON

Each request has embedded Postman test scripts (`pm.test`) that assert the
expected status code and response shape, so running the collection via
Postman's Collection Runner gives you a pass/fail report directly.

## 5. Seeding an admin account to test the Admin folder

By design, nobody can become `admin` through the API — `POST
/api/auth/register` always creates `reader` accounts, and
`PUT /api/users/profile` explicitly rejects any attempt to change `role`.
This is intentional (see FIX 3's security requirements), but it means the
**first** admin account has to be created directly in the database:

1. Register a normal account through `POST /api/auth/register` (or reuse
   one you already created).
2. Connect to your MongoDB instance (`mongosh` or MongoDB Compass) and
   flip that one document's role:
   ```js
   use weatherwise
   db.users.updateOne({ email: "your-admin@example.com" }, { $set: { role: "admin" } })
   ```
3. Log in again via `POST /api/auth/login` with that account to get a
   **fresh** JWT that carries `role: "admin"` (an old token issued before
   the DB edit still carries the old role in its payload, since JWTs are
   signed and not re-read from the DB on every request beyond the user
   lookup itself).
4. Paste that token into the collection's `adminToken` variable, and that
   same user's `_id` into `adminUserId` (used by the two "cannot act on
   self" tests).

## 6. What changed in this session (role/admin/profile fixes)

- `role` enum changed from `['user', 'admin']` / default `'user'` to
  `['reader', 'admin']` / default `'reader'`, per the reference
  document's ER-diagram field spec. Every other file already read
  `user.role` dynamically rather than hard-coding the string `'user'`,
  so this was a single-file model change plus the new tests above that
  assert it.
- Added `isSuspended` (boolean, default `false`) to the `User` model,
  since "suspend an account" was a stated Admin responsibility with no
  existing field to represent it. A suspended account is rejected at
  `POST /api/auth/login` (403) and by the `protect` middleware on every
  subsequent request (403), even with an otherwise-valid, unexpired JWT.
- Added `src/controllers/adminController.js` +
  `src/routes/adminRoutes.js`, mounted at `/api/admin`, guarded by
  `protect` + `adminOnly`: list users, get one user, delete a user,
  suspend/unsuspend a user. Admins cannot delete or suspend their own
  account through these routes (checked by comparing `req.user._id` to
  `:id`). All read paths rely on the `User` schema's existing
  `password: { select: false }`, so password hashes are never fetched
  in the first place, not just stripped after the fact.
- Added `src/controllers/userController.js` +
  `src/routes/userRoutes.js`, mounted at `/api/users`, guarded by
  `protect`: `GET /profile`, `PUT /profile` (name/email only — sending
  `role` or `password` is rejected with `400` rather than silently
  ignored), and `PUT /password` (requires the current password, bcrypt
  re-hashes the new one via the existing `pre('save')` hook).
  - **Known limitation, called out rather than silently skipped:** this
    architecture uses stateless JWTs with no session/blacklist store, so
    changing a password does not revoke any other still-unexpired token
    for that user (tokens simply expire after 7 days, per
    `generateToken`). Adding real revocation would need new
    infrastructure (a token-version field or a denylist) that doesn't
    exist anywhere else in this codebase, so it was flagged instead of
    invented.
- `package.json` — added `"multer": "^1.4.5-lts.1"` to satisfy the
  reference document's literal `npm install` line. **No upload route,
  controller, or middleware was added** — the reference document
  describes no file-upload feature anywhere in its coherent
  WeatherWise-specific sections, so wiring `multer` into an actual route
  would itself be an unrequested feature. `npm install` could not
  actually be re-run in the sandboxed environment this fix was made in
  (no network egress to the npm registry — confirmed, not assumed), so
  `package-lock.json` still needs a real `npm install` run on a machine
  with network access before this dependency is truly installed; see
  the exact command in the final chat response.
- All of the above was verified by two test scripts written this
  session (not committed to the repo, since no test framework/files
  existed here before): 47 mocked-dependency assertions exercising the
  real `User` model, `authMiddleware`, `authController`,
  `adminController`, and `userController` code paths (role default,
  enum rejection of the old `'user'` value, suspended-user rejection at
  both login and `protect`, self-delete/self-suspend blocking, ObjectId
  validation, role/password rejected on the profile endpoint, correct
  bcrypt re-hash flow), plus 14 live HTTP assertions against the real,
  running (but DB-less) Express app (health, weather fallback field
  names unchanged, all new/old protected routes correctly `401` with no
  token, unknown route `404`, malformed JSON `400`). 61/61 passed. As
  before, real MongoDB persistence for these new endpoints is still your
  responsibility to verify locally — this sandbox has no reachable
  MongoDB (independently reconfirmed this session: `ECONNREFUSED` on
  `127.0.0.1:27017`).
