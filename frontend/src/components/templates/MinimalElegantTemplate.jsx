import React from 'react';
import { Box, Typography } from '@mui/material';

function MinimalElegantTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Calculate optimal layout
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
    
    const isContentDense = totalSections > 5 || totalItems > 10;
    
    return {
      sectionSpacing: isContentDense ? 2.5 : 3,
      itemSpacing: isContentDense ? 1.5 : 2,
      nameSize: isContentDense ? '2rem' : '2.25rem',
      sectionTitleSize: isContentDense ? '1rem' : '1.125rem',
      itemTitleSize: isContentDense ? '0.875rem' : '0.9375rem',
      bodySize: isContentDense ? '0.75rem' : '0.8125rem',
      smallSize: isContentDense ? '0.6875rem' : '0.75rem',
      lineHeight: isContentDense ? 1.4 : 1.5
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
        padding: '0.75in',
        boxSizing: 'border-box',
        fontSize: layout.bodySize,
        '@media print': {
          margin: 0,
          padding: '0.75in',
          boxShadow: 'none',
          width: '8.5in',
          maxWidth: '8.5in'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: layout.sectionSpacing }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 'normal',
            color: '#000000',
            mb: 2,
            fontSize: layout.nameSize,
            letterSpacing: '2px',
            fontFamily: '"Times New Roman", serif'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ width: '60px', height: '1px', backgroundColor: '#000000', mx: 'auto', mb: 3 }} />
        
        <Box sx={{ mb: 2 }}>
          {resumeData.personalDetails?.email && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.bodySize, mr: 3 }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.bodySize, mr: 3 }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography component="span" sx={{ color: '#333333', fontSize: layout.bodySize }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box>
          {resumeData.personalDetails?.linkedin && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 3 }}>
              {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize }}>
              {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Professional Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: layout.sectionSpacing, textAlign: 'center' }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            Professional Summary
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          <Typography
            sx={{
              fontSize: layout.bodySize,
              lineHeight: 1.6,
              color: '#000000',
              maxWidth: '80%',
              mx: 'auto',
              fontStyle: 'italic',
              textAlign: 'justify',
              fontFamily: 'inherit'
            }}
          >
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              width: '100%'
            }}
          >
            Professional Experience
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                <Box>
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: layout.itemTitleSize,
                      color: '#000000',
                      fontFamily: '"Times New Roman", serif'
                    }}
                  >
                    {exp.jobTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: layout.bodySize,
                      color: '#333333',
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
                    fontFamily: 'inherit',
                    textAlign: 'right'
                  }}
                >
                  {formatDate(exp.startDate)} — {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                  {exp.location && (
                    <>
                      <br />
                      {exp.location}
                    </>
                  )}
                </Typography>
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
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              width: '100%'
            }}
          >
            Core Competencies
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: layout.bodySize,
                lineHeight: 1.8,
                color: '#000000',
                fontFamily: 'inherit'
              }}
            >
              {resumeData.skills.join(' • ')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Notable Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box sx={{ mb: layout.sectionSpacing }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              width: '100%'
            }}
          >
            Notable Projects
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: layout.itemTitleSize,
                    color: '#000000',
                    fontFamily: '"Times New Roman", serif'
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
                  mb: 1,
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
                    color: '#333333',
                    fontStyle: 'italic',
                    fontFamily: 'inherit'
                  }}
                >
                  Technologies: {project.technologies}
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
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              width: '100%'
            }}
          >
            Education
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Box>
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: layout.itemTitleSize,
                      color: '#000000',
                      fontFamily: '"Times New Roman", serif'
                    }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: layout.bodySize,
                      color: '#333333',
                      fontFamily: 'inherit'
                    }}
                  >
                    {edu.institution}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: '#666666',
                    fontSize: layout.smallSize,
                    fontFamily: 'inherit',
                    textAlign: 'right'
                  }}
                >
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  {edu.location && (
                    <>
                      <br />
                      {edu.location}
                    </>
                  )}
                </Typography>
              </Box>
              {edu.gpa && (
                <Typography
                  sx={{
                    fontSize: layout.bodySize,
                    color: '#000000',
                    fontFamily: 'inherit'
                  }}
                >
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
            component="h2"
            sx={{
              fontWeight: 'normal',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              width: '100%'
            }}
          >
            Achievements
            <Box
              sx={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '1px',
                backgroundColor: '#000000'
              }}
            />
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
              <Typography
                component="h3"
                sx={{
                  fontWeight: 'bold',
                  fontSize: layout.itemTitleSize,
                  color: '#000000',
                  fontFamily: '"Times New Roman", serif'
                }}
              >
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography
                  sx={{
                    color: '#333333',
                    fontSize: layout.bodySize,
                    mb: 0.5,
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
    </Box>
  );
}

export default MinimalElegantTemplate;