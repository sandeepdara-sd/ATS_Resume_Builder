import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  AppBar,
  Toolbar,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Email,
  ArrowBack,
  Send,
  Rocket
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { api_url } from '../helper/Helper';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // EmailJS configuration - replace with your actual values
 const REACT_APP_EMAILJS_SERVICE_ID="service_wy23pkg"
 const REACT_APP_EMAILJS_TEMPLATE_ID="template_hf5anq6"
 const REACT_APP_EMAILJS_PUBLIC_KEY="VBpoCDnAiP7ZADRcD"

  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key';
  const sendEmailWithEmailJS = async (emailData) => {
    try {
      console.log('🔄 Sending email with EmailJS...');
      console.log('📧 Email data:', emailData);
      
      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: emailData.to_email,
          to_name: emailData.to_name,
          from_name: emailData.from_name,
          subject: emailData.subject,
          reset_url: emailData.reset_url,
          user_name: emailData.user_name,
          expiry_time: emailData.expiry_time,
          app_name: emailData.app_name,
          support_url: emailData.support_url,
          // Custom message for the email template
          message: `Hello ${emailData.user_name},

You requested a password reset for your ATS Resume Builder account.

Click the following link to reset your password:
${emailData.reset_url}

This link will expire at: ${emailData.expiry_time}

If you didn't request this password reset, please ignore this email.

Best regards,
ATS Resume Builder Team`
        }
      );
      
      console.log('✅ Email sent successfully with EmailJS:', response);
      return { success: true, response };
      
    } catch (error) {
      console.error('❌ Failed to send email with EmailJS:', error);
      
      // Handle specific EmailJS errors
      let errorMessage = 'Failed to send reset email';
      if (error.text?.includes('Invalid API key')) {
        errorMessage = 'Email service configuration error - Invalid API key';
      } else if (error.text?.includes('Template not found')) {
        errorMessage = 'Email template configuration error';
      } else if (error.text?.includes('Service not found')) {
        errorMessage = 'Email service configuration error';
      } else if (error.text?.includes('rate limit')) {
        errorMessage = 'Too many email requests. Please try again later.';
      }
      
      return { success: false, error: errorMessage, details: error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, make the API call to generate the reset token
      console.log('🔄 Requesting password reset token...');
      const response = await axios.post(`${api_url}/api/forgot-password`, { email });
      console.log('✅ Password reset token generated:', response.data);

      // Check if EmailJS configuration is available
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY ||
          EMAILJS_SERVICE_ID === 'your_service_id' ||
          EMAILJS_TEMPLATE_ID === 'your_template_id' ||
          EMAILJS_PUBLIC_KEY === 'your_public_key') {
        console.log('⚠️ EmailJS not configured properly');
        console.log('📧 EmailJS Config:', {
          serviceId: EMAILJS_SERVICE_ID,
          templateId: EMAILJS_TEMPLATE_ID,
          publicKey: EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing'
        });
        
        // Show success message even if email isn't sent (for development)
        setSuccess(true);
        return;
      }

      // If emailData is provided in the response, send the email
      if (response.data.emailData) {
        console.log('🔄 Sending email with EmailJS...');
        const emailResult = await sendEmailWithEmailJS(response.data.emailData);
        
        if (emailResult.success) {
          console.log('✅ Email sent successfully');
          setSuccess(true);
        } else {
          console.error('❌ Failed to send email:', emailResult.error);
          setError(`Reset token generated but failed to send email: ${emailResult.error}`);
        }
      } else {
        // Fallback: show success message even without emailData
        console.log('✅ Reset token generated (email data not provided)');
        setSuccess(true);
      }
      
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.isGoogleUser) {
        setError('This account was created with Google. Please sign in using the "Continue with Google" button instead.');
      } else {
        setError(error.response?.data?.error || 'Failed to process password reset request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 20px rgba(102, 126, 234, 0.15)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          zIndex: 1300
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Rocket sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ATS Resume Builder
                </Typography>
              </Box>
            </motion.div>
            <Chip
              label="AI Powered"
              size="small"
              sx={{
                ml: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': {
                  fontSize: '0.75rem'
                }
              }}
            />
          </Box>
          <Button
            color="primary"
            startIcon={<ArrowBack />}
            LinkComponent={Link}
            to='/login'
            sx={{ fontWeight: 600, color: '#667eea' }}
          >
            Back to Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4,
          pt: 12
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Forgot Password?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter your email address and we'll send you a link to reset your password
                </Typography>
              </Box>

              {success ? (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Email Sent Successfully!
                  </Typography>
                  <Typography variant="body2">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Please check your email and follow the instructions to reset your password.
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Don't see the email? Check your spam folder or try again.
                  </Typography>
                  {/* Show EmailJS configuration status in development */}
                  
                </Alert>
              ) : (
                <>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Show EmailJS configuration status in development */}
                  

                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      sx={{
                        mb: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0.7
                        }
                      }}
                    >
                      {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </>
              )}

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>

              {/* Instructions for EmailJS setup in development mode */}
              {/* {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🛠️ EmailJS Setup Instructions:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                    1. Create account at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">emailjs.com</a>
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                    2. Create an email service (Gmail, Outlook, etc.)
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                    3. Create an email template with these variables: to_email, to_name, from_name, subject, reset_url, user_name, expiry_time, app_name, support_url, message
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                    4. Add environment variables to your .env file:
                  </Typography>
                  <Box component="code" sx={{ 
                    display: 'block', 
                    bgcolor: '#333', 
                    color: '#fff', 
                    p: 1, 
                    borderRadius: 1, 
                    fontSize: '0.75rem',
                    mt: 1
                  }}>
                    REACT_APP_EMAILJS_SERVICE_ID=your_service_id<br />
                    REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id<br />
                    REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
                  </Box>
                </Box>
              )} */}
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </div>
  );
}

export default ForgotPassword;