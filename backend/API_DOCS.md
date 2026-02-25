# 🌿 DilJourney API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require this header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Routes `/api/auth`

### Register
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, token, user }
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

### Get Current User
```
GET /api/auth/me          🔒 Protected
Response: { success, user }
```

### Logout
```
POST /api/auth/logout     🔒 Protected
Response: { success, message }
```

---

## 🏙️ Venue Routes `/api/venues`

### Get All Venues (with filters)
```
GET /api/venues?mood=romantic&city=Mumbai&category=cafe&priceRange=$$&page=1&limit=10
Response: { success, count, total, pages, venues[] }
```

### ⭐ Get Venues By Mood (Core DilJourney Route)
```
GET /api/venues/mood/:mood?city=Delhi&limit=12
Mood options: family | foodie | romantic | nature | lonely | club
Response: {
  success,
  mood,
  guide: { title, whatToDo, whatToSeek },   ← Activity & Seeking Guide
  count,
  venues[]
}
```

### Get Single Venue
```
GET /api/venues/:id
Response: { success, venue }
```

### Get All Cities
```
GET /api/venues/cities
Response: { success, cities[] }
```

### Create Venue (Admin)
```
POST /api/venues          🔒 Protected
Body: { name, description, moods[], moodScores, category, address, city, ambiance, priceRange, ... }
Response: { success, venue }
```

---

## 👤 Profile Routes `/api/profile` 🔒 All Protected

### Update Profile
```
PUT /api/profile/update
Body: { name?, bio?, city?, avatar?, favoriteMoods? }
Response: { success, user }
```

### Change Password
```
PUT /api/profile/change-password
Body: { currentPassword, newPassword }
Response: { success, message }
```

### Save a Venue
```
POST /api/profile/save-venue/:venueId
Response: { success, message, savedVenues[] }
```

### Remove Saved Venue
```
DELETE /api/profile/save-venue/:venueId
Response: { success, message, savedVenues[] }
```

### Get Saved Venues
```
GET /api/profile/saved-venues
Response: { success, count, savedVenues[] }
```

### Get My Reviews
```
GET /api/profile/my-reviews
Response: { success, count, reviews[] }
```

---

## ⭐ Review Routes `/api/reviews`

### Get Reviews for a Venue
```
GET /api/reviews/venue/:venueId?mood=romantic&page=1&limit=10
Response: { success, count, total, pages, reviews[] }
```

### Get Review Summary (Per Mood Breakdown)
```
GET /api/reviews/venue/:venueId/summary
Response: { success, summary: [{ _id: mood, count, avgRating, moodMatchCount }] }
```

### Add Review
```
POST /api/reviews/venue/:venueId    🔒 Protected
Body: { mood, rating (1-5), moodMatch (bool), title?, body, visitDate? }
Response: { success, review }
```

### Update Review
```
PUT /api/reviews/:reviewId          🔒 Protected (owner only)
Body: { rating?, moodMatch?, title?, body? }
Response: { success, review }
```

### Delete Review
```
DELETE /api/reviews/:reviewId       🔒 Protected (owner only)
Response: { success, message }
```

---

## 🖥️ Frontend Integration (Quick Start)

### 1. Register / Login
```js
// Register
const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
});
const { token, user } = await res.json();
localStorage.setItem('token', token);

// Login
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### 2. Make Authenticated Requests
```js
const token = localStorage.getItem('token');
const res = await fetch('/api/profile/saved-venues', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### 3. Mood-Based Venue Discovery (Core Feature)
```js
const mood = 'romantic';
const city = 'Mumbai';
const res = await fetch(`/api/venues/mood/${mood}?city=${city}`);
const { venues, guide } = await res.json();
// guide.whatToDo → show on UI
// guide.whatToSeek → show on UI
```
