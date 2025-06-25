import jwt from 'jsonwebtoken';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Check if this is a Firebase token (longer format) or JWT token
    const isFirebaseToken = token.length > 500; // Firebase tokens are much longer
    
    if (isFirebaseToken) {
      // Try Firebase token verification
      const canVerifyFirebase = await canVerifyFirebaseTokens();
      
      if (canVerifyFirebase) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          // console.log('✅ Firebase token verified for user:', decodedToken.uid);
          
          // Find or create user based on Firebase UID
          let user = await User.findOne({ firebaseUid: decodedToken.uid });
          if (!user) {
            // Create user if doesn't exist
            user = new User({
              email: decodedToken.email,
              firebaseUid: decodedToken.uid,
              displayName: decodedToken.name || decodedToken.email?.split('@')[0],
              photoURL: decodedToken.picture,
              password: 'firebase-auth'
            });
            await user.save();
            // console.log('✅ Created new user from Firebase:', user._id);
          }
          req.user = { _id: user._id, email: user.email, firebaseUid: decodedToken.uid };
          return next();
        } catch (firebaseError) {
          console.log('❌ Firebase token verification failed:', firebaseError.message);
          // Fall back to treating as JWT token
        }
      } else {
        console.log('⚠️ Firebase Admin not configured, treating as JWT token');
      }
    }
    
    // Try JWT verification for regular JWT tokens or fallback
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if MongoDB is available before querying
      if (User.db && User.db.readyState === 1) {
        const user = await User.findById(decoded._id);
        if (!user) {
          return res.status(403).json({ error: 'User not found' });
        }
        req.user = { _id: user._id, email: user.email };
      } else {
        // If MongoDB is not available, use token data directly
        console.log('⚠️ MongoDB not available, using token data directly');
        req.user = { _id: decoded._id, email: decoded.email };
      }
      return next();
    } catch (jwtError) {
      console.log('❌ JWT token verification failed:', jwtError.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return res.status(500).json({ error: 'Authentication service error' });
  }
};