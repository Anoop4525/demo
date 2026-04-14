# Vercel Deployment Guide

## Setup Instructions

### 1. Prerequisites
- GitHub account with your repository
- Vercel account (create at https://vercel.com)
- MongoDB Atlas account for database (or another MongoDB provider)

### 2. Environment Variables Setup on Vercel

Add these environment variables in your Vercel project settings:

#### Backend Variables (Server Project)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

#### Frontend Variables (Client Project)
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

### 3. Deployment Steps

#### Option A: Monorepo Deployment (Recommended)
Deploy the entire project as a monorepo from root:

1. Push your code to GitHub
2. Go to https://vercel.com/import
3. Select your GitHub repository
4. Import the project
5. Framework preset: Other
6. Root directory: ./
7. Build command: Leave empty (use default)
8. Output directory: ./client/dist (for root vercel.json)
9. Add all environment variables
10. Deploy!

#### Option B: Separate Deployments
Deploy backend and frontend separately:

**Backend Deployment:**
1. Create new Vercel project from `/server` directory
2. Set environment variables
3. Ensure vercel.json is in `/server` directory
4. Deploy

**Frontend Deployment:**
1. Create new Vercel project from `/client` directory
2. Set VITE_API_URL to your backend URL
3. Deploy

### 4. Post-Deployment

- Test the `/health` endpoint: `https://your-backend-domain.vercel.app/health`
- Test API endpoints with your frontend URL
- Check Vercel logs if issues occur: `vercel logs`

### 5. Troubleshooting

**CORS Issues:**
- Update `FRONTEND_URL` in backend environment variables

**API Endpoint Not Found:**
- Verify `VITE_API_URL` is correct in frontend
- Check backend routes in `/server/routes/`

**Database Connection Failed:**
- Verify `MONGODB_URI` is correct
- Add Vercel IP to MongoDB Atlas whitelist

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify `vite.config.js` includes React plugin

### Local Testing Before Deployment

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Build frontend
cd ../client && npm run build

# Test backend
cd ../server && npm run dev

# Test with environment variables
VITE_API_URL=http://localhost:5000/api npm run dev (from client)
```
