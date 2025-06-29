import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function ClassicExecutiveTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Calculate dynamic spacing and font sizes based on content
  const calculateDynamicSpacing = () => {
    let contentSections = 0;
    
    if (resumeData.summary) contentSections++;
    if (resumeData.experience?.length > 0) contentSections++;
    if (resumeData.projects?.length > 0) contentSections++;
    if (resumeData.education?.length > 0) contentSections++;
    if (resumeData.skills?.length > 0) contentSections++;
    if (resumeData.achievements?.length > 0) contentSections++;
    
    const baseSpacing = contentSections <= 4 ? 4 : contentSections <= 6 ? 3 : 2;
    const itemSpacing = contentSections <= 4 ? 3 : contentSections <= 6 ? 2 : 1.5;
    
    return { baseSpacing, itemSpacing };
  };

  const getDynamicFontSizes = () => {
    let totalItems = 0;
    
    if (resumeData.experience) totalItems += resumeData.experience.length;
    if (resumeData.projects) totalItems += resumeData.projects.length;
    if (resumeData.education) totalItems += resumeData.education.length;
    if (resumeData.achievements) totalItems += resumeData.achievements.length;
    
    const isContentHeavy = totalItems > 8;
    
    return {
      nameSize: isContentHeavy ? '2.2rem' : '2.5rem',
      sectionTitleSize: isContentHeavy ? '1.2rem' : '1.3rem',
      itemTitleSize: isContentHeavy ? '0.9rem' : '1rem',
      bodySize: isContentHeavy ? '0.8rem' : '0.85rem',
      smallSize: isContentHeavy ? '0.75rem' : '0.8rem'
    };
  };

  const spacing = calculateDynamicSpacing();
  const fonts = getDynamicFontSizes();

  return (
    <Box
      sx={{
        fontFamily: '"Times New Roman", serif',
        lineHeight: 1.3,
        color: '#000000',
        backgroundColor: 'white',
        width: '210mm',
        minHeight: 'auto',
        margin: '0 auto',
        padding: '15mm',
        boxSizing: 'border-box',
        '@media print': {
          margin: 0,
          padding: '10mm',
          boxShadow: 'none'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: spacing.baseSpacing, borderBottom: '2px solid #000', pb: spacing.itemSpacing }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            mb: 1.5,
            fontSize: fonts.nameSize,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            lineHeight: 1.1
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2.5, mb: 1.5 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: fonts.bodySize }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: fonts.bodySize }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body1" sx={{ color: '#000000', fontSize: fonts.bodySize }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2.5 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#000000', fontSize: fonts.smallSize }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#000000', fontSize: fonts.smallSize }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Executive Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Executive Summary
          </Typography>
          <Typography variant="body1" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#000000', textAlign: 'justify' }}>
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Professional Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: fonts.itemTitleSize, color: '#000000', lineHeight: 1.2 }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: fonts.bodySize, color: '#000000', fontStyle: 'italic', lineHeight: 1.2 }}>
                    {exp.company}
                  </Typography>
                  {exp.location && (
                    <Typography variant="body2" sx={{ color: '#000000', fontSize: fonts.smallSize }}>
                      {exp.location}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ color: '#000000', fontSize: fonts.bodySize, fontWeight: 'bold', textAlign: 'right', lineHeight: 1.2 }}>
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#000000', whiteSpace: 'pre-line', textAlign: 'justify', mt: 0.75 }}>
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Core Competencies */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Core Competencies
          </Typography>
          <Typography variant="body1" sx={{ fontSize: fonts.bodySize, lineHeight: 1.6, color: '#000000' }}>
            {resumeData.skills.join(' • ')}
          </Typography>
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: fonts.itemTitleSize, color: '#000000', lineHeight: 1.2 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: fonts.bodySize, color: '#000000', fontStyle: 'italic', lineHeight: 1.2 }}>
                    {edu.institution}, {edu.location}
                  </Typography>
                  {edu.gpa && (
                    <Typography variant="body2" sx={{ fontSize: fonts.smallSize, color: '#000000' }}>
                      GPA: {edu.gpa}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ color: '#000000', fontSize: fonts.bodySize, fontWeight: 'bold', lineHeight: 1.2 }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Professional Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Professional Achievements
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: fonts.itemTitleSize, color: '#000000', lineHeight: 1.2 }}>
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body1" sx={{ fontSize: fonts.bodySize, color: '#000000', fontStyle: 'italic', lineHeight: 1.2 }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body1" sx={{ fontSize: fonts.bodySize, color: '#000000', mt: 0.5 }}>
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
              mb: spacing.itemSpacing,
              color: '#000000',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000',
              pb: 0.75,
              lineHeight: 1.2
            }}
          >
            Notable Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: fonts.itemTitleSize, color: '#000000', lineHeight: 1.2 }}>
                {project.name}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#000000', textAlign: 'justify' }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography variant="body2" sx={{ fontSize: fonts.smallSize, color: '#000000', mt: 0.375 }}>
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