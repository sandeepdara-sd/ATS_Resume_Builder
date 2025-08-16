import React from 'react';
import { Box, Typography } from '@mui/material';

function ClassicExecutiveTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
    
    const isContentDense = totalSections > 6 || totalItems > 12;
    
    return {
      sectionSpacing: isContentDense ? 2 : 2.5,
      itemSpacing: isContentDense ? 1.25 : 1.75,
      nameSize: isContentDense ? '1.625rem' : '1.875rem',
      sectionTitleSize: isContentDense ? '0.9375rem' : '1.0625rem',
      itemTitleSize: isContentDense ? '0.8125rem' : '0.875rem',
      bodySize: isContentDense ? '0.6875rem' : '0.75rem',
      smallSize: isContentDense ? '0.625rem' : '0.6875rem',
      lineHeight: isContentDense ? 1.25 : 1.3
    };
  };

  const layout = calculateOptimalLayout();

  return (
    <Box
      sx={{
        fontFamily: '"Times New Roman", "Times", serif',
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
          borderBottom: '2px solid #000000'
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            mb: 1.5,
            fontSize: layout.nameSize,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            lineHeight: 1.1,
            fontFamily: 'inherit'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Typography
          sx={{
            color: '#000000',
            mb: 2,
            fontSize: layout.bodySize,
            fontStyle: 'italic',
            fontFamily: 'inherit'
          }}
        >
          Executive Professional
        </Typography>
        
        <Box sx={{ mb: 1.5 }}>
          {resumeData.personalDetails?.email && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.bodySize, mr: 2.5 }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.bodySize, mr: 2.5 }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.bodySize }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box>
          {resumeData.personalDetails?.linkedin && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2.5 }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Executive Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Executive Summary
          </Typography>
          <Typography 
            sx={{ 
              fontSize: layout.bodySize, 
              lineHeight: 1.4, 
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
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Professional Experience
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    component="h3"
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: layout.itemTitleSize, 
                      color: '#000000', 
                      lineHeight: 1.2,
                      fontFamily: 'inherit'
                    }}
                  >
                    {exp.jobTitle}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: layout.bodySize, 
                      color: '#000000', 
                      fontStyle: 'italic', 
                      lineHeight: 1.2,
                      fontFamily: 'inherit'
                    }}
                  >
                    {exp.company}
                  </Typography>
                  {exp.location && (
                    <Typography 
                      sx={{ 
                        color: '#000000', 
                        fontSize: layout.smallSize,
                        fontFamily: 'inherit'
                      }}
                    >
                      {exp.location}
                    </Typography>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    color: '#000000', 
                    fontSize: layout.bodySize, 
                    fontWeight: 'bold', 
                    textAlign: 'right', 
                    lineHeight: 1.2,
                    fontFamily: 'inherit'
                  }}
                >
                  {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: layout.bodySize, 
                  lineHeight: layout.lineHeight, 
                  color: '#000000', 
                  whiteSpace: 'pre-line', 
                  textAlign: 'justify', 
                  mt: 0.75,
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
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Core Competencies
          </Typography>
          <Typography 
            sx={{ 
              fontSize: layout.bodySize, 
              lineHeight: 1.6, 
              color: '#000000',
              fontFamily: 'inherit'
            }}
          >
            {resumeData.skills.join(' • ')}
          </Typography>
        </Box>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Education
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography 
                    component="h3"
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: layout.itemTitleSize, 
                      color: '#000000', 
                      lineHeight: 1.2,
                      fontFamily: 'inherit'
                    }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: layout.bodySize, 
                      color: '#000000', 
                      fontStyle: 'italic', 
                      lineHeight: 1.2,
                      fontFamily: 'inherit'
                    }}
                  >
                    {edu.institution}, {edu.location}
                  </Typography>
                  {edu.gpa && (
                    <Typography 
                      sx={{ 
                        fontSize: layout.smallSize, 
                        color: '#000000',
                        fontFamily: 'inherit'
                      }}
                    >
                      GPA: {edu.gpa}
                    </Typography>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    color: '#000000', 
                    fontSize: layout.bodySize, 
                    fontWeight: 'bold', 
                    lineHeight: 1.2,
                    fontFamily: 'inherit'
                  }}
                >
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Professional Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Professional Achievements
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Typography 
                component="h3"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: layout.itemTitleSize, 
                  color: '#000000', 
                  lineHeight: 1.2,
                  fontFamily: 'inherit'
                }}
              >
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography 
                  sx={{ 
                    fontSize: layout.bodySize, 
                    color: '#000000', 
                    fontStyle: 'italic', 
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
                    mt: 0.5,
                    textAlign: 'justify',
                    fontFamily: 'inherit'
                  }}
                >
                  {achievement.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Notable Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              borderBottom: '1px solid #000000',
              pb: 0.75,
              lineHeight: 1.2,
              fontFamily: 'inherit'
            }}
          >
            Notable Projects
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, '&:last-child': { mb: 0 } }}>
              <Typography 
                component="h3"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: layout.itemTitleSize, 
                  color: '#000000', 
                  lineHeight: 1.2,
                  fontFamily: 'inherit'
                }}
              >
                {project.name}
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: layout.bodySize, 
                  lineHeight: layout.lineHeight, 
                  color: '#000000', 
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
                    color: '#000000', 
                    mt: 0.375,
                    fontFamily: 'inherit'
                  }}
                >
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