import { groq } from '../config/groq.js';

export const generateSummary = async (req, res) => {
  try {
    const { type, personalDetails } = req.body;

    if (!personalDetails || !personalDetails.fullName) {
      return res.status(400).json({ error: 'Personal details required' });
    }

    const prompt = type === 'fresher' 
      ? `Generate a professional summary for a fresh graduate/entry-level candidate with the following details:
         Name: ${personalDetails.fullName}
         Email: ${personalDetails.email || 'Not provided'}
         
         The summary should be 2-3 sentences highlighting their potential, education background, and career objectives. Make sure you generate the summary as you are the user. Make it ATS-friendly and professional. Return only the summary text without any additional formatting.`
      : `Generate an executive summary for an experienced professional with the following details:
         Name: ${personalDetails.fullName}
         Email: ${personalDetails.email || 'Not provided'}
         
         The summary should be 2-3 sentences highlighting their experience, expertise, and value proposition. Make sure you generate the summary as you are the user. Make it ATS-friendly and impactful. Return only the summary text without any additional formatting.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // or 'mixtral-8x7b-32768'
      temperature: 0.7,
      max_tokens: 500
    });

    const summaryText = completion.choices[0]?.message?.content?.trim();
    
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
      
      Return ONLY a JSON array of skill strings. Example: ["Communication", "Problem Solving", "JavaScript", "Project Management"]
      Do not include any explanations, just the JSON array.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 500
    });

    let responseText = completion.choices[0]?.message?.content?.trim();
    
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

    // Improved keyword extraction - filter out company names, locations, common words
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'from', 'this', 'that', 'will', 'have', 'been',
      'your', 'their', 'about', 'would', 'there', 'which', 'when', 'where', 'what',
      'pvt', 'ltd', 'company', 'innovation', 'innovations', 'tech', 'india', 'site',
      'hyderabad', 'bangalore', 'mumbai', 'delhi', 'pune', 'chennai', 'telangana',
      'career', 'careers', 'apply', 'application', 'email', 'phone', 'contact',
      'send', 'resume', 'updated', 'subject', 'position', 'role', 'required'
    ]);

    const extractKeywords = (text) => {
      // Extract words that are 3+ characters, alphanumeric
      const words = text.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
      // Filter out stop words and return unique keywords
      return [...new Set(words.filter(w => !stopWords.has(w)))];
    };

    const jdKeywords = extractKeywords(jobDescription);
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    // Only consider keywords that appear in JD but not in resume
    const missingKeywords = jdKeywords.filter(keyword => 
      !resumeText.includes(keyword)
    );

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the resume against the job description and provide a detailed scoring.

**Important Instructions:**
1. Focus on TECHNICAL skills, programming languages, frameworks, tools, and relevant experience
2. Ignore company names, locations, and generic business terms when identifying missing keywords
3. Missing keywords should be: technical skills, tools, frameworks, methodologies mentioned in JD but absent in resume
4. Be realistic with scores - most resumes score between 60-85
5. Provide actionable suggestions focused on technical improvements

Return your analysis in this EXACT JSON format:
{
  "overallScore": 75,
  "detailedScores": [
    {"category": "Skills Match", "score": 80},
    {"category": "Experience Relevance", "score": 75},
    {"category": "Keywords", "score": 70},
    {"category": "Education", "score": 85}
  ],
  "missingKeywords": ["Node.js", "MongoDB", "REST API", "React.js"],
  "suggestions": [
    "Add specific Node.js and Express.js experience to your skills section",
    "Mention MongoDB or database management in your projects",
    "Highlight any REST API development experience",
    "Include React.js framework if you have experience with it"
  ]
}

**Resume Data:**
${JSON.stringify(resumeData, null, 2)}

**Job Description:**
${jobDescription}

**Rules:**
- overallScore must be the average of detailedScores (calculate it precisely)
- missingKeywords should only include TECHNICAL terms (languages, frameworks, tools, methodologies)
- Exclude: company names, locations, generic business words, job titles
- Each suggestion must be specific and actionable
- Return ONLY valid JSON, no explanations or markdown
`;

    console.log('Analyzing resume with Groq...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS resume analyzer. Return only valid JSON with technical keyword analysis. Focus on skills, technologies, and frameworks - not company names or locations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000
    });

    let responseText = completion.choices[0]?.message?.content?.trim();

    // Clean formatting if code blocks present
    responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    console.log('Analysis Response:', responseText);

    try {
      const analysis = JSON.parse(responseText);

      // Filter missing keywords to only include technical/relevant terms
      if (analysis.missingKeywords && Array.isArray(analysis.missingKeywords)) {
        analysis.missingKeywords = analysis.missingKeywords
          .filter(keyword => {
            const k = keyword.toLowerCase();
            // Keep only if it's likely a technical term
            return !stopWords.has(k) && 
                   k.length >= 3 && 
                   !k.match(/\d{4,}/) && // No years like 2024
                   !k.includes('@'); // No email parts
          })
          .slice(0, 8); // Limit to top 8 keywords
      } else {
        // Fallback: use our extracted missing keywords but filter them
        analysis.missingKeywords = missingKeywords
          .filter(k => {
            const lower = k.toLowerCase();
            // Prioritize technical-sounding terms
            return (
              k.length >= 3 &&
              !stopWords.has(lower) &&
              (
                lower.includes('js') || 
                lower.includes('java') || 
                lower.includes('python') ||
                lower.includes('sql') ||
                lower.includes('api') ||
                lower.includes('cloud') ||
                lower.includes('aws') ||
                lower.includes('docker') ||
                lower.includes('react') ||
                lower.includes('node') ||
                lower.includes('spring') ||
                lower.includes('mongodb') ||
                lower.includes('git')
              )
            );
          })
          .slice(0, 8);
      }

      // Ensure overallScore is accurate average
      const scores = analysis.detailedScores?.map(d => d.score) || [];
      if (scores.length) {
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        analysis.overallScore = avgScore;
      }

      // Ensure we have at least some suggestions
      if (!analysis.suggestions || analysis.suggestions.length === 0) {
        analysis.suggestions = [
          "Add more specific technical skills from the job description",
          "Quantify your achievements with metrics and numbers",
          "Include relevant keywords naturally throughout your resume",
          "Highlight project outcomes and technologies used"
        ];
      }

      res.json(analysis);
    } catch (parseError) {
      console.error('Analysis JSON Parse Error:', parseError);
      console.error('Raw response:', responseText);
      
      // Enhanced fallback analysis
      const technicalKeywords = missingKeywords.filter(k => {
        const lower = k.toLowerCase();
        return (
          (lower.includes('js') || 
           lower.includes('java') || 
           lower.includes('python') ||
           lower.includes('sql') ||
           lower.includes('api') ||
           lower.includes('react') ||
           lower.includes('node') ||
           lower.includes('mongodb') ||
           lower.includes('spring') ||
           lower.includes('git') ||
           lower.includes('cloud') ||
           lower.includes('aws')) &&
          !stopWords.has(lower)
        );
      }).slice(0, 6);

      res.json({
        overallScore: 72,
        detailedScores: [
          { category: "Skills Match", score: 70 },
          { category: "Experience Relevance", score: 68 },
          { category: "Keywords", score: 75 },
          { category: "Education", score: 78 }
        ],
        missingKeywords: technicalKeywords.length > 0 ? technicalKeywords : [
          "Add relevant technical skills from job description"
        ],
        suggestions: [
          "Include specific technical frameworks and tools mentioned in the job posting",
          "Add quantifiable achievements to your experience and projects",
          "Highlight relevant coursework or certifications",
          "Ensure your skills section matches the required technical stack"
        ]
      });
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume: ' + error.message });
  }
};