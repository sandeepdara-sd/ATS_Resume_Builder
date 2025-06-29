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
    return null;
  }

  console.log('📧 Creating email transporter with:', emailUser);

  // FIXED: Simplified Gmail configuration that works better
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass
    },
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
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ email: user.email });
    
    // Save reset token to database
    await PasswordReset.create({
      email: user.email,
      token: resetToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });

    console.log('✅ Reset token created for:', user.email);

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

    console.log('🔗 Reset URL:', resetUrl);

    // FIXED: Better error handling and logging
    console.log('🔄 Creating email transporter...');
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.log('⚠️ Email credentials not configured. Reset URL:', resetUrl);
      return res.json({ 
        message: 'Password reset link generated (email service not configured)',
        email: email,
        resetUrl: resetUrl // Remove this in production
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
                <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
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
        message: 'Password reset email sent successfully',
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

// FIXED: Updated resetPassword to sync with Firebase Auth
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: 'Token, email, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      email,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Find user and update password
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FIXED: Update password in Firebase Auth if user has firebaseUid
    const canVerifyFirebase = await canVerifyFirebaseTokens();
    
    if (canVerifyFirebase && user.firebaseUid) {
      try {
        console.log('🔄 Updating password in Firebase Auth for user:', user.firebaseUid);
        await admin.auth().updateUser(user.firebaseUid, {
          password: newPassword
        });
        console.log('✅ Firebase Auth password updated successfully');
      } catch (firebaseError) {
        console.error('❌ Failed to update Firebase Auth password:', firebaseError);
        
        // If Firebase update fails, we should still continue with MongoDB update
        // but log the error for debugging
        console.log('⚠️ Continuing with MongoDB password update despite Firebase error');
      }
    } else if (user.firebaseUid) {
      console.log('⚠️ Firebase Admin not configured, skipping Firebase password update');
    }

    // Hash new password and update user in MongoDB
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    // Mark reset token as used
    resetRecord.used = true;
    await resetRecord.save();

    console.log('✅ Password reset successful for:', email);

    res.json({ 
      message: 'Password reset successful',
      firebaseUpdated: canVerifyFirebase && user.firebaseUid ? true : false
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// FIXED: Updated updatePassword to sync with Firebase Auth
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

    // FIXED: Update password in Firebase Auth if user has firebaseUid
    const canVerifyFirebase = await canVerifyFirebaseTokens();
    
    if (canVerifyFirebase && user.firebaseUid) {
      try {
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
    }

    // Hash and update new password in MongoDB
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    console.log('✅ Password updated successfully for:', user.email);

    res.json({ 
      message: 'Password updated successfully',
      firebaseUpdated: canVerifyFirebase && user.firebaseUid ? true : false
    });
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
          password: 'firebase-auth'
        });
        await user.save();
      } else {
        user.firebaseUid = firebaseUser.uid;
        user.displayName = firebaseUser.displayName || user.displayName;
        user.photoURL = firebaseUser.photoURL || user.photoURL;
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
        password: 'firebase-auth'
      });
      await user.save();
    } else {
      user.firebaseUid = firebaseUser.uid;
      user.displayName = firebaseUser.displayName || user.displayName;
      user.photoURL = firebaseUser.photoURL || user.photoURL;
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
