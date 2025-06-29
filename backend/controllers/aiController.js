import { model } from '../config/gemini.js';

export const generateSummary = async (req, res) => {
  try {
    const { type, personalDetails } = req.body;

    if (!personalDetails || !personalDetails.fullName) {
      return res.status(400).json({ error: 'Personal details required' });
    }

    const prompt = type === 'fresher' 
      ? `Generate a first-person professional summary (starting with "I am...") for a fresh graduate/entry-level candidate with the following details:
         Name: ${personalDetails.fullName}
         Email: ${personalDetails.email || 'Not provided'}

         The summary should be 2-3 sentences highlighting my potential, education background, and career objectives. Make it ATS-friendly and professional. Return only the summary text without any additional formatting.`
     : `Generate a first-person executive summary (starting with "I am...") for an experienced professional with the following details:
        Name: ${personalDetails.fullName}
        Email: ${personalDetails.email || 'Not provided'}

        The summary should be 2-3 sentences highlighting my experience, expertise, and value proposition. Make it ATS-friendly and impactful. Return only the summary text without any additional formatting.`;

    // console.log('Generating summary with prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text().trim();
    
    // console.log('Generated summary:', summaryText);
    
    res.json({ summary: summaryText });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary: ' + error.message });
  }
};

export const generateSkills = async (req, res) => {
  try {
    const { personalDetails, existingSkills } = req.body;

    if (!personalDetails || !personalDetails.fullName) {
      return res.status(400).json({ error: 'Personal details required' });
    }

    const prompt = `Based on the following personal details, suggest 8-10 relevant technical and soft skills for a professional resume:
      Name: ${personalDetails.fullName}
      Email: ${personalDetails.email || 'Not provided'}
      
      Existing skills: ${existingSkills ? existingSkills.join(', ') : 'None'}
      
      Return a JSON array of skill strings. Example: ["Communication", "Problem Solving", "JavaScript", "Project Management"]`;

    // console.log('Generating skills with prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();
    
    // console.log('AI Skills Response:', responseText);

    // Clean up the response to extract JSON array
    responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // Try to find JSON array in the response
    const jsonMatch = responseText.match(/\[.*\]/s);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }
    
    try {
      const skills = JSON.parse(responseText);
      if (Array.isArray(skills) && skills.length > 0) {
        res.json({ skills });
      } else {
        throw new Error('Invalid skills array');
      }
    } catch (parseError) {
      console.error('Skills JSON Parse Error:', parseError);
      console.error('Raw response:', responseText);
      // Fallback skills based on common professional skills
      const fallbackSkills = [
        'Communication', 'Problem Solving', 'Teamwork', 'Leadership',
        'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
        'Project Management', 'Analytical Skills'
      ];
      res.json({ skills: fallbackSkills });
    }
  } catch (error) {
    console.error('Error generating skills:', error);
    res.status(500).json({ error: 'Failed to generate skills: ' + error.message });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and job description required' });
    }

    // Clean keyword extraction helper
    const extractKeywords = (text) => {
      return text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    };

    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(JSON.stringify(resumeData));
    const missingKeywords = jdKeywords.filter(k => !resumeKeywords.includes(k));

    const prompt = `
You are an expert ATS resume evaluator.

Analyze the resume below against the job description. Score based on:
- Skills Match
- Experience Relevance
- Keywords
- Education

Use this JSON format (values are examples only):
{
  "overallScore": 78, // Must be average of detailedScores
  "detailedScores": [
    {"category": "Skills Match", "score": 80},
    {"category": "Experience Relevance", "score": 75},
    {"category": "Keywords", "score": 70},
    {"category": "Education", "score": 85}
  ],
  "missingKeywords": ["Node.js", "Express"],
  "suggestions": [
    "Mention Node.js and Express explicitly",
    "Highlight experience duration in years",
    "Add more technical terms from the job description"
  ]
}

Resume Data: ${JSON.stringify(resumeData)}
Job Description: ${jobDescription}

Ensure:
- Scores are realistic (0-100)
- Suggestions are practical
- overallScore is the average of detailedScores
- Output must be valid JSON only
`;

    console.log('Analyzing resume...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Clean formatting if code blocks present
    responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '');

    // console.log('Analysis Response:', responseText);

    try {
      const analysis = JSON.parse(responseText);

      // Optional: overwrite missing keywords if model fails to extract properly
      if (!analysis.missingKeywords || !Array.isArray(analysis.missingKeywords)) {
        analysis.missingKeywords = missingKeywords.slice(0, 5); // limit to top 5
      }

      // Optional: re-compute overallScore if not accurate
      const scores = analysis.detailedScores?.map(d => d.score) || [];
      if (scores.length) {
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        analysis.overallScore = avgScore;
      }

      res.json(analysis);
    } catch (parseError) {
      console.error('Analysis JSON Parse Error:', parseError);
      // Fallback analysis
      res.json({
        overallScore: 70,
        detailedScores: [
          { category: "Skills Match", score: 70 },
          { category: "Experience Relevance", score: 65 },
          { category: "Keywords", score: 75 },
          { category: "Education", score: 80 }
        ],
        missingKeywords: missingKeywords.slice(0, 5),
        suggestions: [
          "Add more relevant keywords from the job description",
          "Highlight specific achievements with quantifiable results",
          "Include more technical skills mentioned in the job posting"
        ]
      });
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume: ' + error.message });
  }
};

// export const scoreResume = async (req, res) => {
//   try {
//     const { resumeData } = req.body;

//     if (!resumeData || !resumeData.personalDetails) {
//       return res.status(400).json({ error: 'Resume data required' });
//     }

//     const prompt = `
// Analyze this resume and provide an ATS score based on the following criteria:
// - Completeness of sections (30%)
// - Skills relevance and quantity (25%)
// - Experience/Projects quality (25%)
// - Education and achievements (20%)

// Return only a JSON object with this format:
// {
//   "overallScore": 85,
//   "breakdown": {
//     "completeness": 90,
//     "skills": 80,
//     "experience": 85,
//     "education": 85
//   }
// }

// Resume Data: ${JSON.stringify(resumeData)}

// Score between 0-100. Be realistic but fair.`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let responseText = response.text().trim();
    
//     responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
//     try {
//       const scoreData = JSON.parse(responseText);
//       res.json(scoreData);
//     } catch (parseError) {
//       // Fallback scoring
//       res.json({
//         overallScore: 75,
//         breakdown: {
//           completeness: 75,
//           skills: 70,
//           experience: 80,
//           education: 75
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error scoring resume:', error);
//     res.status(500).json({ error: 'Failed to score resume: ' + error.message });
//   }
// };
