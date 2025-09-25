import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';

// EmailJS configuration helper
const createEmailJSData = (email, resetUrl, displayName = 'User') => {
  return {
    to_email: email,
    to_name: displayName,
    from_name: 'ATS Resume Builder Team',
    subject: 'Password Reset Request - ATS Resume Builder',
    reset_url: resetUrl,
    user_name: displayName,
    expiry_time: new Date(Date.now() + 3600000).toLocaleString(),
    app_name: 'ATS Resume Builder',
    support_url: process.env.FRONTEND_URL || 'http://localhost:3000'
  };
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

    // Create EmailJS template data
    const emailData = createEmailJSData(email, resetUrl, user.displayName);

    console.log('✅ Password reset token generated successfully');
    console.log('📧 Email data prepared for EmailJS');
    
    // Return success response with EmailJS data
    // The frontend will handle sending the email using EmailJS
    res.json({ 
      message: 'If an account with that email exists, we have sent a password reset link.',
      email: email,
      emailData: emailData, // Frontend will use this to send email via EmailJS
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

// NEW: Token validation endpoint
export const validateResetToken = async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log('🔄 Validating reset token for:', email);
    console.log('🕐 Current time:', new Date().toISOString());
    
    if (!token || !email) {
      return res.status(400).json({ 
        error: 'Invalid reset link. Please request a new password reset.',
        linkExpired: true 
      });
    }

    // Find the reset record
    const resetRecord = await PasswordReset.findOne({
      token,
      email
    });

    console.log('🔍 Reset record found:', resetRecord ? 'Yes' : 'No');
    
    if (!resetRecord) {
      console.log('❌ No reset record found for token and email combination');
      return res.status(400).json({ 
        error: 'Invalid reset link. Please request a new password reset.',
        linkExpired: true 
      });
    }

    console.log('🔍 Reset record details:');
    console.log('  - Created at:', resetRecord.createdAt);
    console.log('  - Expires at:', resetRecord.expiresAt);
    console.log('  - Used:', resetRecord.used || false);
    console.log('  - Used at:', resetRecord.usedAt || 'Never');

    const currentTime = new Date();
    
    // Check if token has already been used
    if (resetRecord.used) {
      console.log('❌ Reset token already used for:', email, 'Used at:', resetRecord.usedAt);
      return res.status(400).json({ 
        error: 'This reset link has already been used. Please request a new password reset.',
        linkUsed: true 
      });
    }

    // Check if token has expired
    if (resetRecord.expiresAt <= currentTime) {
      console.log('❌ Reset token expired for:', email);
      console.log('  - Expired at:', resetRecord.expiresAt);
      console.log('  - Current time:', currentTime);
      console.log('  - Time difference (minutes):', Math.round((currentTime - resetRecord.expiresAt) / 1000 / 60));
      
      return res.status(400).json({ 
        error: 'This reset link has expired. Please request a new password reset.',
        linkExpired: true 
      });
    }

    // Check if user exists and if it's a Google user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      console.log('❌ User not found for reset token:', resetRecord.userId);
      return res.status(404).json({ 
        error: 'User not found',
        linkExpired: true 
      });
    }

    // Check if this is a Google user
    if (user.firebaseUid && user.password === 'firebase-auth') {
      console.log('❌ Attempted token validation for Google user:', user.email);
      return res.status(400).json({ 
        error: 'This account uses Google sign-in. Password reset is not available.',
        isGoogleUser: true
      });
    }

    console.log('✅ Reset token is valid and not expired');
    console.log('🕐 Time remaining:', Math.round((resetRecord.expiresAt - currentTime) / 1000 / 60), 'minutes');

    res.json({ 
      message: 'Reset token is valid',
      timeRemaining: Math.round((resetRecord.expiresAt - currentTime) / 1000 / 60)
    });

  } catch (error) {
    console.error('❌ Token validation error:', error);
    res.status(500).json({ 
      error: 'Failed to validate reset token',
      linkExpired: true 
    });
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

    // First, find the reset record to check its status
    const resetRecord = await PasswordReset.findOne({
      token,
      email
    });

    console.log('🔍 Reset record found:', resetRecord ? 'Yes' : 'No');
    
    if (!resetRecord) {
      console.log('❌ No reset record found for token and email combination');
      return res.status(400).json({ 
        error: 'Invalid reset link. Please request a new password reset.',
        linkExpired: true 
      });
    }

    console.log('🔍 Reset record details:');
    console.log('  - Created at:', resetRecord.createdAt);
    console.log('  - Expires at:', resetRecord.expiresAt);
    console.log('  - Used:', resetRecord.used || false);
    console.log('  - Used at:', resetRecord.usedAt || 'Never');

    const currentTime = new Date();
    
    // Check if token has already been used - FIRST PRIORITY CHECK
    if (resetRecord.used) {
      console.log('❌ Reset token already used for:', email, 'Used at:', resetRecord.usedAt);
      return res.status(400).json({ 
        error: 'This reset link has already been used. Please request a new password reset.',
        linkUsed: true 
      });
    }

    // Check if token has expired - SECOND PRIORITY CHECK
    if (resetRecord.expiresAt <= currentTime) {
      console.log('❌ Reset token expired for:', email);
      console.log('  - Expired at:', resetRecord.expiresAt);
      console.log('  - Current time:', currentTime);
      console.log('  - Time difference (minutes):', Math.round((currentTime - resetRecord.expiresAt) / 1000 / 60));
      
      return res.status(400).json({ 
        error: 'This reset link has expired. Please request a new password reset.',
        linkExpired: true 
      });
    }

    console.log('✅ Reset token is valid and not expired');
    console.log('🕐 Time remaining:', Math.round((resetRecord.expiresAt - currentTime) / 1000 / 60), 'minutes');

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
      
      // Mark token as used to prevent further attempts
      resetRecord.used = true;
      resetRecord.usedAt = new Date();
      await resetRecord.save();
      
      return res.status(400).json({ 
        error: 'This account uses Google sign-in. Password reset is not available.',
        isGoogleUser: true
      });
    }

    // CRITICAL: Mark token as used IMMEDIATELY to prevent race conditions
    resetRecord.used = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();
    
    console.log('✅ Reset token marked as used at:', resetRecord.usedAt);

    // Update password in Firebase Auth first if user has firebaseUid
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
        
        // Since token is already marked as used, we cannot revert it
        // This prevents multiple attempts but the user needs to request a new reset
        return res.status(500).json({ 
          error: 'Failed to update password. Please request a new password reset.',
          details: process.env.NODE_ENV === 'development' ? firebaseError.message : undefined
        });
      }
    } else if (user.firebaseUid) {
      console.log('⚠️ Firebase Admin not configured, skipping Firebase password update');
      
      // Since token is already marked as used, we cannot revert it
      return res.status(500).json({ 
        error: 'Firebase configuration required for password reset. Please request a new password reset.'
      });
    } else {
      console.log('⚠️ User does not have Firebase UID, updating MongoDB only');
    }

    // Update password in MongoDB after successful Firebase update (or if no Firebase)
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();
    
    console.log('✅ Password updated in MongoDB');

    // Clean up all reset tokens for this user after successful reset
    await PasswordReset.deleteMany({ 
      $or: [
        { email: user.email },
        { userId: user._id }
      ]
    });
    console.log('✅ All reset tokens cleaned up for user:', user.email);

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