import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';
import nodemailer from 'nodemailer';

// FIXED: Email configuration with better error handling and correct Gmail setup
const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.log('⚠️ Email credentials not configured');
    console.log('EMAIL_USER:', emailUser ? 'Set' : 'Missing');
    console.log('EMAIL_PASS:', emailPass ? 'Set' : 'Missing');
    console.log('💡 To configure email:');
    console.log('   1. Enable 2FA on Gmail');
    console.log('   2. Generate App Password in Google Account Settings');
    console.log('   3. Set EMAIL_USER and EMAIL_PASS in environment variables');
    return null;
  }

  console.log('📧 Creating email transporter with:', emailUser);

  // FIXED: Simplified Gmail configuration that works better
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0]
    });

    await user.save();
    
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        _id: user._id, 
        email: user.email, 
        displayName: user.displayName 
      } 
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        _id: user._id, 
        email: user.email, 
        displayName: user.displayName 
      } 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('🔄 Forgot password request for:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      // Don't reveal if user exists for security reasons
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.',
        email: email 
      });
    }

    console.log('✅ User found:', user.email);

    // Check if user registered with Google (has firebaseUid but no password or password is 'firebase-auth')
    if (user.firebaseUid && (user.password === 'firebase-auth' || !user.password)) {
      console.log('❌ User registered with Google, password reset not allowed:', email);
      return res.status(400).json({ 
        error: 'Password reset is not available for Google accounts. Please sign in with Google.',
        isGoogleUser: true
      });
    }

    // Additional check: if user has firebaseUid, they likely used Google sign-in
    if (user.firebaseUid) {
      console.log('⚠️ User has Firebase UID, checking if they can reset password:', email);
      // Allow password reset only if they have a real password (not 'firebase-auth')
      if (user.password === 'firebase-auth') {
        return res.status(400).json({ 
          error: 'This account was created with Google. Please sign in with Google instead.',
          isGoogleUser: true
        });
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ email: user.email });
    
    // Save reset token to database
    await PasswordReset.create({
      email: user.email,
      token: resetToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      createdAt: new Date() // Explicitly set creation time
    });

    console.log('✅ Reset token created for:', user.email);
    console.log('🕐 Token expires at:', new Date(Date.now() + 3600000).toISOString());

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

    console.log('🔗 Reset URL:', resetUrl);

    // FIXED: Better error handling and logging
    console.log('🔄 Creating email transporter...');
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.log('⚠️ Email credentials not configured. Reset URL:', resetUrl);
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.',
        email: email,
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
      });
    }

    try {
      // FIXED: Test transporter before sending
      console.log('🔄 Verifying email transporter...');
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');

      // FIXED: Improved email template and better error handling
      const mailOptions = {
        from: {
          name: 'ATS Resume Builder',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset Request - ATS Resume Builder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; margin-bottom: 10px;">ATS Resume Builder</h1>
              <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                Hello <strong>${user.displayName || 'User'}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                You requested a password reset for your ATS Resume Builder account.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
                Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;
                          font-weight: 600;
                          font-size: 16px;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 10px;">
                Or copy and paste this link in your browser:
              </p>
              <p style="word-break: break-all; color: #667eea; font-size: 14px; background: #fff; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Important:</strong> This link will expire in exactly 1 hour (${new Date(Date.now() + 3600000).toLocaleString()}) for security reasons.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <div style="text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                ATS Resume Builder Team<br>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #667eea;">
                  Visit our website
                </a>
              </p>
            </div>
          </div>
        `
      };

      console.log('🔄 Sending password reset email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', info.messageId);

      res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.',
        email: email 
      });

    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      console.error('❌ Email error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode
      });
      
      // FIXED: Provide more specific error messages
      let errorMessage = 'Failed to send reset email';
      if (emailError.code === 'EAUTH') {
        errorMessage = 'Email authentication failed. Please check email credentials.';
      } else if (emailError.code === 'ECONNECTION') {
        errorMessage = 'Could not connect to email server.';
      }
      
      console.log('🔗 Password reset URL (for development):', resetUrl);
      
      // FIXED: Return error status for email failures
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined,
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
      });
    }

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    console.log('🔄 Reset password request for:', email);
    console.log('🔍 Token provided:', token ? 'Yes' : 'No');
    console.log('🕐 Current time:', new Date().toISOString());
    
    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: 'Token, email, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find valid reset token with explicit expiration check
    const currentTime = new Date();
    const resetRecord = await PasswordReset.findOne({
      token,
      email,
      used: false,
      expiresAt: { $gt: currentTime }
    });

    console.log('🔍 Reset record found:', resetRecord ? 'Yes' : 'No');
    
    if (resetRecord) {
      console.log('🕐 Token created at:', resetRecord.createdAt);
      console.log('🕐 Token expires at:', resetRecord.expiresAt);
      console.log('🕐 Current time:', currentTime);
      console.log('🕐 Time remaining:', Math.round((resetRecord.expiresAt - currentTime) / 1000 / 60), 'minutes');
    }
    
    if (!resetRecord) {
      // Check if token exists but is expired or used
      const expiredRecord = await PasswordReset.findOne({ token, email });
      if (expiredRecord) {
        if (expiredRecord.used) {
          console.log('❌ Reset token already used for:', email);
          return res.status(400).json({ error: 'This reset link has already been used. Please request a new password reset.' });
        } else if (expiredRecord.expiresAt <= currentTime) {
          console.log('❌ Reset token expired for:', email, 'Expired at:', expiredRecord.expiresAt);
          return res.status(400).json({ error: 'This reset link has expired. Please request a new password reset.' });
        }
      }
      
      console.log('❌ Invalid reset token for:', email);
      return res.status(400).json({ error: 'Invalid reset link. Please request a new password reset.' });
    }

    // Find user and update password
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      console.log('❌ User not found for reset token:', resetRecord.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found for password reset:', user.email);
    
    // Double-check this is not a Google user
    if (user.firebaseUid && user.password === 'firebase-auth') {
      console.log('❌ Attempted password reset for Google user:', user.email);
      return res.status(400).json({ 
        error: 'This account uses Google sign-in. Password reset is not available.',
        isGoogleUser: true
      });
    }

    // FIXED: Update password in Firebase Auth first if user has firebaseUid
    const canVerifyFirebase = canVerifyFirebaseTokens();

    if (canVerifyFirebase && user.firebaseUid) {
      try {
        console.log('🔄 Fetching Firebase user:', user.firebaseUid);
        const firebaseUser = await admin.auth().getUser(user.firebaseUid);
        console.log('✅ Firebase user found:', firebaseUser.email);
        
        console.log('🔄 Updating password in Firebase Auth for user:', user.firebaseUid);
        await admin.auth().updateUser(user.firebaseUid, {
          password: newPassword
        });
        console.log('✅ Firebase Auth password updated successfully');
      } catch (firebaseError) {
        console.error('❌ Failed to update Firebase Auth password:', firebaseError);
        return res.status(500).json({ 
          error: 'Failed to update password in Firebase Auth',
          details: process.env.NODE_ENV === 'development' ? firebaseError.message : undefined
        });
      }
    } else if (user.firebaseUid) {
      console.log('⚠️ Firebase Admin not configured, skipping Firebase password update');
      return res.status(500).json({ error: 'Firebase configuration required for password reset' });
    } else {
      console.log('⚠️ User does not have Firebase UID, updating MongoDB only');
    }

    // Update password in MongoDB after successful Firebase update
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();
    
    // Mark reset token as used
    resetRecord.used = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    console.log('✅ Password reset successful for:', email);
    console.log('🕐 Reset completed at:', new Date().toISOString());

    res.json({ 
      message: 'Password reset successful',
      firebaseUpdated: canVerifyFirebase && user.firebaseUid ? true : false
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    console.log('✅ Password updated successfully for:', user.email);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const syncFirebaseUser = async (req, res) => {
  try {
    const { firebaseUser, idToken } = req.body;
    
    if (!firebaseUser || !idToken) {
      return res.status(400).json({ error: 'Firebase user data and token required' });
    }

    const canVerifyFirebase = await canVerifyFirebaseTokens();
    
    if (!canVerifyFirebase) {
      console.log('⚠️ Firebase Admin not properly configured, creating user without token verification');
      
      let user = await User.findOne({ 
        $or: [
          { firebaseUid: firebaseUser.uid },
          { email: firebaseUser.email }
        ]
      });
      
      if (!user) {
        user = new User({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
          password: 'firebase-auth', // Mark as Google user
          isGoogleUser: true
        });
        await user.save();
      } else {
        user.firebaseUid = firebaseUser.uid;
        user.displayName = firebaseUser.displayName || user.displayName;
        user.photoURL = firebaseUser.photoURL || user.photoURL;
        user.isGoogleUser = true;
        if (!user.password || user.password === '') {
          user.password = 'firebase-auth';
        }
        await user.save();
      }

      return res.json({ 
        success: true,
        user: { 
          _id: user._id, 
          email: user.email, 
          displayName: user.displayName,
          photoURL: user.photoURL
        } 
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('✅ Firebase token verified successfully');
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error);
      return res.status(401).json({ error: 'Invalid Firebase token' });
    }

    let user = await User.findOne({ 
      $or: [
        { firebaseUid: firebaseUser.uid },
        { email: firebaseUser.email }
      ]
    });
    
    if (!user) {
      user = new User({
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        password: 'firebase-auth', // Mark as Google user
        isGoogleUser: true
      });
      await user.save();
    } else {
      user.firebaseUid = firebaseUser.uid;
      user.displayName = firebaseUser.displayName || user.displayName;
      user.photoURL = firebaseUser.photoURL || user.photoURL;
      user.isGoogleUser = true;
      if (!user.password || user.password === '') {
        user.password = 'firebase-auth';
      }
      await user.save();
    }

    res.json({ 
      success: true,
      user: { 
        _id: user._id, 
        email: user.email, 
        displayName: user.displayName,
        photoURL: user.photoURL
      } 
    });
  } catch (error) {
    console.error('❌ Firebase user sync error:', error);
    res.status(500).json({ error: 'Failed to sync Firebase user: ' + error.message });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const {
    displayName,
    email,
    photoURL,
    phone,
    location,
    bio,
    skills,
    experience,
    education
  } = req.body;

  try {
    const updatedFirebaseUser = await admin.auth().updateUser(uid, {
      displayName,
      email,
      photoURL
    });

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        displayName,
        email,
        photoURL,
        phone,
        location,
        bio,
        skills,
        experience,
        education
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found in MongoDB' });
    }

    res.status(200).json({ 
      message: 'User updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const getUserProfile = async (req, res) => {
  const { uid } = req.params;

  try {
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(uid);
    } catch (err) {
      console.error('❌ Firebase user not found:', err.message);
      return res.status(404).json({ error: 'User not found in Firebase' });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || firebaseUser.photoURL || '',
        phone: user.phone || firebaseUser.phoneNumber || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || '',
        education: user.education || ''
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
