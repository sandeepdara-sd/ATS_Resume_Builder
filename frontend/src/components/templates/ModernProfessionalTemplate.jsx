import React from 'react';
import { Box, Typography } from '@mui/material';

function ModernProfessionalTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Helper function to format links - ATS friendly
  const formatLink = (url, type) => {
    if (!url) return '';
    
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    switch (type) {
      case 'linkedin':
        if (cleanUrl.includes('linkedin.com')) {
          return cleanUrl;
        }
        return `linkedin.com/in/${cleanUrl}`;
      case 'github':
        if (cleanUrl.includes('github.com')) {
          return cleanUrl;
        }
        return `github.com/${cleanUrl}`;
      case 'website':
        return cleanUrl;
      default:
        return cleanUrl;
    }
  };

  // Calculate optimal layout based on content density
  const calculateOptimalLayout = () => {
    let totalSections = 0;
    let totalItems = 0;
    
    if (resumeData.summary) totalSections++;
    if (resumeData.experience?.length > 0) {
      totalSections++;
      totalItems += resumeData.experience.length;
    }
    if (resumeData.projects?.length > 0) {
      totalSections++;
      totalItems += resumeData.projects.length;
    }
    if (resumeData.education?.length > 0) {
      totalSections++;
      totalItems += resumeData.education.length;
    }
    if (resumeData.skills?.length > 0) totalSections++;
    if (resumeData.achievements?.length > 0) {
      totalSections++;
      totalItems += resumeData.achievements.length;
    }
    if (resumeData.hobbies?.length > 0) totalSections++;
    
    const isContentDense = totalSections > 6 || totalItems > 12;
    
    return {
      sectionSpacing: isContentDense ? 2 : 2.5,
      itemSpacing: isContentDense ? 1.25 : 1.75,
      nameSize: isContentDense ? '1.5rem' : '1.75rem',
      sectionTitleSize: isContentDense ? '0.875rem' : '1rem',
      itemTitleSize: isContentDense ? '0.8125rem' : '0.875rem',
      bodySize: isContentDense ? '0.6875rem' : '0.75rem',
      smallSize: isContentDense ? '0.625rem' : '0.6875rem',
      lineHeight: isContentDense ? 1.3 : 1.4
    };
  };

  const layout = calculateOptimalLayout();

  return (
    <Box
      sx={{
        fontFamily: '"Arial", "Helvetica", sans-serif',
        lineHeight: layout.lineHeight,
        color: '#000000',
        backgroundColor: '#ffffff',
        width: '8.5in',
        maxWidth: '8.5in',
        minHeight: '11in',
        margin: '0 auto',
        padding: '0.5in',
        boxSizing: 'border-box',
        fontSize: layout.bodySize,
        '@media print': {
          margin: 0,
          padding: '0.5in',
          boxShadow: 'none',
          width: '8.5in',
          maxWidth: '8.5in'
        }
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: layout.sectionSpacing,
          pb: layout.itemSpacing,
          borderBottom: '1px solid #cccccc'
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            mb: 1,
            fontSize: layout.nameSize,
            letterSpacing: '0.5px',
            lineHeight: 1.2,
            fontFamily: 'inherit'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ mb: 0.75 }}>
          {resumeData.personalDetails?.email && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.smallSize, mr: 1 }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.smallSize, mr: 1 }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.smallSize }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box>
          {resumeData.personalDetails?.linkedin && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 1 }}>
              LinkedIn: {formatLink(resumeData.personalDetails.linkedin, 'linkedin')}
            </Typography>
          )}
          {resumeData.personalDetails?.github && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 1 }}>
              GitHub: {formatLink(resumeData.personalDetails.github, 'github')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize }}>
              Portfolio: {formatLink(resumeData.personalDetails.website, 'website')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Professional Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Professional Summary
          </Typography>
          <Typography 
            sx={{ 
              fontSize: layout.bodySize, 
              lineHeight: 1.5, 
              color: '#000000',
              textAlign: 'justify',
              fontFamily: 'inherit'
            }}
          >
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Professional Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ mb: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      component="h3"
                      sx={{ 
                        fontSize: layout.itemTitleSize, 
                        fontWeight: 'bold', 
                        color: '#000000', 
                        lineHeight: 1.2,
                        mb: 0.25,
                        fontFamily: 'inherit'
                      }}
                    >
                      {exp.jobTitle}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: '#333333', 
                        fontWeight: 'bold', 
                        fontSize: layout.bodySize, 
                        lineHeight: 1.2,
                        mb: 0.25,
                        fontFamily: 'inherit'
                      }}
                    >
                      {exp.company}
                    </Typography>
                  </Box>
                  <Typography 
                    sx={{ 
                      color: '#666666', 
                      fontSize: layout.smallSize, 
                      fontWeight: 'normal',
                      lineHeight: 1.2,
                      textAlign: 'right',
                      fontFamily: 'inherit'
                    }}
                  >
                    {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  </Typography>
                </Box>
                {exp.location && (
                  <Typography 
                    sx={{ 
                      color: '#666666', 
                      fontSize: layout.smallSize,
                      fontStyle: 'italic',
                      mb: 0.5,
                      fontFamily: 'inherit'
                    }}
                  >
                    {exp.location}
                  </Typography>
                )}
              </Box>
              <Typography 
                sx={{ 
                  fontSize: layout.bodySize, 
                  lineHeight: layout.lineHeight, 
                  color: '#000000', 
                  whiteSpace: 'pre-line',
                  textAlign: 'justify',
                  fontFamily: 'inherit'
                }}
              >
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Core Competencies */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Core Competencies
          </Typography>
          <Typography 
            sx={{ 
              fontSize: layout.bodySize, 
              lineHeight: 1.5, 
              color: '#000000',
              fontFamily: 'inherit'
            }}
          >
            {resumeData.skills.join(' • ')}
          </Typography>
        </Box>
      )}

      {/* Key Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Key Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Typography 
                  component="h3"
                  sx={{ 
                    fontSize: layout.itemTitleSize, 
                    fontWeight: 'bold', 
                    color: '#000000', 
                    lineHeight: 1.2,
                    fontFamily: 'inherit'
                  }}
                >
                  {project.name}
                </Typography>
                {project.duration && (
                  <Typography 
                    sx={{ 
                      color: '#666666', 
                      fontSize: layout.smallSize,
                      fontFamily: 'inherit'
                    }}
                  >
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography 
                sx={{ 
                  fontSize: layout.bodySize, 
                  lineHeight: layout.lineHeight, 
                  color: '#000000', 
                  mb: 0.5,
                  textAlign: 'justify',
                  fontFamily: 'inherit'
                }}
              >
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography 
                  sx={{ 
                    fontSize: layout.smallSize, 
                    color: '#666666',
                    fontStyle: 'italic',
                    mb: 0.25,
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>Technologies:</strong> {project.technologies}
                </Typography>
              )}
              {project.link && (
                <Typography 
                  sx={{ 
                    fontSize: layout.smallSize, 
                    color: '#000000',
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>Link:</strong> {formatLink(project.link, 'website')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    component="h3"
                    sx={{ 
                      fontSize: layout.itemTitleSize, 
                      fontWeight: 'bold', 
                      color: '#000000', 
                      lineHeight: 1.2,
                      mb: 0.25,
                      fontFamily: 'inherit'
                    }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#333333', 
                      fontWeight: 'bold', 
                      fontSize: layout.bodySize, 
                      lineHeight: 1.2,
                      mb: 0.25,
                      fontFamily: 'inherit'
                    }}
                  >
                    {edu.institution}
                  </Typography>
                  {edu.location && (
                    <Typography 
                      sx={{ 
                        color: '#666666', 
                        fontSize: layout.smallSize,
                        fontStyle: 'italic',
                        fontFamily: 'inherit'
                      }}
                    >
                      {edu.location}
                    </Typography>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    color: '#666666', 
                    fontSize: layout.smallSize,
                    textAlign: 'right',
                    fontFamily: 'inherit'
                  }}
                >
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography 
                  sx={{ 
                    fontSize: layout.bodySize, 
                    color: '#000000',
                    mb: 0.5,
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>GPA:</strong> {edu.gpa}
                </Typography>
              )}
              {edu.achievements && (
                <Typography 
                  sx={{ 
                    fontSize: layout.bodySize, 
                    color: '#000000',
                    textAlign: 'justify',
                    fontFamily: 'inherit'
                  }}
                >
                  {edu.achievements}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Achievements & Certifications */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Achievements & Certifications
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography 
                  component="h3"
                  sx={{ 
                    fontSize: layout.itemTitleSize, 
                    fontWeight: 'bold', 
                    color: '#000000', 
                    lineHeight: 1.2,
                    fontFamily: 'inherit'
                  }}
                >
                  {achievement.title}
                </Typography>
                {achievement.date && (
                  <Typography 
                    sx={{ 
                      color: '#666666', 
                      fontSize: layout.smallSize,
                      fontFamily: 'inherit'
                    }}
                  >
                    {formatDate(achievement.date)}
                  </Typography>
                )}
              </Box>
              {achievement.organization && (
                <Typography 
                  sx={{ 
                    color: '#333333', 
                    fontSize: layout.bodySize, 
                    fontWeight: 'bold',
                    mb: 0.5,
                    lineHeight: 1.2,
                    fontFamily: 'inherit'
                  }}
                >
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography 
                  sx={{ 
                    fontSize: layout.bodySize, 
                    color: '#000000',
                    mb: 0.5,
                    textAlign: 'justify',
                    fontFamily: 'inherit'
                  }}
                >
                  {achievement.description}
                </Typography>
              )}
              {achievement.link && (
                <Typography 
                  sx={{ 
                    fontSize: layout.smallSize, 
                    color: '#000000',
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>Link:</strong> {formatLink(achievement.link, 'website')}
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
            component="h2"
            sx={{
              fontSize: layout.sectionTitleSize,
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: layout.itemSpacing,
              pb: 0.5,
              borderBottom: '1px solid #cccccc',
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Hobbies & Interests
          </Typography>
          <Typography 
            sx={{ 
              fontSize: layout.bodySize, 
              lineHeight: 1.4, 
              color: '#000000',
              fontFamily: 'inherit'
            }}
          >
            {resumeData.hobbies.join(' • ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ModernProfessionalTemplate;
