import React from 'react';
import { Box, Typography } from '@mui/material';

function TechFocusedTemplate({ resumeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Categorize skills for better ATS parsing
  const categorizeSkills = (skills) => {
    const categories = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Other Skills': []
    };

    const programmingKeywords = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'sql', 'html', 'css'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'bootstrap', 'jquery'];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack', 'babel', 'npm', 'yarn', 'mongodb', 'mysql', 'postgresql'];

    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (programmingKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Programming Languages'].push(skill);
      } else if (frameworkKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Frameworks & Libraries'].push(skill);
      } else if (toolKeywords.some(keyword => lowerSkill.includes(keyword))) {
        categories['Tools & Technologies'].push(skill);
      } else {
        categories['Other Skills'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = resumeData.skills ? categorizeSkills(resumeData.skills) : {};

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
      <Box sx={{ mb: layout.sectionSpacing, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            backgroundColor: '#000000'
          }}
        />
        <Box sx={{ pl: 2 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#000000',
              mb: 1,
              fontSize: layout.nameSize,
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
              fontWeight: 'bold',
              fontFamily: 'inherit'
            }}
          >
            Software Developer
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            {resumeData.personalDetails?.email && (
              <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
                Email: {resumeData.personalDetails.email}
              </Typography>
            )}
            {resumeData.personalDetails?.phone && (
              <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
                Phone: {resumeData.personalDetails.phone}
              </Typography>
            )}
            {resumeData.personalDetails?.location && (
              <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize }}>
                Location: {resumeData.personalDetails.location}
              </Typography>
            )}
          </Box>
          
          <Box>
            {resumeData.personalDetails?.github && (
              <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
                GitHub: {resumeData.personalDetails.github.replace('https://', '')}
              </Typography>
            )}
            {resumeData.personalDetails?.linkedin && (
              <Typography component="span" sx={{ color: '#000000', fontSize: layout.smallSize, mr: 2 }}>
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
      </Box>

      {/* Summary */}
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
              fontFamily: 'inherit'
            }}
          >
            PROFESSIONAL SUMMARY
          </Typography>
          <Box
            sx={{
              border: '1px solid #cccccc',
              padding: '12px',
              fontFamily: 'inherit'
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
              fontFamily: 'inherit'
            }}
          >
            TECHNICAL SKILLS
          </Typography>
          
          {Object.entries(skillCategories).map(([category, skills]) => (
            skills.length > 0 && (
              <Box key={category} sx={{ mb: 1.5 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: layout.bodySize,
                    fontWeight: 'bold',
                    color: '#000000',
                    mb: 0.5,
                    fontFamily: 'inherit'
                  }}
                >
                  {category}:
                </Typography>
                <Typography 
                  sx={{
                    fontSize: layout.bodySize,
                    color: '#000000',
                    lineHeight: 1.4,
                    fontFamily: 'inherit'
                  }}
                >
                  {skills.join(' • ')}
                </Typography>
              </Box>
            )
          ))}
        </Box>
      )}

      {/* Experience */}
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
              fontFamily: 'inherit'
            }}
          >
            PROFESSIONAL EXPERIENCE
          </Typography>
          {resumeData.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing, position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '2px',
                  height: '100%',
                  backgroundColor: '#cccccc'
                }}
              />
              <Box sx={{ pl: 2 }}>
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
                      color: '#666666',
                      fontSize: layout.smallSize,
                      fontWeight: 'normal',
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
                    Location: {exp.location}
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
            </Box>
          ))}
        </Box>
      )}

      {/* Projects */}
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
              fontFamily: 'inherit'
            }}
          >
            PROJECTS
          </Typography>
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
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
                  <strong>Link:</strong> {project.link}
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
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              fontFamily: 'inherit'
            }}
          >
            EDUCATION
          </Typography>
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
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
                </Box>
                <Typography 
                  sx={{ 
                    color: '#666666', 
                    fontSize: layout.smallSize,
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
              fontWeight: 'bold',
              mb: layout.itemSpacing,
              color: '#000000',
              fontSize: layout.sectionTitleSize,
              textTransform: 'uppercase',
              fontFamily: 'inherit'
            }}
          >
            ACHIEVEMENTS
          </Typography>
          {resumeData.achievements.map((achievement, index) => (
            <Box key={index} sx={{ mb: layout.itemSpacing }}>
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
    </Box>
  );
}

export default TechFocusedTemplate;