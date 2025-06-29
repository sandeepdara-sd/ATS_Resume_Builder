import express from 'express';
import { 
  register, 
  login, 
  syncFirebaseUser, 
  updateUser, 
  getUserProfile,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sync-firebase-user', syncFirebaseUser);
router.put('/users/:uid', updateUser);
router.get('/users/:uid', getUserProfile);

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/update-password', authenticateToken, updatePassword);

export default router;