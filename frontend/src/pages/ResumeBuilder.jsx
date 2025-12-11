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
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Fade,
  Slide
} from '@mui/material';
import { 
  CheckCircle, 
  Save, 
  Preview, 
  Download, 
  AutoAwesome,
  ZoomIn,
  ZoomOut,
  Visibility,
  VisibilityOff,
  Fullscreen,
  FullscreenExit,
  InfoOutlined,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import PersonalDetailsForm from '../components/forms/PersonalDetailsForm';
import SummaryForm from '../components/forms/SummaryForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import SkillsForm from '../components/forms/SkillsForm';
import AchievementsForm from '../components/forms/AchievementsForm';
import HobbiesForm from '../components/forms/HobbiesForm';
import ResumePreview from '../components/ResumePreview';
import { templateComponents, TemplateSelector } from '../components/templates';
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
  const [selectedTemplate, setSelectedTemplate] = useState({ id: 'modern-professional', name: 'Modern Professional' });
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
  
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(0.55);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fresherSteps = [
    'Template',
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
    'Template',
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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const saveResume = async () => {
    if (!user || !token) {
      setSnackbar({ open: true, message: 'Please login to save resume', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...resumeData,
        selectedTemplate: selectedTemplate
      };

      const response = await axios.post(`${api_url}/api/save-resume`, dataToSave, {
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
      const dataToDownload = {
        resumeData: resumeData,
        selectedTemplate: selectedTemplate
      };

      const response = await axios.post(`${api_url}/api/download-resume`, dataToDownload, {
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

  const handleZoomIn = () => {
    setPreviewZoom(prev => Math.min(prev + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    setPreviewZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetZoom = () => {
    setPreviewZoom(0.55);
  };

  const renderStepContent = (step) => {
    const stepName = steps[step];
    
    switch (stepName) {
      case 'Template':
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            resumeData={resumeData}
          />
        );
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
          if (resumeData.experience.length === 0) {
            return (
              <Box textAlign="center" sx={{ py: 8 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <InfoOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Work Experience (Optional)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
                  As a fresher, you might not have professional work experience yet. You can skip this section or add internships, part-time jobs, or volunteer work.
                </Typography>
                <Button
                  variant="contained"
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
                  sx={{ 
                    borderRadius: 2, 
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
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
                <Box textAlign="center" mt={4}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => updateResumeData('experience', [])}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Remove Experience Section
                  </Button>
                </Box>
              </Box>
            );
          }
        } else {
          return (
            <ExperienceForm
              data={resumeData.experience}
              onChange={(data) => updateResumeData('experience', data)}
            />
          );
        }
      case 'Projects':
        if (type === 'experienced') {
          if (resumeData.projects.length === 0) {
            return (
              <Box textAlign="center" sx={{ py: 8 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <InfoOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Personal Projects (Optional)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
                  As an experienced professional, your work experience is the main focus. Optionally add personal projects, side projects, or freelance work.
                </Typography>
                <Button
                  variant="contained"
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
                  sx={{ 
                    borderRadius: 2, 
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
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
                <Box textAlign="center" mt={4}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => updateResumeData('projects', [])}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Remove Projects Section
                  </Button>
                </Box>
              </Box>
            );
          }
        } else {
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
        selectedTemplate={selectedTemplate}
        onBack={() => setShowPreview(false)}
        onSave={saveResume}
        onDownload={downloadResume}
        onTemplateChange={setSelectedTemplate}
        saving={saving}
        downloading={downloading}
      />
    );
  }

  const progress = ((activeStep + 1) / steps.length) * 100;
  const TemplateComponent = selectedTemplate 
    ? templateComponents[selectedTemplate.id] 
    : templateComponents['modern-professional'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
      <Navbar />

      {/* Clean Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Resume Builder
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {type === 'fresher' ? 'Fresher Resume' : 'Professional Resume'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowLivePreview(!showLivePreview)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                {showLivePreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<Preview />}
                onClick={() => setShowPreview(true)}
                disabled={!selectedTemplate}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Full Preview
              </Button>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3
                }
              }} 
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Compact Stepper Sidebar */}
          <Grid item xs={12} md={showLivePreview ? 2.5 : 3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                position: 'sticky', 
                top: 140, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                Sections
              </Typography>
              <Stepper 
                activeStep={activeStep} 
                orientation="vertical"
                sx={{ 
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer',
                    py: 0.5
                  },
                  '& .MuiStepConnector-root': {
                    ml: 1.5
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
                        optional={isOptional ? <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>Optional</Typography> : null}
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: index === activeStep ? 700 : 500,
                            color: index === activeStep ? 'primary.main' : 'text.secondary',
                            fontSize: '0.875rem'
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={saveResume}
                  disabled={saving}
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={downloadResume}
                  disabled={downloading || !selectedTemplate}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Main Form Content */}
          <Grid item xs={12} md={showLivePreview ? 4.5 : 9}>
            <Slide direction="left" in={true} mountOnEnter unmountOnExit key={activeStep}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  minHeight: 500
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    {steps[activeStep]}
                    {((type === 'fresher' && steps[activeStep] === 'Experience') || 
                      (type === 'experienced' && steps[activeStep] === 'Projects')) && (
                      <Chip 
                        label="Optional" 
                        size="small" 
                        sx={{ 
                          ml: 2, 
                          fontWeight: 600,
                          bgcolor: 'warning.light',
                          color: 'warning.dark'
                        }} 
                      />
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {activeStep === 0 && 'Choose a professional template for your resume'}
                    {activeStep === 1 && 'Enter your contact information'}
                    {activeStep === 2 && 'Write a compelling professional summary'}
                    {activeStep > 2 && `Add your ${steps[activeStep].toLowerCase()}`}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  {renderStepContent(activeStep)}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    size="large"
                    startIcon={<NavigateBefore />}
                    sx={{ 
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={() => setShowPreview(true)}
                      size="large"
                      startIcon={<Preview />}
                      disabled={!selectedTemplate}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 4,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Preview Resume
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      size="large"
                      endIcon={<NavigateNext />}
                      disabled={activeStep === 0 && !selectedTemplate}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 4,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Live Preview Panel */}
          {showLivePreview && selectedTemplate && (
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  position: 'sticky',
                  top: 140,
                  height: 'calc(100vh - 160px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                {/* Preview Controls */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#fafbfc'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Live Preview
                    </Typography>
                    <Chip
                      label={`${Math.round(previewZoom * 100)}%`}
                      size="small"
                      sx={{ 
                        height: 24,
                        fontWeight: 600,
                        bgcolor: 'primary.light',
                        color: 'primary.dark'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Zoom Out" arrow>
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleZoomOut}
                          disabled={previewZoom <= 0.3}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          <ZoomOut fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    
                    <Tooltip title="Reset Zoom" arrow>
                      <IconButton
                        size="small"
                        onClick={resetZoom}
                        sx={{ bgcolor: 'background.paper', px: 1.5 }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>
                          Reset
                        </Typography>
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Zoom In" arrow>
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleZoomIn}
                          disabled={previewZoom >= 1.0}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          <ZoomIn fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                    
                    <Tooltip title="Fullscreen" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setIsFullscreenPreview(true)}
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        <Fullscreen fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Preview Content */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    bgcolor: '#f5f5f5',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      transform: `scale(${previewZoom})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                      width: '8.5in',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      bgcolor: 'white'
                    }}
                  >
                    {TemplateComponent && <TemplateComponent resumeData={resumeData} />}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Fullscreen Preview Modal */}
      {isFullscreenPreview && (
        <Fade in={isFullscreenPreview}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.97)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Fullscreen Controls */}
            <Box
              sx={{
                p: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                Fullscreen Preview
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Zoom Out" arrow>
                  <span>
                    <IconButton
                      onClick={handleZoomOut}
                      disabled={previewZoom <= 0.3}
                      sx={{ color: 'white' }}
                    >
                      <ZoomOut />
                    </IconButton>
                  </span>
                </Tooltip>
                
                <Chip
                  label={`${Math.round(previewZoom * 100)}%`}
                  sx={{ bgcolor: 'white', fontWeight: 700, color: 'text.primary' }}
                />
                
                <Tooltip title="Zoom In" arrow>
                  <span>
                    <IconButton
                      onClick={handleZoomIn}
                      disabled={previewZoom >= 1.0}
                      sx={{ color: 'white' }}
                    >
                      <ZoomIn />
                    </IconButton>
                  </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                
                <Tooltip title="Exit Fullscreen" arrow>
                  <IconButton onClick={() => setIsFullscreenPreview(false)} sx={{ color: 'white' }}>
                    <FullscreenExit />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Fullscreen Preview Content */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                p: 4
              }}
            >
              <Box
                sx={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease',
                  width: '8.5in',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                  bgcolor: 'white'
                }}
              >
                {TemplateComponent && <TemplateComponent resumeData={resumeData} />}
              </Box>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResumeBuilder;