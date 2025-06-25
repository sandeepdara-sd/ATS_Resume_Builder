//ResumePreview.jsx

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Save, Download, Edit } from '@mui/icons-material';
import { motion } from 'framer-motion';

function ResumePreview({ resumeData, onBack, onSave, onDownload, saving, downloading }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Resume Preview
          </Typography>
          <Button
            color="inherit"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={onSave}
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            color="inherit"
            startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
            onClick={onDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper 
            sx={{ 
              p: 6, 
              minHeight: '297mm',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b',
                  mb: 1
                }}
              >
                {resumeData.personalDetails?.fullName || 'Your Name'}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {resumeData.personalDetails?.email && (
                  <Typography variant="body2" color="text.secondary">
                    {resumeData.personalDetails.email}
                  </Typography>
                )}
                {resumeData.personalDetails?.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {resumeData.personalDetails.phone}
                  </Typography>
                )}
                {resumeData.personalDetails?.location && (
                  <Typography variant="body2" color="text.secondary">
                    {resumeData.personalDetails.location}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                {resumeData.personalDetails?.linkedin && (
                  <Typography variant="body2" color="primary.main">
                    
                    <a href={resumeData.personalDetails.github} target="_blank" rel="noopener noreferrer" style={{ color: '#3f51b5', textDecoration: 'none', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid #3f51b5', transition: '0.3s', display: 'inline-block' }} onMouseEnter={e => { e.currentTarget.style.background = '#3f51b5'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3f51b5'; }}>
                      <strong>LinkedIn </strong>
                    </a>
                  </Typography>
                )}
                {resumeData.personalDetails?.github && (
                  <Typography variant="body2" color="primary.main">
                    
                    <a href={resumeData.personalDetails.github} target="_blank" rel="noopener noreferrer" style={{ color: '#3f51b5', textDecoration: 'none', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid #3f51b5', transition: '0.3s', display: 'inline-block' }} onMouseEnter={e => { e.currentTarget.style.background = '#3f51b5'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3f51b5'; }}>
                      <strong>GitHub </strong>
                    </a>
                  </Typography>
                )}
                {resumeData.personalDetails?.website && (
                  <Typography variant="body2" color="primary.main">
                    
                    <a href={resumeData.personalDetails.github} target="_blank" rel="noopener noreferrer" style={{ color: '#3f51b5', textDecoration: 'none', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid #3f51b5', transition: '0.3s', display: 'inline-block' }} onMouseEnter={e => { e.currentTarget.style.background = '#3f51b5'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3f51b5'; }}>
                      <strong>Portfolio </strong>
                    </a>
                  </Typography>
                )}
              </Box>
            </Box>


            {/* Summary */}
            {resumeData.summary && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                  Professional Summary
                  <Divider />
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {resumeData.summary}
                </Typography>
              </Box>
            )}

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Professional Experience
                  <Divider />
                </Typography>
                {resumeData.experience.map((exp, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {exp.jobTitle}
                        </Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 500 }}>
                          {exp.company}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                      </Typography>
                    </Box>
                    {exp.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {exp.location}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {exp.responsibilities}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Projects
                  <Divider />
                </Typography>
                {resumeData.projects.map((project, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      {project.duration && (
                        <Typography variant="body2" color="text.secondary">
                          {project.duration}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                      {project.description}
                    </Typography>
                    {project.technologies && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Technologies:</strong> {project.technologies}
                      </Typography>
                    )}
                    {project.link && (
                      <Typography variant="body2" color="primary.main">
                        <strong>Link:</strong> {project.link}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Education
                  <Divider />
                </Typography>
                {resumeData.education.map((edu, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {edu.degree}
                        </Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 500 }}>
                          {edu.institution}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </Typography>
                    </Box>
                    {edu.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {edu.location}
                      </Typography>
                    )}
                    {edu.gpa && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>GPA:</strong> {edu.gpa}
                      </Typography>
                    )}
                    {edu.achievements && (
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {edu.achievements}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Skills
                  <Divider />
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.04)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Achievements */}
            
            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                    Achievements & Certifications
                    <Divider />
                  </Typography>
                  {resumeData.achievements.map((achievement, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        {achievement.link ? (
                          <Typography
                            variant="h6"
                            component="a"
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontWeight: 600,
                              color: '#3f51b5',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#303f9f'
                              }
                            }}
                          >
                            {achievement.title}
                          </Typography>

                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {achievement.title}
                          </Typography>
                        )}
                        {achievement.date && (
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(achievement.date)}
                          </Typography>
                        )}
                      </Box>
                      {achievement.organization && (
                        <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                          {achievement.organization}
                        </Typography>
                      )}
                      {achievement.description && (
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {achievement.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                
              </>
            )}

            {/* Hobbies */}
            {resumeData.hobbies && resumeData.hobbies.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Hobbies & Interests
                  <Divider />
                </Typography>
                
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {resumeData.hobbies.join(' • ')}
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default ResumePreview;