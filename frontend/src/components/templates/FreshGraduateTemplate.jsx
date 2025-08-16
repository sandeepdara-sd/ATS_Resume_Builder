import React from 'react';
import { Box, Typography } from '@mui/material';

function FreshGraduateTemplate({ resumeData }) {
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
    if (resumeData.hobbies?.length > 0) totalSections++;
    
    const isContentDense = totalSections > 6 || totalItems > 10;
    
    return {
      sectionSpacing: isContentDense ? 2 : 2.5,
      itemSpacing: isContentDense ? 1.25 : 1.75,
      nameSize: isContentDense ? '1.625rem' : '1.875rem',
      sectionTitleSize: isContentDense ? '0.9375rem' : '1.0625rem',
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
          borderBottom: '2px solid #000000' 
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            mb: 1,
            fontSize: layout.nameSize,
            letterSpacing: '1px',
            fontFamily: 'inherit'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Typography
          sx={{
            color: '#333333',
            mb: 2,
            fontSize: layout.bodySize,
            fontStyle: 'italic',
            fontFamily: 'inherit'
          }}
        >
          Fresh Graduate | Aspiring Professional
        </Typography>
        
        <Box sx={{ mb: 1.5 }}>
          {resumeData.personalDetails?.email && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.bodySize, mr: 2 }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.bodySize, mr: 2 }}>
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
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
              LinkedIn: {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.github && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
              GitHub: {resumeData.personalDetails.github.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize }}>
              Portfolio: {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Career Objective */}
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            CAREER OBJECTIVE
          </Typography>
          <Box
            sx={{
              border: '1px solid #cccccc',
              padding: '12px',
              backgroundColor: '#ffffff'
            }}
          >
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            EDUCATION
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, p: 1.5, border: '1px solid #cccccc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography 
                    component="h3"
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: layout.itemTitleSize, 
                      color: '#000000',
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
                        fontFamily: 'inherit'
                      }}
                    >
                      {edu.location}
                    </Typography>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    color: '#000000', 
                    fontSize: layout.smallSize, 
                    fontWeight: 'bold',
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
                    mb: 1,
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
                    lineHeight: layout.lineHeight,
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>Achievements:</strong> {edu.achievements}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Academic Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            ACADEMIC PROJECTS
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, p: 1.5, border: '1px solid #cccccc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  component="h3"
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: layout.itemTitleSize, 
                    color: '#000000',
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
                    color: '#000000',
                    mb: 0.5,
                    fontFamily: 'inherit'
                  }}
                >
                  <strong>Technologies Used:</strong> {project.technologies}
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
                  <strong>Project Link:</strong> {project.link}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Technical Skills */}
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            TECHNICAL SKILLS
          </Typography>
          <Box
            sx={{
              p: 1.5,
              border: '1px solid #cccccc'
            }}
          >
            <Typography 
              sx={{
                fontSize: layout.bodySize,
                color: '#000000',
                lineHeight: 1.5,
                fontFamily: 'inherit'
              }}
            >
              {resumeData.skills.join(' • ')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Experience (if any) */}
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            INTERNSHIPS & EXPERIENCE
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, p: 1.5, border: '1px solid #cccccc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography 
                    component="h3"
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: layout.itemTitleSize, 
                      color: '#000000',
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
                      fontFamily: 'inherit'
                    }}
                  >
                    {exp.company}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    color: '#000000', 
                    fontSize: layout.smallSize, 
                    fontWeight: 'bold',
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
                    mb: 1, 
                    fontSize: layout.smallSize,
                    fontFamily: 'inherit'
                  }}
                >
                  {exp.location}
                </Typography>
              )}
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

      {/* Achievements */}
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            ACHIEVEMENTS & CERTIFICATIONS
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, p: 1.5, backgroundColor: '#ffffff' }}>
              <Typography 
                component="h3"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: layout.itemTitleSize, 
                  color: '#000000',
                  fontFamily: 'inherit'
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

      {/* Hobbies & Interests */}
      {resumeData.hobbies && resumeData.hobbies.length > 0 && (
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
              pb: 0.5,
              fontFamily: 'inherit'
            }}
          >
            HOBBIES & INTERESTS
          </Typography>
          <Box
            sx={{
              p: 1.5,
              border: '1px solid #cccccc'
            }}
          >
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
        </Box>
      )}
    </Box>
  );
}

export default FreshGraduateTemplate;