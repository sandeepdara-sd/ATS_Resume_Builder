import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  LinearProgress,
  Chip
} from '@mui/material';
import {  AlertTitle } from '@mui/material';
import { WarningAmber, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Save, Preview, Download,  AutoAwesome } from '@mui/icons-material';

import PersonalDetailsForm from '../components/forms/PersonalDetailsForm';
import SummaryForm from '../components/forms/SummaryForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import SkillsForm from '../components/forms/SkillsForm';
import AchievementsForm from '../components/forms/AchievementsForm';
import HobbiesForm from '../components/forms/HobbiesForm';
import ResumePreview from '../components/ResumePreview';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { api_url } from '../helper/Helper';

function ResumeBuilder() {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    personalDetails: {},
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    achievements: [],
    hobbies: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fresherSteps = [
    'Personal Details',
    'Summary',
    'Education',
    'Experience',
    'Projects',
    'Skills',
    'Achievements',
    'Hobbies'
  ];

  const experiencedSteps = [
    'Personal Details',
    'Summary',
    'Experience',
    'Projects',
    'Skills',
    'Education',
    'Achievements'
  ];

  const steps = type === 'fresher' ? fresherSteps : experiencedSteps;

  useEffect(() => {
    if (location.state?.resumeData) {
      setResumeData(prev => ({
        ...prev,
        ...location.state.resumeData
      }));
    }
  }, [location.state]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const saveResume = async () => {
    if (!user || !token) {
      setSnackbar({ open: true, message: 'Please login to save resume', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(`${api_url}/api/save-resume`, resumeData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setResumeData(prev => ({
        ...prev,
        _id: response.data.resumeId
      }));
      
      setSnackbar({ open: true, message: 'Resume saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to save resume', 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadResume = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(`${api_url}/api/download-resume`, resumeData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `${resumeData.personalDetails?.fullName || 'resume'}.pdf`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSnackbar({ open: true, message: 'Resume downloaded successfully!', severity: 'success' });
      
      if (user && token) {
        await saveResume();
      }
    } catch (error) {
      console.error('Failed to download resume:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to download resume', 
        severity: 'error' 
      });
    } finally {
      setDownloading(false);
    }
  };

  const renderStepContent = (step) => {
    const stepName = steps[step];
    
    switch (stepName) {
      case 'Personal Details':
        return (
          <PersonalDetailsForm
            data={resumeData.personalDetails}
            onChange={(data) => updateResumeData('personalDetails', data)}
          />
        );
      case 'Summary':
        return (
          <SummaryForm
            data={resumeData.summary}
            type={type}
            personalDetails={resumeData.personalDetails}
            onChange={(data) => updateResumeData('summary', data)}
          />
        );
      case 'Education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(data) => updateResumeData('education', data)}
          />
        );
      case 'Experience':
        if (type === 'fresher') {
          // Experience is optional for freshers
          if (resumeData.experience.length === 0) {
            return (
              <Box textAlign="center" sx={{ py: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Work Experience (Optional)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                  As a fresher, you might not have professional work experience yet. You can skip this section or add any internships, part-time jobs, or volunteer work you've done.
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    updateResumeData('experience', [
                      {
                        jobTitle: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        currentJob: false,
                        responsibilities: ''
                      }
                    ])
                  }
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Add Experience (Optional)
                </Button>
              </Box>
            );
          } else {
            return (
              <Box>
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) => updateResumeData('experience', data)}
                />
                <Box textAlign="center" mt={3}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => updateResumeData('experience', [])}
                    sx={{ borderRadius: 2 }}
                  >
                    Remove Experience Section
                  </Button>
                </Box>
              </Box>
            );
          }
        } else {
          // Experience is mandatory for experienced professionals
          return (
            <ExperienceForm
              data={resumeData.experience}
              onChange={(data) => updateResumeData('experience', data)}
            />
          );
        }
      case 'Projects':
        if (type === 'experienced') {
          // Projects are optional for experienced professionals
          if (resumeData.projects.length === 0) {
            return (
              <Box textAlign="center" sx={{ py: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Personal Projects (Optional)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                  As an experienced professional, your work experience is the main focus. You can optionally add personal projects, side projects, or freelance work that showcase additional skills.
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    updateResumeData('projects', [
                      {
                        title: '',
                        description: '',
                        technologies: '',
                        link: ''
                      }
                    ])
                  }
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Add Projects (Optional)
                </Button>
              </Box>
            );
          } else {
            return (
              <Box>
                <ProjectsForm
                  data={resumeData.projects}
                  type={type}
                  onChange={(data) => updateResumeData('projects', data)}
                />
                <Box textAlign="center" mt={3}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => updateResumeData('projects', [])}
                    sx={{ borderRadius: 2 }}
                  >
                    Remove Projects Section
                  </Button>
                </Box>
              </Box>
            );
          }
        } else {
          // Projects are important for freshers to showcase their skills
          return (
            <ProjectsForm
              data={resumeData.projects}
              type={type}
              onChange={(data) => updateResumeData('projects', data)}
            />
          );
        }
      case 'Skills':
        return (
          <SkillsForm
            data={resumeData.skills}
            personalDetails={resumeData.personalDetails}
            onChange={(data) => updateResumeData('skills', data)}
          />
        );
      case 'Achievements':
        return (
          <AchievementsForm
            data={resumeData.achievements}
            onChange={(data) => updateResumeData('achievements', data)}
          />
        );
      case 'Hobbies':
        return (
          <HobbiesForm
            data={resumeData.hobbies}
            onChange={(data) => updateResumeData('hobbies', data)}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (showPreview) {
    return (
      <ResumePreview
        resumeData={resumeData}
        onBack={() => setShowPreview(false)}
        onSave={saveResume}
        onDownload={downloadResume}
        saving={saving}
        downloading={downloading}
      />
    );
  }

 
  
  const progress = activeStep === steps.length - 1 ? 100 : (activeStep / steps.length) * 100;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Resume Builder
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip 
                icon={<AutoAwesome />}
                label={type === 'fresher' ? 'Fresher Template' : 'Professional Template'} 
                color="primary" 
                sx={{ fontWeight: 600 }} 
              />
              <Chip 
                label={`Step ${activeStep + 1} of ${steps.length}`} 
                color="secondary" 
                sx={{ fontWeight: 600 }} 
              />
            </Box>
            
           <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box 
              sx={{
                mb: 4,
                display: 'flex',
                
                gap: 2,
                
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <WarningAmber sx={{ color: '#f57c00', fontSize: 26 }} />
              </motion.div>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#e65100',
                  fontSize: '1.05rem'
                }}
              >
                Please verify all details before saving or downloading your resume
              </Typography>
            </Box>
          </motion.div>
                      
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Progress: {Math.round(progress)}% Complete
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4
                  }
                }} 
              />
            </Box>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Stepper */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Resume Sections
              </Typography>
              <Stepper 
                activeStep={activeStep} 
                orientation="vertical"
                sx={{ 
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer'
                  }
                }}
              >
                {steps.map((label, index) => {
                  const isOptional = (type === 'fresher' && label === 'Experience') || 
                                   (type === 'experienced' && label === 'Projects');
                  
                  return (
                    <Step 
                      key={label}
                      completed={index < activeStep}
                      onClick={() => handleStepClick(index)}
                    >
                      <StepLabel
                        optional={isOptional ? <Typography variant="caption">Optional</Typography> : null}
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: index === activeStep ? 600 : 400,
                            color: index === activeStep ? 'primary.main' : 'text.secondary'
                          }
                        }}
                      >
                        {label}
                        {index < activeStep && (
                          <CheckCircle sx={{ ml: 1, fontSize: 16, color: 'success.main' }} />
                        )}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={saveResume}
                  disabled={saving}
                  fullWidth
                  sx={{ mb: 2, borderRadius: 2 }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Preview />}
                  onClick={() => setShowPreview(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2
                  }}
                >
                  Preview Resume
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Form Content */}
          <Grid item xs={12} md={9}>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  {steps[activeStep]}
                  {((type === 'fresher' && steps[activeStep] === 'Experience') || 
                    (type === 'experienced' && steps[activeStep] === 'Projects')) && (
                    <Chip 
                      label="Optional" 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 2, fontWeight: 500 }} 
                    />
                  )}
                </Typography>
                
                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    size="large"
                    sx={{ px: 4, borderRadius: 2 }}
                  >
                    Back
                  </Button>
                  
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => setShowPreview(true)}
                        size="large"
                        startIcon={<Preview />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          px: 4,
                          borderRadius: 2,
                          fontWeight: 600
                        }}
                      >
                        Preview Resume
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          px: 4,
                          borderRadius: 2,
                          fontWeight: 600
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResumeBuilder;
