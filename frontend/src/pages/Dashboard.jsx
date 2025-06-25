//Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  IconButton,
  Avatar,
  LinearProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Alert,
  Snackbar,
  Skeleton,
  DialogContentText,
  Badge
} from '@mui/material';
import {
  CloudUpload,
  Create,
  TrendingUp,
  Description,
  Star,
  Delete,
  Edit,
  Download,
  Visibility,
  Add,
  Timeline,
  WorkspacePremium,
  Feedback,
  Send,
  Close,
  ThumbUp,
  BugReport,
  Lightbulb,
  Help,
  Warning,
  Assessment
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { api_url } from '../helper/Helper';

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, resume: null });
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgScore: 0,
    lastUpdated: null
  });
 
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchUserRating = async () => {
  if (!user) return;
 
  setRatingLoading(true);
  try {
    const authToken = token || await user.getIdToken();
   
    const response = await axios.get(`${api_url}/api/feedback`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    if (response.data) {
      let userRating = null;
      let userMessage = '';
     
      if (response.data.feedback && typeof response.data.feedback.rating !== 'undefined') {
        userRating = response.data.feedback.rating;
        userMessage = response.data.feedback.message || '';
      } else if (typeof response.data.rating !== 'undefined') {
        userRating = response.data.rating;
        userMessage = response.data.message || '';
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        userRating = response.data[0].rating;
        userMessage = response.data[0].message || '';
      } else if (response.data.data && typeof response.data.data.rating !== 'undefined') {
        userRating = response.data.data.rating;
        userMessage = response.data.data.message || '';
      }
     
      if (userRating !== null && userRating !== undefined && userRating >= 1 && userRating <= 5) {
        setRate(Number(userRating));
        setFeedbackMessage(userMessage);
      } else {
        setRate(null);
        setFeedbackMessage('');
      }
    }
  } catch (error) {
    console.error('Error fetching rating:', error);
    if (error.response?.status === 404) {
      setRate(null);
      setFeedbackMessage('');
    }
  } finally {
    setRatingLoading(false);
  }
};

  const fetchResumes = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
   
    try {
      const response = await axios.get(`${api_url}/api/resumes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResumes(response.data);
     
      // Calculate actual average score from resumes
      const resumesWithScores = response.data.filter(resume => resume.score !== null && resume.score !== undefined);
      const avgScore = resumesWithScores.length > 0
        ? Math.round(resumesWithScores.reduce((sum, resume) => sum + (resume.score || 0), 0) / resumesWithScores.length)
        : 95; // fallback value
     
      setStats({
        totalResumes: response.data.length,
        avgScore: avgScore,
        lastUpdated: response.data.length > 0 ? response.data[0].updatedAt : null
      });
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load resumes',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRating();
      fetchResumes();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const handleEditResume = (resume) => {
    navigate(`/resume-builder/${resume.experience?.length > 0 ? 'experienced' : 'fresher'}`, {
      state: { resumeData: resume }
    });
  };

  const handleDownloadResume = async (resume) => {
    try {
      const response = await axios.post(`${api_url}/api/download-resume`, resume, {
        responseType: 'blob'
      });
     
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.personalDetails?.fullName || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resume:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download resume',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (resume) => {
    setDeleteDialog({ open: true, resume });
  };

  const handleDeleteConfirm = async () => {
    const { resume } = deleteDialog;
    if (!resume) return;
   
    try {
      await axios.delete(`${api_url}/api/resume/${resume._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResumes(resumes.filter(r => r._id !== resume._id));
      setStats(prev => ({ ...prev, totalResumes: prev.totalResumes - 1 }));
      setSnackbar({
        open: true,
        message: 'Resume deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete resume:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete resume',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, resume: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, resume: null });
  };

  // Helper function to get score color
  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  // Helper function to get score text
  const getScoreText = (score) => {
    if (!score && score !== 0) return 'Not Scored';
    return `${score}%`;
  };

  // Helper function to get ATS score status
  const getATSScoreStatus = (score) => {
    if (!score && score !== 0) return { text: 'Pending', color: 'default' };
    if (score >= 90) return { text: 'Excellent', color: 'success' };
    if (score >= 80) return { text: 'Very Good', color: 'info' };
    if (score >= 70) return { text: 'Good', color: 'warning' };
    return { text: 'Needs Improvement', color: 'error' };
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Show loading skeleton for initial load
  if (loading && !user) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={user?.photoURL}
                sx={{
                  width: 60,
                  height: 60,
                  mr: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}
              >
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Ready to create your next career opportunity?
                </Typography>
              </Box>
            </Box>
           
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<WorkspacePremium />}
                label="Premium User"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
              {ratingLoading ? (
                <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 4 }} />
              ) : rate !== null ? (
                <Chip
                  icon={<Star />}
                  label={`${rate}/5 Rating`}
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
              ) : (
                <Chip
                  icon={<Help />}
                  label="Rate Us!"
                  color="default"
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip
                icon={<Timeline />}
                label="AI Powered"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.totalResumes}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Resumes Created
                        </Typography>
                      </Box>
                      <Description sx={{ fontSize: 40, opacity: 0.7 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.avgScore}%
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Avg ATS Score
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ fontSize: 40, opacity: 0.7 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          3x
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          More Interviews
                        </Typography>
                      </Box>
                      <Star sx={{ fontSize: 40, opacity: 0.7 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          24/7
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          AI Support
                        </Typography>
                      </Box>
                      <WorkspacePremium sx={{ fontSize: 40, opacity: 0.7 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => navigate('/upload-resume')}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        mb: 3,
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      Upload Resume
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      Upload your existing resume and let our AI analyze, score, and improve it for better ATS compatibility
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        px: 4,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      Upload & Analyze
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={cardVariants}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)',
                      borderColor: 'warning.main',
                    },
                  }}
                  onClick={() => navigate('/create-resume')}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        mb: 3,
                      }}
                    >
                      <Create sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      Create Resume
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      Build a professional ATS-optimized resume from scratch with AI assistance and smart templates
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        px: 4,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      Start Building
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* My Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                My Resumes ({resumes.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/create-resume')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                Create New
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ py: 4 }}>
                <LinearProgress sx={{ borderRadius: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Loading your resumes...
                </Typography>
              </Box>
            ) : resumes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Description sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                  No resumes created yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  Start building your professional resume today and take the first step towards your dream job!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Create />}
                  onClick={() => navigate('/create-resume')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Create Your First Resume
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {resumes.map((resume, index) => {
                  const scoreStatus = getATSScoreStatus(resume.score);
                  return (
                    <React.Fragment key={resume._id}>
                      <ListItem
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.2s ease',
                          minHeight: 120,
                          alignItems: 'flex-start',
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: 'primary.main',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        {/* Left side - Avatar and basic info */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1, pt: 2 }}>
                          <Avatar
                            sx={{
                              mr: 3,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 600,
                              width: 48,
                              height: 48
                            }}
                          >
                            {resume.personalDetails?.fullName?.charAt(0) || 'R'}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {resume.personalDetails?.fullName || resume.title || 'Untitled Resume'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {resume.personalDetails?.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip size="small" label="ATS Optimized" color="success" />
                              <Chip size="small" label="AI Enhanced" color="primary" />
                              {resume.score && resume.score >= 90 && (
                                <Chip size="small" label="Top Performer" color="success" />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        {/* Center - ATS Score Display */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 120,
                            px: 2,
                            py: 2,
                            mx: 2
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5
                            }}
                          >
                            ATS Score
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${
                                  scoreStatus.color === 'success' ? '#10b981, #059669' :
                                  scoreStatus.color === 'info' ? '#3b82f6, #1d4ed8' :
                                  scoreStatus.color === 'warning' ? '#f59e0b, #d97706' :
                                  scoreStatus.color === 'error' ? '#ef4444, #dc2626' :
                                  '#6b7280, #4b5563'
                                })`,
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            >
                              {resume.score || resume.score === 0 ? `${resume.score}%` : '—'}
                            </Box>
                            
                            {/* Optional: Add a pulse animation for high scores */}
                            {resume.score >= 90 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid #10b981',
                                  opacity: 0.6,
                                  animation: 'pulse 2s infinite'
                                }}
                              />
                            )}
                          </Box>
                          
                          <Chip
                            size="small"
                            label={scoreStatus.text}
                            color={scoreStatus.color}
                            sx={{
                              fontWeightfontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>

                        {/* Right side - Action buttons */}
                        <ListItemSecondaryAction sx={{ position: 'static', transform: 'none', mr: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleEditResume(resume)}
                                sx={{
                                  bgcolor: 'warning.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'warning.dark' }
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadResume(resume)}
                                sx={{
                                  bgcolor: 'success.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'success.dark' }
                                }}
                              >
                                <Download sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(resume)}
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'error.dark' }
                                }}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              ID: {resume._id.slice(-6)}
                            </Typography>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < resumes.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Feedback sx={{ mr: 2, color: 'primary.main' }} />
              Help Us Improve
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                How would you rate your experience with our resume builder?
              </Typography>
              
              {ratingLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="rectangular" width={200} height={40} />
                  <Skeleton variant="rectangular" width={100} height={36} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Rating
      name="user-rating"
      value={rate}
      onChange={(event, newValue) => {
        setRate(newValue);
      }}
      size="large"
      sx={{ fontSize: '2rem' }}
    />
  </Box>
  
  <TextField
    fullWidth
    multiline
    rows={3}
    placeholder="Tell us about your experience (optional)"
    value={feedbackMessage}
    onChange={(e) => setFeedbackMessage(e.target.value)}
    variant="outlined"
    sx={{ mt: 1 }}
  />
  
  <Button
    variant="contained"
    size="small"
    startIcon={<Send />}
    onClick={async () => {
      if (rate === null) {
        setSnackbar({
          open: true,
          message: 'Please select a rating first',
          severity: 'warning'
        });
        return;
      }
      
      try {
        setRatingLoading(true);
        const authToken = token || await user.getIdToken();
        
        await axios.post(`${api_url}/api/feedback`, 
          { 
            type: 'general',
            rating: rate,
            message: feedbackMessage || `User rating: ${rate}/5 stars`,
            email: user?.email || 'unknown@example.com'
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        
        setSnackbar({
          open: true,
          message: 'Thank you for your feedback!',
          severity: 'success'
        });
        
        // Clear the form after successful submission
        
        
      } catch (error) {
        console.error('Error submitting rating:', error);
        setSnackbar({
          open: true,
          message: 'Failed to submit rating',
          severity: 'error'
        });
      } finally {
        setRatingLoading(false);
      }
    }}
    sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontWeight: 600,
      alignSelf: 'flex-start'
    }}
  >
    Submit Feedback
  </Button>
</Box>
              )}
              
              {rate !== null && (
                <Typography variant="body2" color="text.secondary">
                  {rate === 5 ? "Amazing! We're thrilled you love our service!" :
                   rate === 4 ? "Great! Thanks for the positive feedback!" :
                   rate === 3 ? "Good! We're always working to improve." :
                   rate === 2 ? "Thanks for the feedback. We'll work on improvements." :
                   "We appreciate your honesty and will strive to do better."}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<ThumbUp />}
                variant="outlined"
                size="small"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Thank you for the positive feedback!',
                    severity: 'success'
                  });
                }}
              >
                Love it!
              </Button>
              <Button
                startIcon={<BugReport />}
                variant="outlined"
                size="small"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Please report bugs through our support channel',
                    severity: 'info'
                  });
                }}
              >
                Report Bug
              </Button>
              <Button
                startIcon={<Lightbulb />}
                variant="outlined"
                size="small"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'We love feature suggestions! Contact our support team.',
                    severity: 'info'
                  });
                }}
              >
                Suggest Feature
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 2, color: 'success.main' }} />
              Resume Tips & Insights
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ATS Optimization
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Keep your ATS score above 80% for better visibility. Use relevant keywords and standard formatting.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Regular Updates
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Update your resume regularly with new skills, experiences, and achievements to stay competitive.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkspacePremium sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Enhancement
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Let our AI suggest improvements to make your resume stand out to recruiters and hiring managers.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>

      {/* Floating Action Button */}
      

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ color: 'error.main', mr: 2 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.resume?.personalDetails?.fullName || 'this resume'}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Resume
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
}

export default Dashboard;