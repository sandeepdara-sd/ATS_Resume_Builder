import React, { useState, useEffect, useCallback } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Rating,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  CircularProgress,
  Skeleton,
  Backdrop
} from '@mui/material';
import {
  Feedback,
  Close,
  Send,
  ThumbUp,
  BugReport,
  Lightbulb,
  Help,
  Star,
  StarBorder,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { api_url } from '../helper/Helper';

const VITE_EMAIL_SERVICE = "service_7tr626s";
const VITE_EMAIL_TEMPLATE = "template_79z7w2t"
const VITE_EMAIL_API = "75q5dfAxtjipeieX4"

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [originalGeneralMessage, setOriginalGeneralMessage] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', email: '' }); // Added state for user details
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userEmail, setUserEmail] = useState('');
  const [feedbackData, setFeedbackData] = useState({
    type: '',
    rating: 5,
    message: '',
    email: '',
    category: ''
  });

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: <ThumbUp />, color: '#667eea', description: 'Share your overall experience' },
    { value: 'bug', label: 'Bug Report', icon: <BugReport />, color: '#ef4444', description: 'Report issues or problems' },
    { value: 'feature', label: 'Feature Request', icon: <Lightbulb />, color: '#f59e0b', description: 'Suggest new features' },
    { value: 'help', label: 'Need Help', icon: <Help />, color: '#10b981', description: 'Get assistance or support' }
  ];

  const categories = [
    'Resume Builder', 'AI Features', 'User Interface', 'Performance', 
    'Mobile Experience', 'Templates', 'Export/Download', 'Account Management'
  ];

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  // Fetch user details from your backend API
  const fetchUserDetails = useCallback(async (user, idToken) => {
    try {
      const response = await axios.get(`${api_url}/api/users/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
       console.log(response.data.user)
      if (response.data) {
        const userData = response.data.user;
        const userName = userData.name || userData.displayName || userData.firstName || user.displayName || 'User';
        const userEmail = userData.email || user.email || '';
        
        setUserDetails({
          name: userName,
          email: userEmail
        });
        
        return { name: userName, email: userEmail };
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback to Firebase user data
      const fallbackName = user.displayName || 'User';
      const fallbackEmail = user.email || '';
      
      setUserDetails({
        name: fallbackName,
        email: fallbackEmail
      });
      
      return { name: fallbackName, email: fallbackEmail };
    }
  }, []);

  // Complete reset function
  const resetComponent = useCallback(() => {
    setStep(1);
    setLoading(false);
    setDataLoaded(false);
    setSubmitting(false);
    setOriginalGeneralMessage('');
    setUserDetails({ name: '', email: '' }); // Reset user details
    setFeedbackData({
      type: '',
      rating: 5,
      message: '',
      email: '',
      category: ''
    });
  }, []);

  // Load user's previous feedback when dialog opens
  const loadUserFeedback = useCallback(async () => {
    if (!open || dataLoaded) return;
    
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();
      
      // Fetch user details first
      const userData = await fetchUserDetails(user, idToken);
      const currentUserEmail = userData.email;
      setUserEmail(currentUserEmail);

      // Then fetch feedback data
      const response = await axios.get(`${api_url}/api/feedback`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (response.data.feedback) {
        // Load previous feedback data
        const previousFeedback = response.data.feedback;
        const generalMessage = previousFeedback.type === 'general' ? (previousFeedback.message || '') : '';
        setOriginalGeneralMessage(generalMessage);
        setFeedbackData({
            type: previousFeedback.type || '',
            rating: previousFeedback.rating || 5,
            message: generalMessage,
            email: previousFeedback.email || currentUserEmail,
            category: previousFeedback.category || ''
        });
      } else {
        // No previous feedback, set email from user info
        setFeedbackData(prev => ({
          ...prev,
          email: response.data.userEmail || currentUserEmail
        }));
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading user feedback:', error);
      // Still set user email even if loading feedback fails
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        await fetchUserDetails(user, idToken); // Fetch user details even on error
        const currentUserEmail = user.email || '';
        setUserEmail(currentUserEmail);
        setFeedbackData(prev => ({
          ...prev,
          email: currentUserEmail
        }));
      }
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [open, dataLoaded, fetchUserDetails]);

  useEffect(() => {
    if (open) {
      loadUserFeedback();
    } else {
      // Reset everything when dialog closes
      resetComponent();
    }
  }, [open, loadUserFeedback, resetComponent]);

  const handleSubmit = async () => {
    // Validation
    if (!feedbackData.type || !feedbackData.message.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a feedback type and provide a message', 
        severity: 'error' 
      });
      return;
    }

    if (feedbackData.type !== 'general' && !feedbackData.category.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Please provide a subject for your feedback', 
        severity: 'error' 
      });
      return;
    }

    setSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      if (feedbackData.type === 'general') {
        // Send feedback to your MongoDB API
        await axios.post(
          `${api_url}/api/feedback`,
          {
            type: feedbackData.type,
            message: feedbackData.message,
            rating: feedbackData.rating,
            email: feedbackData.email,
            category: feedbackData.category
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );
      } else {
        // First save to database
        await axios.post(
          `${api_url}/api/feedback`,
          {
            type: feedbackData.type,
            message: feedbackData.message,
            rating: feedbackData.rating,
            email: feedbackData.email,
            category: feedbackData.category
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );

        // Then send via EmailJS using the fetched user details
        await emailjs.send(
          VITE_EMAIL_SERVICE,
          VITE_EMAIL_TEMPLATE,
          {
            name: userDetails.name || 'Anonymous', // Use fetched name
            message: feedbackData.message,
            category: feedbackData.category,
            email: feedbackData.email,
            rating: feedbackData.rating,
            type: feedbackData.type,
            userEmail: userDetails.email || user.email // Use fetched email
          },
          VITE_EMAIL_API
        );
      }

      setSnackbar({
        open: true,
        message: 'Thank you for your feedback! We appreciate your input and will review it carefully.',
        severity: 'success'
      });

      // Close dialog and reset
      setOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to submit feedback. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!feedbackData.type) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a feedback type to continue', 
        severity: 'warning' 
      });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFeedbackTypeSelect = (typeValue) => {
    setFeedbackData(prev => ({ 
      ...prev, 
      type: typeValue,
      message: typeValue === 'general' ? originalGeneralMessage : ''
    }));
  };

  const handleCategorySelect = (category) => {
    setFeedbackData(prev => ({ 
      ...prev, 
      category: prev.category === category ? '' : category 
    }));
  };

  const selectedType = feedbackTypes.find(type => type.value === feedbackData.type);
  const shouldShowContent = !loading && dataLoaded;

  return (
    <>
      {/* Floating Feedback Button with enhanced animations */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.8, 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          duration: 0.6
        }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          transformOrigin: 'center bottom',
        }}
      >
        {/* Ripple effect background */}
        <div className="ripple-container">
          <div className="ripple ripple-1"></div>
          <div className="ripple ripple-2"></div>
          <div className="ripple ripple-3"></div>
        </div>

        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5252 0%, #26a69a 50%, #2196f3 100%)',
              transform: 'scale(1.15) rotate(5deg)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4), 0 0 0 0 rgba(255, 107, 107, 0.7)',
            animation: 'bounceAttention 4s ease-in-out infinite, colorShift 6s ease-in-out infinite',
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b)',
              borderRadius: '50%',
              zIndex: -1,
              animation: 'rotate 3s linear infinite',
              opacity: 0.8,
            },
            '&::after': {
              content: '"💬"',
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              fontSize: '16px',
              animation: 'bounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Feedback />
          </motion.div>
        </Fab>

        {/* Floating particles */}
        <div className="particles">
          <div className="particle particle-1">✨</div>
          <div className="particle particle-2">💫</div>
          <div className="particle particle-3">⭐</div>
        </div>
      </motion.div>

      <style>
        {`
          .ripple-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }

          .ripple {
            position: absolute;
            border: 2px solid rgba(255, 107, 107, 0.6);
            border-radius: 50%;
            animation: rippleEffect 3s ease-out infinite;
          }

          .ripple-1 {
            width: 60px;
            height: 60px;
            margin: -30px;
            animation-delay: 0s;
          }

          .ripple-2 {
            width: 60px;
            height: 60px;
            margin: -30px;
            animation-delay: 1s;
          }

          .ripple-3 {
            width: 60px;
            height: 60px;
            margin: -30px;
            animation-delay: 2s;
          }

          @keyframes rippleEffect {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          @keyframes bounceAttention {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) scale(1);
            }
            10% {
              transform: translateY(-8px) scale(1.05);
            }
            30% {
              transform: translateY(-4px) scale(1.02);
            }
            60% {
              transform: translateY(-2px) scale(1.01);
            }
          }

          @keyframes colorShift {
            0% {
              filter: hue-rotate(0deg) brightness(1);
            }
            25% {
              filter: hue-rotate(90deg) brightness(1.1);
            }
            50% {
              filter: hue-rotate(180deg) brightness(1.2);
            }
            75% {
              filter: hue-rotate(270deg) brightness(1.1);
            }
            100% {
              filter: hue-rotate(360deg) brightness(1);
            }
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }

          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .particle {
            position: absolute;
            font-size: 12px;
            opacity: 0;
            animation: particleFloat 4s ease-in-out infinite;
          }

          .particle-1 {
            top: -10px;
            left: -10px;
            animation-delay: 0s;
          }

          .particle-2 {
            top: -15px;
            right: -10px;
            animation-delay: 1.5s;
          }

          .particle-3 {
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            animation-delay: 3s;
          }

          @keyframes particleFloat {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.5);
            }
            10% {
              opacity: 1;
              transform: translateY(-5px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translateY(-15px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-25px) scale(0.5);
            }
          }

          .urgent-attention {
            animation: urgentPulse 0.6s ease-out !important;
          }

          @keyframes urgentPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            }
            25% {
              transform: scale(1.2);
              box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 15px 40px rgba(78, 205, 196, 0.8);
            }
            75% {
              transform: scale(1.15);
              box-shadow: 0 12px 35px rgba(69, 183, 209, 0.8);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            }
          }
        `}
      </style>

      {/* Feedback Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={submitting}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            overflow: 'hidden',
            minHeight: '500px'
          }
        }}
      >
        {/* Loading Backdrop */}
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
            borderRadius: 4
          }}
          open={loading}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" size={40} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading your feedback...
            </Typography>
          </Box>
        </Backdrop>

        <DialogTitle sx={{ 
          pb: 1, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Feedback sx={{ mr: 2, fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  We Value Your Feedback
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Step {step} of 2 - Help us improve your experience
                  {userDetails.name && ` • Hello, ${userDetails.name}!`}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleClose}
              sx={{ color: 'white' }}
              disabled={submitting}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4, minHeight: '400px', position: 'relative' }}>
          {shouldShowContent ? (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
                    What type of feedback do you have?
                  </Typography>
                  <Grid container spacing={3}>
                    {feedbackTypes.map((type) => (
                      <Grid item xs={12} sm={6} key={type.value}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            sx={{
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: feedbackData.type === type.value ? type.color : 'divider',
                              backgroundColor: feedbackData.type === type.value ? `${type.color}15` : 'background.paper',
                              transition: 'all 0.3s ease',
                              height: '140px',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': {
                                borderColor: type.color,
                                backgroundColor: `${type.color}10`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 20px ${type.color}20`,
                              }
                            }}
                            onClick={() => handleFeedbackTypeSelect(type.value)}
                          >
                            <CardContent sx={{ p: 3, textAlign: 'center', width: '100%' }}>
                              <Box sx={{ color: type.color, mb: 2 }}>
                                {React.cloneElement(type.icon, { sx: { fontSize: 36 } })}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {type.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {feedbackData.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                          Great! You've selected "{selectedType?.label}". Click Next to continue.
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedType && (
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Chip
                        icon={selectedType.icon}
                        label={selectedType.label}
                        sx={{
                          backgroundColor: `${selectedType.color}15`,
                          color: selectedType.color,
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 2,
                          px: 1,
                          height: 'auto'
                        }}
                      />
                    </Box>
                  )}

                  {/* Enhanced Rating */}
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                      How would you rate your overall experience?
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      <Box sx={{
                        position: 'relative',
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)'
                      }}>
                        <Rating
                          value={feedbackData.rating}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              setFeedbackData(prev => ({ ...prev, rating: newValue }));
                            }
                          }}
                          size="large"
                          icon={
                            <Star 
                              sx={{ 
                                fontSize: '2.5rem',
                                filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3))',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  filter: 'drop-shadow(0 4px 8px rgba(255, 193, 7, 0.5))'
                                }
                              }} 
                            />
                          }
                          emptyIcon={
                            <StarBorder 
                              sx={{ 
                                fontSize: '2.5rem',
                                color: '#e0e7ff',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  color: '#c7d2fe'
                                }
                              }} 
                            />
                          }
                          sx={{
                            '& .MuiRating-icon': {
                              margin: '0 6px'
                            },
                            '& .MuiRating-iconFilled': {
                              color: '#ffc107',
                            },
                            '& .MuiRating-iconHover': {
                              color: '#ffb300',
                            }
                          }}
                        />
                        <Box sx={{ 
                          position: 'absolute',
                          bottom: '-35px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '100px'
                        }}>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={feedbackData.rating}
                            transition={{ duration: 0.3 }}
                          >
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                color: feedbackData.rating <= 2 ? '#ef4444' : 
                                       feedbackData.rating === 3 ? '#f59e0b' : '#10b981',
                                fontSize: '1.1rem'
                              }}
                            >
                              {ratingLabels[feedbackData.rating]}
                            </Typography>
                          </motion.div>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Category Chips */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Which area does this relate to? (Optional)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {categories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          onClick={() => handleCategorySelect(category)}
                          variant={feedbackData.category === category ? 'filled' : 'outlined'}
                          color={feedbackData.category === category ? 'primary' : 'default'}
                          sx={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: feedbackData.category === category ? 'primary.dark' : 'primary.light',
                              color: 'white'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Subject for non-general feedback */}
                  {feedbackData.type !== 'general' && (
                    <TextField
                      fullWidth
                      label="Subject *"
                      variant="outlined"
                      value={feedbackData.category}
                      onChange={(e) => setFeedbackData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      sx={{ mb: 3 }}
                      placeholder="Brief subject line for your feedback"
                    />
                  )}

                  {/* Message */}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Feedback *"
                    value={feedbackData.message}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                    sx={{ mb: 3 }}
                    placeholder="Please share your detailed feedback, suggestions, or report any issues you've encountered..."
                    required
                  />

                  {/* Email - Auto-filled and disabled */}
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={feedbackData.email}
                    disabled
                    sx={{ 
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                      }
                    }}
                    helperText="Your email is automatically filled from your account"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            // Loading skeleton
            <Box>
              <Skeleton variant="text" height={50} sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          pt: 1, 
          background: 'rgba(102, 126, 234, 0.05)',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
          {step === 2 && shouldShowContent && (
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2, fontWeight: 500 }}
              disabled={submitting}
            >
              Back
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={handleClose}
            sx={{ borderRadius: 2, fontWeight: 500 }}
            disabled={submitting}
          >
            Cancel
          </Button>
          {step === 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!feedbackData.type || !shouldShowContent}
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !shouldShowContent}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          )}
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
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FeedbackWidget;