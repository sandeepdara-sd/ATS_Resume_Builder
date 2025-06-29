import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';
import { generateResumeHTML } from '../utils/resumeTemplate.js';
import { model } from '../config/gemini.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import * as pdf from 'html-pdf-node';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // console.log('📄 File received:', req.file.originalname, req.file.size);

    // Extract text from PDF using memory buffer
    let extractedText = '';
    try {
      extractedText = await extractTextFromPDF(req.file.buffer);
      // console.log('✅ Text extracted successfully, length:', extractedText.length);
    } catch (pdfError) {
      console.error('❌ PDF parsing error:', pdfError);
      return res.status(400).json({ error: 'Could not extract text from PDF. Please ensure the file is a valid PDF.' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Empty PDF or unreadable content.' });
    }

    // Construct AI prompt
    const prompt = `
Extract the following information from this resume text and return it as a valid JSON object:
{
  "personalDetails": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "summary": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "achievements": ""
    }
  ],
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "currentJob": false,
      "responsibilities": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": "",
      "link": "",
      "duration": ""
    }
  ],
  "skills": [],
  "achievements": [
    {
      "title": "",
      "description": "",
      "date": "",
      "link": "",
      "organization": ""
    }
  ],
  "hobbies": [],
  
}

Resume Text:
"""
${extractedText}
"""

Return only valid JSON without any extra text. If any field is missing, use an empty string or array.
    `;

    // Gemini call
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Extract and clean JSON
    const cleaned = response
      .replace(/```json\s*/gi, '')
      .replace(/```$/, '')
      .trim();

    const extractedData = JSON.parse(cleaned);
    res.json(extractedData);
    // console.log('✅ Resume parsed successfully:', extractedData.personalDetails?.fullName || 'Unknown');
    

  } catch (err) {
    console.error('❌ General error:', err);
    res.status(500).json({
      error: 'Resume parsing failed',
      details: err.message || 'Unknown error',
    });
  }
};

export const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const userId = req.user._id;

    // console.log('💾 Saving resume for user:', userId);

    // Validate required data
    if (!resumeData.personalDetails || !resumeData.personalDetails.fullName) {
      return res.status(400).json({ error: 'Personal details with full name are required' });
    }

    // Check if this is an update (resumeId provided) or new resume
    let resume;
    if (resumeData._id) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { _id: resumeData._id, userId: userId },
        {
          ...resumeData,
          userId: userId,
          updatedAt: new Date()
        },
        { new: true, upsert: false }
      );
      
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      // console.log('✅ Resume updated successfully:', resume._id);
    } else {
      // Create new resume
      resume = new Resume({
        ...resumeData,
        userId: userId,
        title: resumeData.title || `${resumeData.personalDetails.fullName} - Resume`,
        updatedAt: new Date()
      });
      await resume.save();

      // Add resume reference to user
      await User.findByIdAndUpdate(userId, {
        $push: { resumes: resume._id }
      });
      // console.log('✅ New resume created successfully:', resume._id);
    }

    res.json({ 
      message: 'Resume saved successfully', 
      resumeId: resume._id,
      resume: resume
    });
  } catch (error) {
    console.error('❌ Error saving resume:', error);
    res.status(500).json({ error: 'Failed to save resume: ' + error.message });
  }
};

// Add this function to score and save resume
export const scoreAndSaveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const userId = req.user._id;

    // First, score the resume using AI
    const scorePrompt = `
Analyze this resume and provide an ATS score based on completeness, skills, experience, and education.
Return only a number between 0-100.

Resume Data: ${JSON.stringify(resumeData)}`;

    const result = await model.generateContent(scorePrompt);
    const response = await result.response;
    const scoreText = response.text().trim();
    const score = parseInt(scoreText.match(/\d+/)?.[0]) || 75; // Extract number or fallback to 75

    // Add score to resume data
    resumeData.score = Math.min(Math.max(score, 0), 100); // Ensure score is between 0-100

    // Save resume with score (rest of your existing saveResume logic)
    let resume;
    if (resumeData._id) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeData._id, userId: userId },
        { ...resumeData, userId: userId, updatedAt: new Date() },
        { new: true, upsert: false }
      );
    } else {
      resume = new Resume({
        ...resumeData,
        userId: userId,
        title: resumeData.title || `${resumeData.personalDetails.fullName} - Resume`,
        updatedAt: new Date()
      });
      await resume.save();
      await User.findByIdAndUpdate(userId, { $push: { resumes: resume._id } });
    }

    res.json({ 
      message: 'Resume saved successfully', 
      resumeId: resume._id,
      resume: resume,
      score: resume.score
    });
    // console.log("Resume", resume._id, "scored and saved successfully with score:", resume.score);
    
  } catch (error) {
    console.error('Error scoring and saving resume:', error);
    res.status(500).json({ error: 'Failed to save resume: ' + error.message });
  }
};

// Add this function to get average score
export const getUserAverageScore = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const resumes = await Resume.find({ userId: userId });
    
    if (resumes.length === 0) {
      return res.json({ averageScore: 0, totalResumes: 0 });
    }
    
    const totalScore = resumes.reduce((sum, resume) => sum + (resume.score || 0), 0);
    const averageScore = Math.round(totalScore / resumes.length);
    
    res.json({ 
      averageScore, 
      totalResumes: resumes.length,
      scores: resumes.map(r => ({ id: r._id, title: r.title, score: r.score }))
    });
  } catch (error) {
    console.error('Error getting average score:', error);
    res.status(500).json({ error: 'Failed to get average score: ' + error.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log('📋 Fetching resumes for user:', userId);
    
    const resumes = await Resume.find({ userId: userId }).sort({ updatedAt: -1 });
    // console.log('✅ Found resumes:', resumes.length);
    
    res.json(resumes);
  } catch (error) {
    console.error('❌ Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes: ' + error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user._id;
    
    // console.log('📄 Fetching resume:', resumeId, 'for user:', userId);
    
    const resume = await Resume.findOne({ _id: resumeId, userId: userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    console.log('✅ Resume found');
    res.json(resume);
  } catch (error) {
    console.error('❌ Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume: ' + error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user._id;
    
    // console.log('🗑️ Deleting resume:', resumeId, 'for user:', userId);
    
    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId: userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Remove resume reference from user
    await User.findByIdAndUpdate(userId, {
      $pull: { resumes: resumeId }
    });
    
    console.log('✅ Resume deleted successfully');
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume: ' + error.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resumeData = req.body;

    console.log('📥 Generating resume download with dynamic height...');

    if (!resumeData || !resumeData.personalDetails) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    // 1. Generate HTML content with dynamic sizing
    const htmlContent = generateResumeHTML(resumeData);

    // 2. Prepare PDF conversion with dynamic height options
    const file = { content: htmlContent };
    const options = { 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      },
      // Enable content-based height adjustment
      height: 'auto',
      // Optimize for single page layout
      preferCSSPageSize: true,
      displayHeaderFooter: false
    };

    // 3. Generate PDF buffer
    const pdfBuffer = await pdf.generatePdf(file, options);

    // 4. Send PDF to client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${resumeData.personalDetails?.fullName || 'resume'}.pdf"`
    );
    res.end(pdfBuffer);

    console.log('✅ Resume PDF generated with dynamic height optimization');
  } catch (error) {
    console.error('❌ Error generating resume PDF:', error);
    res.status(500).json({ error: 'Failed to generate resume PDF' });
  }
};