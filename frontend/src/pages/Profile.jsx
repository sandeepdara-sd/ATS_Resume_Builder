import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Email,
  Person,
  Work,
  School,
  Star,
  Delete,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';
import { api_url } from '../helper/Helper';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'ddacnpaqg'
const CLOUDINARY_UPLOAD_PRESET = 'profile_pics'

function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [resumes, setResumes] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, resumeId: null, resumeName: '' });
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    photoURL: '',
    location: '',
    bio: '',
    skills: [],
    experience: '',
    education: ''
  });

  useEffect(() => {
    if (user && token) {
      console.log('User and token available:', { 
        userId: user.uid, 
        tokenExists: !!token,
        apiUrl: api_url 
      });
      fetchUserProfile();
      fetchUserResumes();
    } else {
      console.log('Missing user or token:', { user: !!user, token: !!token });
    }
  }, [user, token]);

  const fetchUserProfile = async () => {
    if (!user?.uid || !token) {
      console.error('Missing user ID or token for profile fetch');
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      console.log('Fetching profile for user:', user.uid);
      console.log('API URL:', `${api_url}/api/users/${user.uid}`);
      console.log('Token preview:', token.substring(0, 20) + '...');

      const response = await axios.get(`${api_url}/api/users/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Profile API Response:', response);
      console.log('Profile data received:', response.data);

      const data = response.data.user || response.data || {};
      
      setProfileData({
        displayName: data.displayName || user.displayName || '',
        email: data.email || user.email || '',
        photoURL: data.photoURL || user.photoURL || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        experience: data.experience || '',
        education: data.education || '',
      });

      console.log('Profile data set successfully');
    } catch (error) {
      console.error('Profile fetch error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      // Fallback to user data from auth context
      if (user) {
        console.log('Using fallback user data from auth context');
        setProfileData({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          phone: '',
          location: '',
          bio: '',
          skills: [],
          experience: '',
          education: '',
        });
      }

      let errorMessage = 'Failed to load profile data';
      if (error.response?.status === 404) {
        errorMessage = 'Profile not found. Using basic account information.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: error.response?.status === 404 ? 'warning' : 'error',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUserResumes = async () => {
    if (!token) {
      console.error('No token available for resumes fetch');
      return;
    }

    try {
      console.log('Fetching resumes...');
      console.log('Resumes API URL:', `${api_url}/api/resumes`);
      
      const response = await axios.get(`${api_url}/api/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('Resumes API Response:', response);
      console.log('Resumes data:', response.data);
      
      setResumes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Resumes fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
      setResumes([]);
    }
  };

  // Edit resume function inspired by Dashboard.jsx
  const handleEditResume = (resume) => {
    navigate(`/resume-builder/${resume.experience?.length > 0 ? 'experienced' : 'fresher'}`, {
      state: { resumeData: resume }
    });
  };

  // Cloudinary image upload function
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle image upload and update profile data
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSnackbar({
        open: true,
        message: 'Please select a valid image file',
        severity: 'error'
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'Image size should be less than 5MB',
        severity: 'error'
      });
      return;
    }

    setImageUploading(true);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });
      const imageUrl = await uploadImageToCloudinary(compressedFile);
      setProfileData(prev => ({ 
        ...prev, 
        photoURL: imageUrl 
      }));
      
      setSnackbar({
        open: true,
        message: 'Image uploaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to upload image. Please try again.',
        severity: 'error'
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !token) {
      console.error('Missing user or token for save operation');
      return;
    }
    
    setSaving(true);

    try {
      console.log('Saving profile data:', profileData);
      
      const response = await axios.put(
        `${api_url}/api/users/${user.uid}`, 
        profileData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Save response:', response);

      const updatedUser = response.data.user || response.data;
      setProfileData({
        displayName: updatedUser.displayName || profileData.displayName,
        email: updatedUser.email || profileData.email,
        phone: updatedUser.phone || '',
        photoURL: updatedUser.photoURL || profileData.photoURL,
        location: updatedUser.location || '',
        bio: updatedUser.bio || '',
        skills: Array.isArray(updatedUser.skills) ? updatedUser.skills : [],
        experience: updatedUser.experience || '',
        education: updatedUser.education || '',
      });

      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditing(false);
    } catch (error) {
      console.error('Save error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          data: error.config?.data
        }
      });
      
      let errorMessage = 'Update failed';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Permission denied. You can only update your own profile.';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchUserProfile(); // Restore last saved values
  };

  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (resume) => {
    const resumeName = resume.personalDetails?.fullName || resume.title || 'Untitled Resume';
    setDeleteDialog({
      open: true,
      resumeId: resume._id,
      resumeName: resumeName
    });
  };

  // Close delete confirmation dialog
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, resumeId: null, resumeName: '' });
  };

  // Confirm and delete resume
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${api_url}/api/resume/${deleteDialog.resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResumes(resumes.filter(resume => resume._id !== deleteDialog.resumeId));
      setSnackbar({
        open: true,
        message: 'Resume deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Failed to delete resume',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, resumeId: null, resumeName: '' });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={60} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" sx={{
            mb: 2,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            My Profile
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
            Manage your account settings and view your resume history
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Profile Information
                  </Typography>
                  {!editing ? (
                    <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={profileData.displayName}
                      onChange={handleInputChange('displayName')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!editing}
                      placeholder="+1 (555) 123-4567"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={profileData.location}
                      onChange={handleInputChange('location')}
                      disabled={!editing}
                      placeholder="City, State, Country"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Bio"
                      value={profileData.bio}
                      onChange={handleInputChange('bio')}
                      disabled={!editing}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience"
                      value={profileData.experience}
                      onChange={handleInputChange('experience')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Education"
                      value={profileData.education}
                      onChange={handleInputChange('education')}
                      disabled={!editing}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={profileData.photoURL}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mb: 2
                    }}
                  >
                    {profileData.displayName?.[0] || profileData.email?.[0] || 'U'}
                  </Avatar>

                  {editing && (
                    <>
                      <input
                        accept="image/*"
                        id="upload-photo"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="upload-photo">
                        <IconButton
                          component="span"
                          disabled={imageUploading}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                          }}
                        >
                          {imageUploading ? (
                            <CircularProgress size={24} />
                          ) : (
                            <PhotoCamera />
                          )}
                        </IconButton>
                      </label>
                    </>
                  )}
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {profileData.displayName || user?.displayName || user?.email?.split('@')[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.email || user?.email}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip icon={<Star />} label="Premium User" color="primary" variant="outlined" />
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Quick Stats</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {resumes.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Resumes Created</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>95%</Typography>
                    <Typography variant="body2" color="text.secondary">ATS Score</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  My Resumes ({resumes.length})
                </Typography>
                {resumes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      No resumes created yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Start building your professional resume today!
                    </Typography>
                    <Button variant="contained" LinkComponent={Link} to='/create-resume' sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      Create Your First Resume
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {resumes.map((resume, index) => (
                      <React.Fragment key={resume._id}>
                        <ListItem sx={{ borderRadius: 2, mb: 1, '&:hover': { backgroundColor: 'action.hover' } }}>
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {resume.personalDetails?.fullName || resume.title || 'Untitled Resume'}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {resume.personalDetails?.email}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              onClick={() => handleEditResume(resume)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                              }}
                              title="Edit Resume"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteClick(resume)} 
                              title="Delete Resume" 
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < resumes.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 2
        }}>
          <Warning sx={{ color: 'warning.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Resume
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem', mb: 2 }}>
            Are you sure you want to delete the resume <strong>"{deleteDialog.resumeName}"</strong>?
          </DialogContentText>
          <DialogContentText sx={{ color: 'warning.main', fontSize: '0.875rem' }}>
            This action cannot be undone. All data associated with this resume will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ 
              minWidth: 100,
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default Profile;
