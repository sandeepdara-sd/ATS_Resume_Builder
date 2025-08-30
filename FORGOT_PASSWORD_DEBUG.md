# 🔧 Forgot Password Debugging Guide

## Common Issues and Solutions

### 0. Google Users Cannot Reset Password

**Important**: Users who signed up with Google cannot use the forgot password feature.
- Google users should always sign in using "Continue with Google"
- The system will show an appropriate error message for Google users
- Only users who registered with email/password can reset their passwords

### 1. Email Configuration Issues

**Problem**: Email not being sent
**Solution**: Check email configuration in backend

#### Gmail App Password Setup:
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account Settings → Security → App Passwords
3. Generate app password for "Mail"
4. Use the 16-character app password (not your regular Gmail password)

#### Environment Variables:
```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=abcdefghijklmnop  # 16-character app password
```

### 2. Testing Email Configuration

Check if email is working by visiting:
```
GET /api/health
```

Look for the `email` service status:
- `Configured & Working` ✅ - Email is working
- `Configured but Error` ⚠️ - Check credentials
- `Not Configured` ❌ - Set environment variables

### 3. Frontend Issues

**Problem**: Form not submitting or showing errors
**Check**: Browser console for JavaScript errors

**Problem**: Reset link not working
**Check**: URL parameters in browser address bar

### 4. Backend Debugging

Enable detailed logging by checking server console for:
- `🔄 Forgot password request for: email@example.com`
- `✅ User found: email@example.com`
- `✅ Reset token created for: email@example.com`
- `📧 Creating email transporter...`
- `✅ Email transporter verified successfully`
- `✅ Password reset email sent successfully`

### 5. Database Issues

**Problem**: Reset tokens not being saved
**Check**: MongoDB connection and PasswordReset model

**Problem**: Tokens expiring too quickly
**Check**: Token expiration time (currently 1 hour)

### 6. Security Improvements Made

1. **No User Enumeration**: Same response whether user exists or not
2. **Token Validation**: Proper expiration (exactly 1 hour) and usage tracking
3. **Rate Limiting**: Prevent spam requests
4. **Secure Headers**: Proper email templates
5. **Google User Protection**: Prevents password reset for Google sign-in users
6. **Enhanced Expiration**: Tokens expire exactly after 1 hour with detailed logging

### 7. Testing Steps

1. **Test Email Configuration**:
   ```bash
   curl https://your-backend-url/api/health
   ```

2. **Test Forgot Password**:
   ```bash
   curl -X POST https://your-backend-url/api/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

3. **Test Reset Password**:
   ```bash
   curl -X POST https://your-backend-url/api/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "your-token", "email": "test@example.com", "newPassword": "newpass123"}'
   ```

### 8. Common Error Messages

- `Email authentication failed` → Check Gmail app password
- `Could not connect to email server` → Check internet/firewall
- `Invalid or expired reset token` → Token used or expired
- `This reset link has expired` → Token is older than 1 hour
- `This reset link has already been used` → Token was already used once
- `User not found` → Email doesn't exist in database
- `Password reset is not available for Google accounts` → User signed up with Google
- `Firebase configuration required` → Firebase setup issue

### 9. Production Deployment Notes

For Render deployment:
1. Set all environment variables in Render dashboard
2. Ensure EMAIL_USER and EMAIL_PASS are correctly set
3. Check Render logs for email sending attempts
4. Verify FRONTEND_URL points to your Vercel deployment

### 10. Development Testing

For local testing without email:
- Check server logs for reset URL
- Copy URL manually to test reset flow
- Use development environment variables