# Deployment Guide for Secure File Storage with MongoDB Atlas

## Prerequisites

1. **MongoDB Atlas Account** - Follow `MONGODB_ATLAS_SETUP.md` first
2. **Node.js 18+** installed
3. **Git** for version control

## Local Development with MongoDB Atlas

1. **Set up MongoDB Atlas** (see MONGODB_ATLAS_SETUP.md)

2. **Update .env file with Atlas connection:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securefile_storage?retryWrites=true&w=majority
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start backend server:**
   ```bash
   npm run server
   ```

5. **Start frontend (in new terminal):**
   ```bash
   npm run dev
   ```

6. **Access application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Cloud Deployment Options

### Option 1: Railway (Recommended)
1. Fork this repository to your GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect your GitHub account
4. Deploy from GitHub repository
5. Set environment variables in Railway dashboard:
   - `MONGODB_URI` (your Atlas connection string)
   - `JWT_SECRET`
   - `ENCRYPTION_KEY`
   - `NODE_ENV=production`

### Option 2: Render
1. Fork this repository
2. Go to [Render.com](https://render.com)
3. Create new Web Service from GitHub repo
4. Set build command: `npm install && npm run build`
5. Set start command: `npm run server`
6. Add environment variables (same as Railway)

### Option 3: Vercel (Frontend) + Railway (Backend)
**Frontend on Vercel:**
1. Deploy React app to Vercel
2. Update API base URL to point to your backend

**Backend on Railway:**
1. Deploy backend to Railway
2. Set CORS to allow your Vercel domain

### Option 4: Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=your-atlas-uri`
4. Deploy: `git push heroku main`

## Required Environment Variables

**For all cloud deployments, set these environment variables:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securefile_storage?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ENCRYPTION_KEY=your-64-character-hex-encryption-key
NODE_ENV=production
PORT=3001
```

## MongoDB Atlas Security Checklist

- [ ] Database user created with proper permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string includes database name
- [ ] Environment variables set in hosting platform
- [ ] Test connection from deployment platform

## Post-Deployment Testing

1. **Test user registration**
2. **Test user login**
3. **Test file upload (all types)**
4. **Test file download**
5. **Test file deletion**
6. **Verify MongoDB Atlas data**
7. **Check error handling**

## Troubleshooting

**MongoDB Connection Issues:**
- Verify Atlas connection string format
- Check IP whitelist in Atlas
- Confirm database user permissions

**File Upload Issues:**
- Check file size limits
- Verify upload directory permissions
- Test with different file types

**Authentication Problems:**
- Verify JWT_SECRET is set
- Check token expiration
- Test login/logout flow

## Security Notes for Production

1. **Use strong passwords** for Atlas database users
2. **Restrict IP access** in Atlas Network Access
3. **Use HTTPS** in production
4. **Set proper CORS origins**
5. **Monitor Atlas usage and alerts**
6. **Regular security updates**

## Cost Optimization

- **MongoDB Atlas M0** tier is free (512MB storage)
- **Railway** free tier: 500 hours/month
- **Render** free tier: 750 hours/month
- **Vercel** free tier: 100GB bandwidth/month
