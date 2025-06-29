import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';

function ModernProfessionalTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Helper function to format links with placeholders
  const formatLink = (url, type) => {
    if (!url) return '';
    
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    switch (type) {
      case 'linkedin':
        if (cleanUrl.includes('linkedin.com')) {
          const username = cleanUrl.replace('linkedin.com/in/', '').replace('linkedin.com/', '');
          return `linkedin.com/in/${username}`;
        }
        return cleanUrl;
      case 'github':
        if (cleanUrl.includes('github.com')) {
          const username = cleanUrl.replace('github.com/', '');
          return `github.com/${username}`;
        }
        return cleanUrl;
      case 'website':
        return cleanUrl;
      default:
        return cleanUrl;
    }
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
    if (resumeData.hobbies?.length > 0) contentSections++;
    
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
      nameSize: isContentHeavy ? '2rem' : '2.2rem',
      sectionTitleSize: isContentHeavy ? '1rem' : '1.1rem',
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
        fontFamily: '"Inter", sans-serif',
        lineHeight: 1.4,
        color: '#2d3748',
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
      <Box sx={{ textAlign: 'center', mb: spacing.baseSpacing }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1a202c',
            mb: 0.75,
            fontSize: fonts.nameSize,
            letterSpacing: '-0.5px',
            lineHeight: 1.1
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: fonts.smallSize }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: fonts.smallSize }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body2" sx={{ color: '#4a5568', fontSize: fonts.smallSize }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: fonts.smallSize }}>
              LinkedIn: {formatLink(resumeData.personalDetails.linkedin, 'linkedin')}
            </Typography>
          )}
          {resumeData.personalDetails?.github && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: fonts.smallSize }}>
              GitHub: {formatLink(resumeData.personalDetails.github, 'github')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#3182ce', fontSize: fonts.smallSize }}>
              Portfolio: {formatLink(resumeData.personalDetails.website, 'website')}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: spacing.itemSpacing, borderColor: '#e2e8f0', borderWidth: 1 }} />

      {/* Professional Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Professional Summary
          </Typography>
          <Typography variant="body2" sx={{ fontSize: fonts.bodySize, lineHeight: 1.5, color: '#4a5568' }}>
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: fonts.itemTitleSize, color: '#2d3748', lineHeight: 1.2 }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#3182ce', fontWeight: 500, fontSize: fonts.bodySize, lineHeight: 1.2 }}>
                    {exp.company}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: fonts.smallSize, fontWeight: 500, lineHeight: 1.2 }}>
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              {exp.location && (
                <Typography variant="body2" sx={{ color: '#718096', mb: 0.75, fontSize: fonts.smallSize }}>
                  {exp.location}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#4a5568', whiteSpace: 'pre-line' }}>
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Core Competencies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {resumeData.skills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  display: 'inline-block',
                  px: 1.25,
                  py: 0.375,
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  fontSize: fonts.smallSize,
                  color: '#4a5568',
                  backgroundColor: '#f7fafc',
                  lineHeight: 1.2
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
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Key Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: fonts.itemTitleSize, color: '#2d3748', lineHeight: 1.2 }}>
                  {project.name}
                </Typography>
                {project.duration && (
                  <Typography variant="body2" sx={{ color: '#718096', fontSize: fonts.smallSize }}>
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#4a5568', mb: 0.5 }}>
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography variant="body2" sx={{ fontSize: fonts.smallSize, color: '#718096', mb: 0.5 }}>
                  <strong>Technologies:</strong> {project.technologies}
                </Typography>
              )}
              {project.link && (
                <Typography variant="body2" sx={{ fontSize: fonts.smallSize, color: '#3182ce' }}>
                  <strong>Link:</strong> {formatLink(project.link, 'website')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: fonts.itemTitleSize, color: '#2d3748', lineHeight: 1.2 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#3182ce', fontWeight: 500, fontSize: fonts.bodySize, lineHeight: 1.2 }}>
                    {edu.institution}
                  </Typography>
                  {edu.location && (
                    <Typography variant="body2" sx={{ color: '#718096', fontSize: fonts.smallSize }}>
                      {edu.location}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#718096', fontSize: fonts.smallSize }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography variant="body2" sx={{ fontSize: fonts.bodySize, color: '#4a5568' }}>
                  <strong>GPA:</strong> {edu.gpa}
                </Typography>
              )}
              {edu.achievements && (
                <Typography variant="body2" sx={{ fontSize: fonts.bodySize, color: '#4a5568', mt: 0.5 }}>
                  {edu.achievements}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: spacing.baseSpacing }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Achievements & Certifications
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: spacing.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: fonts.itemTitleSize, color: '#2d3748', lineHeight: 1.2 }}>
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography variant="body2" sx={{ color: '#3182ce', fontSize: fonts.bodySize, mb: 0.5, lineHeight: 1.2 }}>
                  {achievement.organization}
                </Typography>
              )}
              {achievement.date && (
                <Typography variant="body2" sx={{ color: '#718096', fontSize: fonts.smallSize, mb: 0.5 }}>
                  {formatDate(achievement.date)}
                </Typography>
              )}
              {achievement.description && (
                <Typography variant="body2" sx={{ fontSize: fonts.bodySize, color: '#4a5568', mb: 0.5 }}>
                  {achievement.description}
                </Typography>
              )}
              {achievement.link && (
                <Typography variant="body2" sx={{ fontSize: fonts.smallSize, color: '#3182ce' }}>
                  <strong>Link:</strong> {formatLink(achievement.link, 'website')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Hobbies */}
      {resumeData.hobbies && resumeData.hobbies.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: spacing.itemSpacing,
              color: '#2d3748',
              fontSize: fonts.sectionTitleSize,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2
            }}
          >
            Hobbies & Interests
          </Typography>
          <Typography variant="body2" sx={{ fontSize: fonts.bodySize, lineHeight: 1.4, color: '#4a5568' }}>
            {resumeData.hobbies.join(' • ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ModernProfessionalTemplate;