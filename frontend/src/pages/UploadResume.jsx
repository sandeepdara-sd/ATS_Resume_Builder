import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Description,
  TrendingUp,
  CheckCircle,
  FileUpload,
  Analytics
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { api_url } from '../helper/Helper';

function UploadResume() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${api_url}/api/upload-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setUploadedFile({
        name: file.name,
        size: file.size,
        data: response.data
      });
    } catch (error) {
      setError('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Upload Your Resume
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Upload your existing resume and let our AI analyze and improve it for better ATS compatibility
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Analytics />}
              label="AI Analysis" 
              color="primary" 
              sx={{ fontWeight: 600 }} 
            />
            <Chip 
              icon={<TrendingUp />}
              label="ATS Scoring" 
              color="success" 
              sx={{ fontWeight: 600 }} 
            />
            <Chip 
              icon={<CheckCircle />}
              label="Instant Results" 
              color="warning" 
              sx={{ fontWeight: 600 }} 
            />
          </Box>
        </motion.div>

        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              {...getRootProps()}
              sx={{
                p: 8,
                textAlign: 'center',
                border: '3px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                backgroundColor: isDragActive ? 'primary.light' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: isDragActive ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }
              }}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{
                  scale: isDragActive ? 1.1 : 1,
                  rotate: isDragActive ? 5 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <FileUpload
                  sx={{
                    fontSize: 100,
                    color: isDragActive ? 'primary.main' : 'grey.400',
                    mb: 3,
                  }}
                />
              </motion.div>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Or click to select your PDF file
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                Browse Files
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: '1rem' }}>
                <strong>Supported format:</strong> PDF only • <strong>Max size:</strong> 10MB
              </Typography>
            </Paper>

            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
                    Uploading and analyzing... {uploadProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ 
                      borderRadius: 2, 
                      height: 8,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Our AI is analyzing your resume for ATS compatibility...
                  </Typography>
                </Box>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3, border: '2px solid', borderColor: 'success.main' }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                Resume Uploaded Successfully!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your resume has been analyzed and is ready for the next step
              </Typography>
            </Paper>

            <Typography
              variant="h4"
              sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}
            >
              What would you like to do next?
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: 3,
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)',
                        borderColor: 'error.main',
                      },
                    }}
                    onClick={() => navigate('/score-resume', { state: { resumeData: uploadedFile.data } })}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 3,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          mb: 3,
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 50 }} />
                      </Box>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Score Against Job
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                        Get an ATS score and detailed feedback on how your resume matches a specific job description with actionable insights
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Analyze Score
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: 3,
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                        borderColor: 'success.main',
                      },
                    }}
                    onClick={() => navigate('/resume-builder/improve', { state: { resumeData: uploadedFile.data } })}
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
                        <Description sx={{ fontSize: 50 }} />
                      </Box>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Create ATS Resume
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                        Transform your current resume into an ATS-friendly format with AI enhancements and professional templates
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Improve Resume
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

export default UploadResume;