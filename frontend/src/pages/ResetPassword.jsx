import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Rocket,
  AccessTime,
  Warning,
  Email
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../helper/Helper.js';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [linkExpired, setLinkExpired] = useState(false);
  const [linkUsed, setLinkUsed] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [initialValidation, setInitialValidation] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Validate token immediately on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setError('Invalid reset link. Please request a new password reset.');
        setLinkExpired(true);
        return;
      }

      try {
        setLoading(true);
        console.log('🔄 Validating token with API:', `${api_url}/api/validate-reset-token`);
        
        const response = await axios.post(`${api_url}/api/validate-reset-token`, {
          token,
          email
        });
        
        console.log('✅ Token validation successful:', response.data);
        setInitialValidation(true);
      } catch (error) {
        console.error('❌ Token validation failed:', error);
        console.error('Response data:', error.response?.data);
        console.error('Status:', error.response?.status);
        
        if (error.response?.data?.isGoogleUser) {
          setIsGoogleUser(true);
        } else if (error.response?.data?.linkExpired) {
          setLinkExpired(true);
        } else if (error.response?.data?.linkUsed) {
          setLinkUsed(true);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          setError('Unable to connect to server. Please check your connection and try again.');
          setLinkExpired(true);
        } else {
          const errorMsg = error.response?.data?.error || 'Invalid or expired reset link';
          if (errorMsg.includes('expired')) {
            setLinkExpired(true);
          } else if (errorMsg.includes('used')) {
            setLinkUsed(true);
          } else {
            setError(errorMsg);
            setLinkExpired(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleGoToForgotPassword = useCallback(() => {
    navigate('/forgot-password');
  }, [navigate]);

  // FIXED: Stable callbacks without error dependency
  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setPassword(value);
    // Clear specific password-related errors when user starts typing
    setError(prevError => {
      if (prevError && (prevError.includes('Passwords do not match') || prevError.includes('Password must be'))) {
        return '';
      }
      return prevError;
    });
  }, []); // No dependencies to prevent recreation

  const handleConfirmPasswordChange = useCallback((e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // Clear password match errors when user starts typing
    setError(prevError => {
      if (prevError && prevError.includes('Passwords do not match')) {
        return '';
      }
      return prevError;
    });
  }, []); // No dependencies to prevent recreation

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Attempting password reset for:', email);
      const response = await axios.post(`${api_url}/api/reset-password`, {
        token,
        email,
        newPassword: password
      });
      console.log('✅ Password reset response:', response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('❌ Password reset error:', error);
      console.error('Response data:', error.response?.data);
      
      // Handle specific error cases with improved logic
      if (error.response?.data?.isGoogleUser) {
        setIsGoogleUser(true);
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorMsg = errorData?.error;
        
        // Check for specific flags from backend
        if (errorData?.linkExpired) {
          setLinkExpired(true);
        } else if (errorData?.linkUsed) {
          setLinkUsed(true);
        } else if (errorMsg?.includes('expired')) {
          setLinkExpired(true);
        } else if (errorMsg?.includes('used')) {
          setLinkUsed(true);
        } else {
          setError(errorMsg || 'Invalid reset link. Please request a new password reset.');
        }
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, token, email, navigate]);

  // FIXED: Memoized Header component
  const Header = useMemo(() => (
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
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
      </Toolbar>
    </AppBar>
  ), [navigate]);

  // Memoized page components to prevent re-renders
  const LoadingPage = useMemo(() => (
    <Paper
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Validating reset link...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we verify your password reset link.
      </Typography>
      {process.env.NODE_ENV === 'development' && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          API URL: {api_url}
        </Typography>
      )}
    </Paper>
  ), []);

  const ExpiredLinkPage = useMemo(() => (
    <Paper
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <AccessTime sx={{ color: 'white', fontSize: 40 }} />
        </Box>
      </motion.div>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#ee5a24',
          mb: 2,
        }}
      >
        Link Expired or Invalid
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        {error || 'This password reset link has expired or is invalid. Reset links are only valid for a limited time to protect your account.'}
      </Typography>

      <Box sx={{ 
        mb: 3,
        p: 2.5,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)',
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#667eea',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Email sx={{ fontSize: 20 }} />
          Use Forgot Password to get a new reset link
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleGoToForgotPassword}
        startIcon={<Email />}
        sx={{
          mb: 3,
          py: 1.5,
          px: 4,
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Go to Forgot Password
      </Button>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Remember your password?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Sign in here
          </span>
        </Typography>
      </Box>
    </Paper>
  ), [error, navigate, handleGoToForgotPassword]);

  const LinkUsedPage = useMemo(() => (
    <Paper
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <Warning sx={{ color: 'white', fontSize: 40 }} />
        </Box>
      </motion.div>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#ff9800',
          mb: 2,
        }}
      >
        Link Already Used
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        This password reset link has already been used. Each reset link can only be used once for security reasons.
      </Typography>

      <Box sx={{ 
        mb: 3,
        p: 2.5,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)',
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#667eea',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Email sx={{ fontSize: 20 }} />
          Use Forgot Password to get a new reset link
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleGoToForgotPassword}
        startIcon={<Email />}
        sx={{
          mb: 3,
          py: 1.5,
          px: 4,
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Go to Forgot Password
      </Button>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Remember your password?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Sign in here
          </span>
        </Typography>
      </Box>
    </Paper>
  ), [navigate, handleGoToForgotPassword]);

  const GoogleUserPage = useMemo(() => (
    <Paper
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <Typography sx={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>G</Typography>
        </Box>
      </motion.div>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#4285f4',
          mb: 2,
        }}
      >
        Google Account Detected
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        This account uses Google sign-in. You cannot reset the password as it's managed by Google.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/login')}
        sx={{
          mb: 3,
          py: 1.5,
          px: 4,
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Sign in with Google
      </Button>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Need help?{' '}
          <span
            onClick={() => navigate('/contact')}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Contact Support
          </span>
        </Typography>
      </Box>
    </Paper>
  ), [navigate]);

  const SuccessPage = useMemo(() => (
    <Paper
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Alert 
        severity="success" 
        icon={<CheckCircle />}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Password Reset Successful!
        </Typography>
        <Typography variant="body2">
          Your password has been updated successfully. You will be redirected to the login page in a few seconds.
        </Typography>
      </Alert>
    </Paper>
  ), []);

  // FIXED: Memoized Reset Form
  const ResetForm = useMemo(() => (
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
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your new password below
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          required
          autoComplete="new-password"
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            minLength: 6,
            'aria-describedby': 'password-helper-text'
          }}
        />

        <TextField
          fullWidth
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          autoComplete="new-password"
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                  aria-label="toggle confirm password visibility"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || !initialValidation || !password || !confirmPassword}
          sx={{
            mb: 3,
            py: 1.5,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Remember your password?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Sign in here
          </span>
        </Typography>
      </Box>
    </Paper>
  ), [
    error, 
    password, 
    confirmPassword, 
    showPassword, 
    showConfirmPassword, 
    loading, 
    initialValidation,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    navigate
  ]);

  // Render the appropriate content
  const renderContent = useCallback(() => {
    if (loading && !initialValidation) return LoadingPage;
    if (success) return SuccessPage;
    if (linkExpired) return ExpiredLinkPage;
    if (linkUsed) return LinkUsedPage;
    if (isGoogleUser) return GoogleUserPage;
    if (error && !initialValidation) return ExpiredLinkPage;
    if (initialValidation) return ResetForm;
    return LoadingPage;
  }, [
    loading,
    initialValidation,
    success,
    linkExpired,
    linkUsed,
    isGoogleUser,
    error,
    LoadingPage,
    SuccessPage,
    ExpiredLinkPage,
    LinkUsedPage,
    GoogleUserPage,
    ResetForm
  ]);

  return (
    <div>
      {Header}

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
            {renderContent()}
          </motion.div>
        </Container>
      </Box>
    </div>
  );
}

export default ResetPassword;