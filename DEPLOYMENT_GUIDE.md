# 🚀 Deploying DilJourney to Render

## Prerequisites
- GitHub, GitLab, or Bitbucket account
- Render account (sign up at render.com)

---

## Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Sign up for a free account
3. Create a free cluster:
   - Select **Free Tier** (M0)
   - Choose a cloud provider (AWS recommended)
   - Select a region closest to you
4. Create a database user:
   - Username: `diljourney`
   - Password: Generate a strong password (save this!)
5. Network Access:
   - Go to **Network Access** → **Add IP Address**
   - Select **Allow Access from Anywhere** (0.0.0.0/0)
6. Get connection string:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your actual password

---

## Step 2: Prepare Your Code

### 2.1 Create Production Build Script (Optional - for serving frontend)

Update `backend/server.js` to serve the frontend static files in production:

```javascript
const path = require('path');

// Add this after your routes
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../MOODIE')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../MOODIE/index.html'));
  });
}
```

### 2.2 Create a Render Spec File (Optional - for advanced config)

Create `render.yaml` in root:

```
yaml
services:
  - type: web
    name: diljourney-backend
    env: node
    region: oregCommand: cdon
    build backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: MONGO_URI
        fromSecret: MONGO_URI
      - key: JWT_SECRET
        fromSecret: JWT_SECRET
      - key: NODE_ENV
        value: production
```

---

## Step 3: Push Code to GitHub

1. Create a new repository on GitHub
2. Initialize and push your code:

```
bash
# In your project directory
git init
git add .
git commit -m "Initial commit - DilJourney app"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/diljourney.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `diljourney-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong random string (use openssl rand -base64 32)
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
6. Click **Create Web Service**

---

## Step 5: Update Frontend API Configuration

After deployment, update `MOODIE/js/api.js` to point to your live backend:

```
javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

Replace `https://your-backend-url.onrender.com` with your actual Render URL.

---

## Step 6: Deploy Frontend

### Option A: Deploy to Render (Static Site)
1. In Render Dashboard → **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `diljourney-frontend`
   - **Build Command**: (leave empty)
   - **Publish directory**: `MOODIE`
4. Click **Deploy Static Site**

### Option B: Deploy to Netlify (Alternative)
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your `MOODIE` folder
3. Update `api.js` with your Render backend URL

---

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB Atlas connection string | `mongodb+srv://diljourney:password@cluster.mongodb.net/diljourney?retryWrites=true&w=majority` |
| JWT_SECRET | Secret for JWT tokens | `your-secure-random-string` |
| NODE_ENV | Set to `production` | `production` |
| PORT | Server port (optional) | `5000` |
| CLIENT_URL | Your frontend URL | `https://your-frontend.onrender.com` |

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access allowed (0.0.0.0/0)
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] API_BASE_URL updated in frontend
- [ ] Frontend deployed
- [ ] Test the application!

---

## 🆘 Troubleshooting

### CORS Errors
If you get CORS errors, update `backend/server.js`:
```
javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-frontend.onrender.com',
  credentials: true,
}));
```

### Database Connection Issues
- Verify MONGO_URI is correct
- Check Network Access in MongoDB Atlas
- Ensure password doesn't contain special characters (or URL encode them)

### Build Failures
- Check Build Logs in Render
- Ensure all dependencies are in package.json

---

## 📝 Next Steps After Deployment

1. Test all API endpoints
2. Set up custom domain (optional)
3. Enable SSL/HTTPS (automatic on Render)
4. Monitor logs in Render dashboard
