import express from 'express';
import { 
  submitFeedback, 
  getUserFeedback, 
  getUserFeedbackHistory 
} from '../controllers/feedbackController.js';

const router = express.Router();

// POST /api/feedback - Submit or update feedback
router.post('/', submitFeedback);

// GET /api/feedback - Get user's current feedback
router.get('/', getUserFeedback);

// GET /api/feedback/history - Get user's feedback history
router.get('/history', getUserFeedbackHistory);

export default router;