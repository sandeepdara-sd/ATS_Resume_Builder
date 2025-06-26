// middleware/auth.js

import jwt from 'jsonwebtoken';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const isFirebaseToken = token.length > 500;

  if (isFirebaseToken) {
    // Firebase token
    const canVerifyFirebase = canVerifyFirebaseTokens();

    if (!canVerifyFirebase) {
      console.log('❌ Firebase Admin not initialized.');
      return res.status(500).json({ error: 'Firebase is not properly configured' });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      let user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        user = new User({
          email: decodedToken.email,
          firebaseUid: decodedToken.uid,
          displayName: decodedToken.name || decodedToken.email?.split('@')[0],
          photoURL: decodedToken.picture,
          password: 'firebase-auth'
        });
        await user.save();
      }

      req.user = {
        _id: user._id,
        email: user.email,
        firebaseUid: decodedToken.uid,
      };

      return next();
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error.message);
      return res.status(403).json({ error: 'Invalid Firebase token' });
    }
  }

  // JWT token (HS256)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = {
      _id: user._id,
      email: user.email,
    };

    return next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid JWT token' });
  }
};
