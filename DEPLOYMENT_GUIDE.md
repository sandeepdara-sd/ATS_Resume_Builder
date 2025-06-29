# 🚀 Deployment Guide for Render + Vercel

## 📋 Prerequisites

1. **MongoDB Atlas Account** - For database hosting
2. **Render Account** - For backend hosting
3. **Vercel Account** - For frontend hosting
4. **Firebase Project** - For authentication
5. **Gmail Account** - For email functionality
6. **Google AI Studio** - For Gemini API key

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ats-resume-builder?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 2: Backend Deployment (Render)

### 2.1 Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a new **Web Service**
4. Configure the service:
   - **Name**: `ats-resume-builder-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### 2.2 Set Environment Variables in Render

Go to your Render service → Environment tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats-resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### 2.3 Create Admin User

After deployment, run this command in Render's shell:
```bash
npm run create-admin
```

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Update API URL

1. Update `frontend/src/helper/Helper.js`:
   ```javascript
   export const api_url = "https://your-render-app-name.onrender.com";
   ```

### 3.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables:

```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

## 🔧 Step 4: Service Configuration

### 4.1 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Authentication → Sign-in methods → Email/Password and Google
4. Add your domains to authorized domains:
   - `your-vercel-app.vercel.app`
   - `localhost` (for development)

### 4.2 Generate Firebase Admin SDK Key

1. Go to Project Settings → Service Accounts
2. Generate new private key
3. Copy the JSON content and extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 4.3 Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this as `EMAIL_PASS`

### 4.4 Google AI Studio (Gemini API)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Create API key
3. Use as `GEMINI_API_KEY`

---

## ✅ Step 5: Verification

### 5.1 Test Backend

Visit: `https://your-render-app-name.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "ATS Resume Builder Server with Admin Dashboard is running",
  "services": {
    "mongodb": "Connected",
    "firebase": "Initialized",
    "ai": "Available"
  }
}
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Try user registration/login
3. Test resume creation
4. Test admin panel: `/admin/login`
   - Email: `admin@resumebuilder.com`
   - Password: `admin123`

---

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS origins in backend to include your Vercel URL
2. **Firebase Auth Issues**: Check if domains are authorized in Firebase
3. **Email Not Working**: Verify Gmail app password and 2FA
4. **MongoDB Connection**: Check IP whitelist and connection string
5. **Build Failures**: Check environment variables are set correctly

### Debug Commands:

```bash
# Check Render logs
# Go to Render Dashboard → Your Service → Logs

# Check Vercel logs
# Go to Vercel Dashboard → Your Project → Functions tab

# Test API endpoints
curl https://your-render-app-name.onrender.com/api/health
```

---

## 🎯 Final Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Render backend service deployed with all environment variables
- [ ] Admin user created successfully
- [ ] Vercel frontend deployed with correct API URL
- [ ] Firebase authentication configured
- [ ] Gmail app password configured
- [ ] Gemini API key configured
- [ ] All services tested and working

---

## 📞 Support

If you encounter issues:

1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test each service individually
4. Check network connectivity between services

**Admin Credentials:**
- Email: `admin@resumebuilder.com`
- Password: `admin123`