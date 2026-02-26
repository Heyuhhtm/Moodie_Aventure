# DilJourney - Project TODO

## ✅ Completed Tasks

### Backend Setup
- [x] Set up Express server with MongoDB/Mongoose
- [x] Create environment configuration (.env)
- [x] Implement authentication (register, login, JWT)
- [x] Create venue CRUD operations
- [x] Implement profile management
- [x] Create review system
- [x] Add seed data for venues

### Frontend Refactoring
- [x] Consolidate form handling in js/auth.js
- [x] Remove duplicate mobile menu code from script.js
- [x] Fix dashboard.html syntax errors
- [x] Consolidate auth checking in dashboard and venues pages
- [x] Improve API service error handling

### Code Quality
- [x] Remove duplicate code patterns
- [x] Fix HTML syntax errors
- [x] Improve code organization

### Testing (NEW!)
- [x] Set up Jest testing framework
- [x] Create auth tests (register, login, protected routes)
- [x] Create venue tests (get venues, get by mood, filtering)
- [x] **All 23 tests passing**

### Deployment Prep (NEW!)
- [x] Update server.js for production (static file serving)
- [x] Configure CORS for production
- [x] Add environment-based configuration
- [x] Create .env.example for deployment

---

## 📋 Deployment Steps

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- GitHub/GitLab account

### Quick Deploy to Render

1. **Push code to GitHub:**
```
bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create MongoDB Atlas cluster:**
   - Sign up at mongodb.com/atlas
   - Create free M0 cluster
   - Create database user
   - Allow network access from anywhere (`0.0.0.0/0`). **Note:** For a real production application, it's more secure to restrict this to your backend's IP address once it's deployed.
   - Get connection string

3. **Deploy Backend to Render:**
   - Go to render.com
   - Create Web Service
   - Connect GitHub repo
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Set environment variables:
     - `MONGO_URI`: Your Atlas connection string
     - `JWT_SECRET`: Generate a secure random string
     - `NODE_ENV`: `production`
   - After deploying, note your backend service URL (e.g., `https://diljourney-backend.onrender.com`).

4. **Configure and Push Frontend:**
   - In `MOODIE/js/config.js`, update the `apiUrl` to point to your deployed backend URL's API.
   - Example: `const apiUrl = 'https://diljourney-backend.onrender.com/api';`
   - Save the change, then commit and push it to GitHub.

5. **Deploy Frontend (Choose one):**
   - **Option A: Render Static Site**
     - Connect the same GitHub repo.
     - Set the **Root Directory** to `MOODIE`.
   - **Option B: Netlify**
     - Simply drag and drop your local `MOODIE` folder into the Netlify deploy section.

---

## 🧪 Running Tests

```
bash
# Run all tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

---

## 📁 Project Structure

```
DilJourney/
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── venueController.js
│   │   ├── profileController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── Venue.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── venues.js
│   │   ├── profile.js
│   │   └── reviews.js
│   ├── tests/
│   │   ├── setup.js        # Test database setup
│   │   ├── auth.test.js
│   │   └── venues.test.js
│   ├── server.js           # Express app
│   ├── seed.js             # Seed data
│   ├── jest.config.js
│   └── package.json
│
├── MOODIE/
│   ├── index.html          # Landing page
│   ├── dashboard.html      # User dashboard
│   ├── venues.html         # Browse venues
│   ├── account.html        # Account settings
│   ├── Explore.html        # Mood exploration
│   ├── script.js           # Frontend utilities
│   ├── style.css
│   └── js/
│       ├── api.js          # API service
│       ├── auth.js         # Auth handling
│       └── config.js
│
├── DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register a new user. | No |
| POST | /api/auth/login | Login a user and get a token. | No |
| GET | /api/auth/me | Get current authenticated user's data. | Yes |
| GET | /api/venues | Get all venues (with optional filters). | No |
| GET | /api/venues/cities | Get a list of unique city names. | No |
| GET | /api/venues/mood/:mood | Get venues filtered by a specific mood. | No |
| GET | /api/venues/:id | Get a single venue by its ID. | No |
| PUT | /api/profile | Update the authenticated user's profile. | Yes |
| GET | /api/profile/saved-venues | Get all saved venues for the current user. | Yes |
| POST | /api/profile/save-venue | Save a venue to the user's profile. | Yes |
| DELETE | /api/profile/saved-venues/:venueId | Unsave a venue from the user's profile. | Yes |
| GET | /api/reviews/venue/:venueId | Get all reviews for a specific venue. | No |
| POST | /api/reviews | Create a new review for a venue. | Yes |
