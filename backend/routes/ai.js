import express from 'express';
import { generateSummary, generateSkills, analyzeResume } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-summary', generateSummary);
router.post('/generate-skills', generateSkills);
router.post('/analyze-resume', analyzeResume);
// router.post('/score-resume', scoreResume);

export default router;