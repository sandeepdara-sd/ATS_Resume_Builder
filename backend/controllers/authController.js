import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import admin, { canVerifyFirebaseTokens } from '../config/firebase.js';


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

    // console.log('✅ User registered successfully:', user.email);

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

    // console.log('✅ User logged in successfully:', user.email);

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

export const syncFirebaseUser = async (req, res) => {
  try {
    const { firebaseUser, idToken } = req.body;
    
    if (!firebaseUser || !idToken) {
      return res.status(400).json({ error: 'Firebase user data and token required' });
    }

    // console.log('🔄 Syncing Firebase user:', firebaseUser.email);

    // Check if Firebase Admin can verify tokens
    const canVerifyFirebase = await canVerifyFirebaseTokens();
    
    if (!canVerifyFirebase) {
      console.log('⚠️ Firebase Admin not properly configured, creating user without token verification');
      
      // Still create/update user based on provided data
      let user = await User.findOne({ 
        $or: [
          { firebaseUid: firebaseUser.uid },
          { email: firebaseUser.email }
        ]
      });
      
      if (!user) {
        // Create new user
        user = new User({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
          password: 'firebase-auth'
        });
        await user.save();
        // console.log('✅ Created new Firebase user in MongoDB (no token verification):', user._id);
      } else {
        // Update existing user
        user.firebaseUid = firebaseUser.uid;
        user.displayName = firebaseUser.displayName || user.displayName;
        user.photoURL = firebaseUser.photoURL || user.photoURL;
        await user.save();
        // console.log('✅ Updated existing Firebase user (no token verification):', user._id);
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

    // Verify the Firebase token if possible
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('✅ Firebase token verified successfully');
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error);
      return res.status(401).json({ error: 'Invalid Firebase token' });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: firebaseUser.uid },
        { email: firebaseUser.email }
      ]
    });
    
    if (!user) {
      // Create new user
      user = new User({
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        password: 'firebase-auth'
      });
      await user.save();
      // console.log('✅ Created new Firebase user in MongoDB:', user._id);
    } else {
      // Update existing user
      user.firebaseUid = firebaseUser.uid;
      user.displayName = firebaseUser.displayName || user.displayName;
      user.photoURL = firebaseUser.photoURL || user.photoURL;
      await user.save();
      // console.log('✅ Updated existing Firebase user:', user._id);
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

// export const updateUser = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const updates = req.body;

//     const existingUser = await User.findOne({ firebaseUid: uid });
//     if (!existingUser) {
//       console.log('❌ No user found with this UID');
//       return res.status(404).json({ message: 'User not found in DB' });
//     }
    

//     console.log('✅ Found user before update:', existingUser);

//     const updatedUser = await User.findOneAndUpdate(
//       { firebaseUid: uid },
//       { $set: updates },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found or no update applied' });
//     }

//     console.log('✅ After update:', updatedUser);
//     res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//   } catch (error) {
//     console.error('❌ Error updating user:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// PUT /api/users/:uid


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
    // ✅ 1. Update Firebase Auth (only displayName and email)
    const updatedFirebaseUser = await admin.auth().updateUser(uid, {
      displayName,
      email,
      photoURL
    });

    // console.log('✅ Firebase user updated:', updatedFirebaseUser.email);

    // ✅ 2. Update MongoDB user with matching Firebase UID
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

    // console.log('✅ MongoDB user updated:', updatedUser.email);

    res.status(200).json({ 
      message: 'User updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
// GET /api/users/:uid
export const getUserProfile = async (req, res) => {
  const { uid } = req.params;

  try {
    // 🔐 Verify the user exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(uid);
    } catch (err) {
      console.error('❌ Firebase user not found:', err.message);
      return res.status(404).json({ error: 'User not found in Firebase' });
    }

    // 📦 Fetch user from MongoDB
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    // 📤 Respond with user profile
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

