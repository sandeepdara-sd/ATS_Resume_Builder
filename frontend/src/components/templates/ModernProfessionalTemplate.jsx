import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';

function ModernProfessionalTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Box
      sx={{
        fontFamily: '"Inter", sans-serif',
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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1a202c',
            mb: 1,
            fontSize: '2.2rem',
            letterSpacing: '-0.5px'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: '0.85rem' }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.github && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: '0.85rem' }}>
              GitHub: {resumeData.personalDetails.github.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: '0.85rem' }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: '#e2e8f0', borderWidth: 1 }} />

      {/* Professional Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Professional Summary
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#4a5568' }}>
            {resumeData.summary}
          </Typography>
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
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#3182ce', fontWeight: 500, fontSize: '0.9rem' }}>
                    {exp.company}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.85rem', fontWeight: 500 }}>
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              {exp.location && (
                <Typography variant="body2" sx={{ color: '#718096', mb: 1, fontSize: '0.85rem' }}>
                  {exp.location}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4a5568', whiteSpace: 'pre-line' }}>
                {exp.responsibilities}
              </Typography>
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
              mb: 2,
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Core Competencies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {resumeData.skills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  color: '#4a5568',
                  backgroundColor: '#f7fafc'
                }}
              >
                {skill}
              </Box>
            ))}
          </Box>
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
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Key Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>
                  {project.name}
                </Typography>
                {project.duration && (
                  <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.85rem' }}>
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4a5568', mb: 1 }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#718096' }}>
                  <strong>Technologies:</strong> {project.technologies}
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
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#2d3748' }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#3182ce', fontWeight: 500, fontSize: '0.9rem' }}>
                    {edu.institution}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.85rem' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4a5568' }}>
                  <strong>GPA:</strong> {edu.gpa}
                </Typography>
              )}
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
              color: '#2d3748',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Achievements & Certifications
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#2d3748' }}>
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body2" sx={{ color: '#3182ce', fontSize: '0.85rem', mb: 0.5 }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4a5568' }}>
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

export default ModernProfessionalTemplate;