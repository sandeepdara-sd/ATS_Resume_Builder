import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function TechFocusedTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Categorize skills for better organization
  const categorizeSkills = (skills) => {
    const categories = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Other Skills': []
    };

    const programmingKeywords = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails'];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack', 'babel', 'npm', 'yarn'];

    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (programmingKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Programming Languages'].push(skill);
      } else if (frameworkKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Frameworks & Libraries'].push(skill);
      } else if (toolKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Tools & Technologies'].push(skill);
      } else {
        categories['Other Skills'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = resumeData.skills ? categorizeSkills(resumeData.skills) : {};

  return (
    <Box
      sx={{
        fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
        lineHeight: 1.6,
        color: '#2d3748',
        backgroundColor: 'white',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        padding: '20mm',
        boxSizing: 'border-box',
        '@media print': {
          margin: 0,
          padding: '15mm',
          boxShadow: 'none'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            backgroundColor: '#00d9ff',
            borderRadius: '2px'
          }}
        />
        <Box sx={{ pl: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1a202c',
              mb: 1,
              fontSize: '2.2rem',
              fontFamily: '"Inter", sans-serif'
            }}
          >
            {resumeData.personalDetails?.fullName || 'Your Name'}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#00d9ff',
              mb: 2,
              fontSize: '1.1rem',
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif'
            }}
          >
            Software Developer
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {resumeData.personalDetails?.email && (
              <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
                📧 {resumeData.personalDetails.email}
              </Typography>
            )}
            {resumeData.personalDetails?.phone && (
              <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
                📱 {resumeData.personalDetails.phone}
              </Typography>
            )}
            {resumeData.personalDetails?.location && (
              <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
                📍 {resumeData.personalDetails.location}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {resumeData.personalDetails?.github && (
              <Typography variant="body2" sx={{ color: '#00d9ff', fontSize: '0.85rem' }}>
                🔗 {resumeData.personalDetails.github.replace('https://', '')}
              </Typography>
            )}
            {resumeData.personalDetails?.linkedin && (
              <Typography variant="body2" sx={{ color: '#00d9ff', fontSize: '0.85rem' }}>
                💼 {resumeData.personalDetails.linkedin.replace('https://', '')}
              </Typography>
            )}
            {resumeData.personalDetails?.website && (
              <Typography variant="body2" sx={{ color: '#00d9ff', fontSize: '0.85rem' }}>
                🌐 {resumeData.personalDetails.website.replace('https://', '')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            ABOUT
          </Typography>
          <Box
            sx={{
              backgroundColor: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              p: 2,
              fontFamily: '"Inter", sans-serif'
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#4a5568' }}>
              {resumeData.summary}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Technical Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            TECHNICAL SKILLS
          </Typography>
          
          {Object.entries(skillCategories).map(([category, skills]) => (
            skills.length > 0 && (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    mb: 1,
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {category}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.map((skill, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        backgroundColor: '#00d9ff',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        fontFamily: '"Fira Code", monospace'
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          ))}
        </Box>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            EXPERIENCE
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 3, position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '2px',
                  height: '100%',
                  backgroundColor: '#e2e8f0'
                }}
              />
              <Box sx={{ pl: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a202c', fontFamily: '"Inter", sans-serif' }}>
                      {exp.jobTitle}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#00d9ff', fontWeight: 500, fontSize: '0.9rem', fontFamily: '"Inter", sans-serif' }}>
                      {exp.company}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: '#00d9ff',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </Box>
                </Box>
                {exp.location && (
                  <Typography variant="body2" sx={{ color: '#718096', mb: 1, fontSize: '0.85rem' }}>
                    📍 {exp.location}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4a5568', whiteSpace: 'pre-line', fontFamily: '"Inter", sans-serif' }}>
                  {exp.responsibilities}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            PROJECTS
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a202c', fontFamily: '"Inter", sans-serif' }}>
                  🚀 {project.name}
                </Typography>
                {project.duration && (
                  <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.8rem' }}>
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4a5568', mb: 1, fontFamily: '"Inter", sans-serif' }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {project.technologies.split(',').map((tech, techIndex) => (
                    <Box
                      key={techIndex}
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.25,
                        backgroundColor: '#f7fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        color: '#4a5568',
                        fontFamily: '"Fira Code", monospace'
                      }}
                    >
                      {tech.trim()}
                    </Box>
                  ))}
                </Box>
              )}
              {project.link && (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#00d9ff' }}>
                  🔗 {project.link}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            EDUCATION
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a202c', fontFamily: '"Inter", sans-serif' }}>
                    🎓 {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#00d9ff', fontWeight: 500, fontSize: '0.9rem', fontFamily: '"Inter", sans-serif' }}>
                    {edu.institution}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.8rem' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4a5568', fontFamily: '"Inter", sans-serif' }}>
                  GPA: {edu.gpa}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#1a202c',
              fontSize: '1.1rem',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '20px', height: '2px', backgroundColor: '#00d9ff', mr: 2 }} />
            ACHIEVEMENTS
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a202c', fontFamily: '"Inter", sans-serif' }}>
                🏆 {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body2" sx={{ color: '#00d9ff', fontSize: '0.85rem', mb: 0.5, fontFamily: '"Inter", sans-serif' }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4a5568', fontFamily: '"Inter", sans-serif' }}>
                  {achievement.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TechFocusedTemplate;