import express from 'express';
import { 
  uploadResume, 
  saveResume, 
  getResumes, 
  getResume, 
  deleteResume, 
  downloadResume,
  scoreAndSaveResume,
  getUserAverageScore
} from '../controllers/resumeController.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/save-resume', authenticateToken, scoreAndSaveResume);
router.get('/average-score', authenticateToken, getUserAverageScore);

router.post('/upload-resume', upload.single('resume'), uploadResume);
// router.post('/save-resume', authenticateToken, saveResume);
router.get('/resumes', authenticateToken, getResumes);
router.get('/resume/:id', authenticateToken, getResume);
router.delete('/resume/:id', authenticateToken, deleteResume);
router.post('/download-resume', downloadResume);

export default router;