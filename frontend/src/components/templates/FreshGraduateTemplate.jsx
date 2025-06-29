import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function FreshGraduateTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Box
      sx={{
        fontFamily: '"Roboto", "Arial", sans-serif',
        lineHeight: 1.6,
        color: '#333333',
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
      <Box sx={{ textAlign: 'center', mb: 4, pb: 3, borderBottom: '3px solid #4CAF50' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#2E7D32',
            mb: 1,
            fontSize: '2.4rem',
            letterSpacing: '1px'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: '#666666',
            mb: 2,
            fontSize: '1rem',
            fontStyle: 'italic'
          }}
        >
          Fresh Graduate | Aspiring Professional
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body2" sx={{ color: '#555555', fontSize: '0.9rem' }}>
              ✉ {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body2" sx={{ color: '#555555', fontSize: '0.9rem' }}>
              ☎ {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body2" sx={{ color: '#555555', fontSize: '0.9rem' }}>
              📍 {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.85rem' }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.github && (
            <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.85rem' }}>
              GitHub: {resumeData.personalDetails.github.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.85rem' }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Objective/Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            CAREER OBJECTIVE
          </Typography>
          <Box
            sx={{
              backgroundColor: '#F1F8E9',
              border: '1px solid #C8E6C9',
              borderRadius: '8px',
              p: 3
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#333333', textAlign: 'justify' }}>
              {resumeData.summary}
            </Typography>
          </Box>
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
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            EDUCATION
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #E0E0E0', borderRadius: '6px', backgroundColor: '#FAFAFA' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#2E7D32' }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#666666', fontWeight: 500, fontSize: '1rem' }}>
                    {edu.institution}
                  </Typography>
                  {edu.location && (
                    <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.9rem' }}>
                      {edu.location}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: 600 }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#333333', mb: 1 }}>
                  <strong>GPA:</strong> {edu.gpa}
                </Typography>
              )}
              {edu.achievements && (
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#333333', lineHeight: 1.6 }}>
                  <strong>Achievements:</strong> {edu.achievements}
                </Typography>
              )}
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
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            ACADEMIC PROJECTS
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #E0E0E0', borderRadius: '6px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2E7D32' }}>
                  {project.name}
                </Typography>
                {project.duration && (
                  <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.85rem' }}>
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#333333', mb: 1, textAlign: 'justify' }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666666', mb: 0.5 }}>
                    <strong>Technologies Used:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.technologies.split(',').map((tech, techIndex) => (
                      <Box
                        key={techIndex}
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {tech.trim()}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {project.link && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4CAF50' }}>
                  <strong>Project Link:</strong> {project.link}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            TECHNICAL SKILLS
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#F1F8E9',
              border: '1px solid #C8E6C9',
              borderRadius: '6px'
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.skills.map((skill, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    border: '2px solid #4CAF50',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#2E7D32',
                    backgroundColor: 'white',
                    fontWeight: 500
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Experience (if any) */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            INTERNSHIPS & EXPERIENCE
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #E0E0E0', borderRadius: '6px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2E7D32' }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#666666', fontWeight: 500, fontSize: '0.95rem' }}>
                    {exp.company}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: 600 }}>
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              {exp.location && (
                <Typography variant="body2" sx={{ color: '#888888', mb: 1, fontSize: '0.85rem' }}>
                  {exp.location}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#333333', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            ACHIEVEMENTS & CERTIFICATIONS
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#FAFAFA', borderRadius: '4px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#2E7D32' }}>
                🏆 {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.9rem', mb: 0.5 }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#333333' }}>
                  {achievement.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Hobbies & Interests */}
      {resumeData.hobbies && resumeData.hobbies.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#2E7D32',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '4px', height: '20px', backgroundColor: '#4CAF50', mr: 2 }} />
            HOBBIES & INTERESTS
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#F1F8E9',
              border: '1px solid #C8E6C9',
              borderRadius: '6px'
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#333333' }}>
              {resumeData.hobbies.join(' • ')}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default FreshGraduateTemplate;