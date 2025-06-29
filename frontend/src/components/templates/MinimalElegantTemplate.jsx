import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function MinimalElegantTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Box
      sx={{
        fontFamily: '"Playfair Display", "Georgia", serif',
        lineHeight: 1.7,
        color: '#2c2c2c',
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
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 400,
            color: '#1a1a1a',
            mb: 2,
            fontSize: '3rem',
            letterSpacing: '2px',
            fontFamily: '"Playfair Display", serif'
          }}
        >
          {resumeData.personalDetails?.fullName || 'Your Name'}
        </Typography>
        
        <Box sx={{ width: '60px', height: '1px', backgroundColor: '#d4af37', mx: 'auto', mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          {resumeData.personalDetails?.email && (
            <Typography variant="body1" sx={{ color: '#666666', fontSize: '1rem', fontFamily: '"Lato", sans-serif' }}>
              {resumeData.personalDetails.email}
            </Typography>
          )}
          {resumeData.personalDetails?.phone && (
            <Typography variant="body1" sx={{ color: '#666666', fontSize: '1rem', fontFamily: '"Lato", sans-serif' }}>
              {resumeData.personalDetails.phone}
            </Typography>
          )}
          {resumeData.personalDetails?.location && (
            <Typography variant="body1" sx={{ color: '#666666', fontSize: '1rem', fontFamily: '"Lato", sans-serif' }}>
              {resumeData.personalDetails.location}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
          {resumeData.personalDetails?.linkedin && (
            <Typography variant="body2" sx={{ color: '#d4af37', fontSize: '0.9rem', fontFamily: '"Lato", sans-serif' }}>
              {resumeData.personalDetails.linkedin.replace('https://', '')}
            </Typography>
          )}
          {resumeData.personalDetails?.website && (
            <Typography variant="body2" sx={{ color: '#d4af37', fontSize: '0.9rem', fontFamily: '"Lato", sans-serif' }}>
              {resumeData.personalDetails.website.replace('https://', '')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Professional Summary */}
      {resumeData.summary && (
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 3,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#444444',
              maxWidth: '80%',
              mx: 'auto',
              fontStyle: 'italic',
              fontFamily: '"Lato", sans-serif'
            }}
          >
            {resumeData.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      color: '#1a1a1a',
                      fontFamily: '"Playfair Display", serif'
                    }}
                  >
                    {exp.jobTitle}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      color: '#d4af37',
                      fontWeight: 500,
                      fontFamily: '"Lato", sans-serif'
                    }}
                  >
                    {exp.company}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#888888',
                    fontSize: '0.9rem',
                    fontFamily: '"Lato", sans-serif',
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
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: '#444444',
                  whiteSpace: 'pre-line',
                  textAlign: 'justify',
                  fontFamily: '"Lato", sans-serif'
                }}
              >
                {exp.responsibilities}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                lineHeight: 2,
                color: '#444444',
                fontFamily: '"Lato", sans-serif'
              }}
            >
              {resumeData.skills.join(' • ')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#1a1a1a',
                    fontFamily: '"Playfair Display", serif'
                  }}
                >
                  {project.name}
                </Typography>
                {project.duration && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#888888',
                      fontSize: '0.9rem',
                      fontFamily: '"Lato", sans-serif'
                    }}
                  >
                    {project.duration}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: '#444444',
                  mb: 1,
                  textAlign: 'justify',
                  fontFamily: '"Lato", sans-serif'
                }}
              >
                {project.description}
              </Typography>
              {project.technologies && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    color: '#d4af37',
                    fontStyle: 'italic',
                    fontFamily: '"Lato", sans-serif'
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
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      color: '#1a1a1a',
                      fontFamily: '"Playfair Display", serif'
                    }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1rem',
                      color: '#d4af37',
                      fontFamily: '"Lato", sans-serif'
                    }}
                  >
                    {edu.institution}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#888888',
                    fontSize: '0.9rem',
                    fontFamily: '"Lato", sans-serif',
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
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    color: '#444444',
                    fontFamily: '"Lato", sans-serif'
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
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: '#1a1a1a',
              fontSize: '1.5rem',
              fontFamily: '"Playfair Display", serif',
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
                backgroundColor: '#d4af37'
              }}
            />
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  fontFamily: '"Playfair Display", serif'
                }}
              >
                {achievement.title}
              </Typography>
              {achievement.organization && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#d4af37',
                    fontSize: '0.9rem',
                    mb: 0.5,
                    fontFamily: '"Lato", sans-serif'
                  }}
                >
                  {achievement.organization}
                </Typography>
              )}
              {achievement.description && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    color: '#444444',
                    fontFamily: '"Lato", sans-serif'
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