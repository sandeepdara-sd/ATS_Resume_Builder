import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function ClassicExecutiveTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Box
      sx={{
        fontFamily: '"Times New Roman", serif',
        lineHeight: 1.5,
        color: '#000000',
        backgroundColor: 'white',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        padding: '25mm',
        boxSizing: 'border-box',
        '@media print': {
          margin: 0,
          padding: '20mm',
          boxShadow: 'none'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #000', pb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            mb: 2,
            fontSize: '2.5rem',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: '1rem' }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: '1rem' }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: '1rem' }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#000000', fontSize: '0.9rem' }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#000000', fontSize: '0.9rem' }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Executive Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Executive Summary
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#000000', textAlign: 'justify' }}>
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Professional Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#000000' }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#000000', fontStyle: 'italic' }}>
                    {exp.company}
                  </Typography>
                  {exp.location && (
                    <Typography variant="body2" sx={{ color: '#000000', fontSize: '0.9rem' }}>
                      {exp.location}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ color: '#000000', fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#000000', whiteSpace: 'pre-line', textAlign: 'justify', mt: 1 }}>
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Core Competencies */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Core Competencies
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.8, color: '#000000' }}>
            {resumeData.skills.join(' • ')}
          </Typography>
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#000000' }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.95rem', color: '#000000', fontStyle: 'italic' }}>
                    {edu.institution}, {edu.location}
                  </Typography>
                  {edu.gpa && (
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#000000' }}>
                      GPA: {edu.gpa}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ color: '#000000', fontSize: '1rem', fontWeight: 'bold' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Professional Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Professional Achievements
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#000000' }}>
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body1" sx={{ fontSize: '0.95rem', color: '#000000', fontStyle: 'italic' }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body1" sx={{ fontSize: '0.95rem', color: '#000000', mt: 0.5 }}>
                  {achievement.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#000000',
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 1
            }}
          >
            Notable Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#000000' }}>
                {project.name}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#000000', textAlign: 'justify' }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#000000', mt: 0.5 }}>
                  <strong>Technologies:</strong> {project.technologies}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ClassicExecutiveTemplate;