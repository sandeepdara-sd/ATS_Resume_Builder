import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';
import nodemailer from 'nodemailer';

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
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

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save reset token to database
    await PasswordReset.create({
      email: user.email,
      token: resetToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

    // Send email
    const transporter = createEmailTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@resumebuilder.com',
      to: email,
      subject: 'Password Reset Request - ATS Resume Builder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Password Reset Request</h2>
          <p>Hello ${user.displayName || 'User'},</p>
          <p>You requested a password reset for your ATS Resume Builder account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">ATS Resume Builder Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Password reset email sent successfully',
      email: email 
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
};

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

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    // Mark reset token as used
    resetRecord.used = true;
    await resetRecord.save();

    console.log('✅ Password reset successful for:', email);

    res.json({ message: 'Password reset successful' });
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