import express from 'express';
import { register, login, syncFirebaseUser, updateUser, getUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sync-firebase-user', syncFirebaseUser);
router.put('/users/:uid', updateUser);
router.get('/users/:uid', getUserProfile)

export default router;