// import express from 'express';
// import { 
//   register, 
//   login, 
//   syncFirebaseUser, 
//   updateUser, 
//   getUserProfile,
//   forgotPassword,
//   resetPassword,
//   updatePassword
// } from '../controllers/authController.js';
// import { authenticateToken } from '../middleware/auth.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/sync-firebase-user', syncFirebaseUser);
// router.put('/users/:uid', updateUser);
// router.get('/users/:uid', getUserProfile);

// // Password management
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/update-password', authenticateToken, updatePassword);

// export default router;
import express from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  validateResetToken,  // NEW: Add this import
  updatePassword,
  syncFirebaseUser,
  updateUser,
  getUserProfile 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/validate-reset-token', validateResetToken); // NEW: Add this route
router.post('/reset-password', resetPassword);
router.post('/sync-firebase-user', syncFirebaseUser);

// Protected routes
router.put('/update-password', authenticateToken, updatePassword);
 router.put('/users/:uid', updateUser);
 router.get('/users/:uid', getUserProfile);

export default router;