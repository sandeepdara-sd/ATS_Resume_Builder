import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  deleteUser,
  getAllResumes,
  deleteResume,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  createInitialAdmin // Add this new function
} from '../controllers/adminController.js';
import { authenticateAdmin, requirePermission } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin Authentication
router.post('/login', adminLogin);

// Initial admin creation route (for free tier deployment)
router.post('/create-initial-admin', createInitialAdmin);

// Dashboard
router.get('/dashboard/stats', authenticateAdmin, getDashboardStats);

// User Management
router.get('/users', authenticateAdmin, requirePermission('users'), getAllUsers);
router.get('/users/:userId', authenticateAdmin, requirePermission('users'), getUserDetails);
router.delete('/users/:userId', authenticateAdmin, requirePermission('users'), deleteUser);

// Resume Management
router.get('/resumes', authenticateAdmin, requirePermission('resumes'), getAllResumes);
router.delete('/resumes/:resumeId', authenticateAdmin, requirePermission('resumes'), deleteResume);

// Feedback Management
router.get('/feedback', authenticateAdmin, requirePermission('feedback'), getAllFeedback);
router.patch('/feedback/:feedbackId', authenticateAdmin, requirePermission('feedback'), updateFeedbackStatus);
router.delete('/feedback/:feedbackId', authenticateAdmin, requirePermission('feedback'), deleteFeedback);

export default router;