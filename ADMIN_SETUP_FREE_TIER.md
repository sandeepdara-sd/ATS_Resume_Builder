# 🔧 Admin Setup for Free Tier (Render)

Since you're using Render's free tier (which doesn't have shell access), here's how to create the admin user:

## 🎯 Method 1: API Endpoint (Recommended)

### Step 1: Deploy your backend to Render first

1. Make sure your backend is deployed and running on Render
2. Check that it's working by visiting: `https://your-render-app-name.onrender.com/api/health`

### Step 2: Create admin user via API

Use any of these methods to call the admin creation endpoint:

#### Option A: Using curl (Terminal/Command Prompt)
```bash
curl -X POST https://your-render-app-name.onrender.com/api/admin/create-initial-admin \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "create-admin-2024"}'
```

#### Option B: Using Postman
1. Open Postman
2. Create a new POST request
3. URL: `https://your-render-app-name.onrender.com/api/admin/create-initial-admin`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "secretKey": "create-admin-2024"
}
```

#### Option C: Using Browser Console
1. Open your deployed frontend in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this code:
```javascript
fetch('https://your-render-app-name.onrender.com/api/admin/create-initial-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    secretKey: 'create-admin-2024'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Step 3: Verify admin creation

You should get a response like:
```json
{
  "message": "Admin user created successfully",
  "credentials": {
    "email": "admin@resumebuilder.com",
    "password": "admin123"
  }
}
```

## 🔐 Admin Credentials

After successful creation:
- **Email**: `admin@resumebuilder.com`
- **Password**: `admin123`
- **Admin Panel**: `https://your-vercel-app.vercel.app/admin/login`

## 🛡️ Security Notes

1. The secret key `create-admin-2024` prevents unauthorized admin creation
2. You can change this secret by setting `ADMIN_CREATION_SECRET` environment variable in Render
3. The endpoint will only work once - if admin already exists, it will return an error
4. Consider changing the admin password after first login (future feature)

## 🔍 Troubleshooting

### If you get "Admin already exists" error:
- This means the admin user was already created
- Use the credentials: `admin@resumebuilder.com` / `admin123`

### If you get connection errors:
- Make sure your Render backend is deployed and running
- Check the URL is correct (replace `your-render-app-name` with actual name)
- Verify MongoDB is connected (check `/api/health` endpoint)

### If you get "Invalid secret key" error:
- Make sure you're using the correct secret: `create-admin-2024`
- Check for typos in the JSON body

## 📝 Environment Variables for Render

Make sure these are set in your Render service:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret-key
ADMIN_CREATION_SECRET=create-admin-2024
# ... other environment variables
```

## ✅ Next Steps

1. Create admin user using one of the methods above
2. Test admin login at your frontend admin panel
3. Update your frontend API URL to point to your Render backend
4. Deploy frontend to Vercel
5. Test the complete application

---

**Need help?** Check the main deployment guide in `DEPLOYMENT_GUIDE.md` for complete setup instructions.