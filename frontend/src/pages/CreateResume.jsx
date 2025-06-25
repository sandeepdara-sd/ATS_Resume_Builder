import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  Person,
  Work,
  School,
  Star,
  TrendingUp,
  AutoAwesome,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CreateResume() {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const features = [
    { icon: <AutoAwesome />, text: 'AI-powered content generation' },
    { icon: <TrendingUp />, text: 'ATS optimization guaranteed' },
    { icon: <CheckCircle />, text: 'Professional templates' },
    { icon: <Star />, text: 'Real-time scoring' }
  ];

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
            What's Your Experience Level?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Choose your experience level so we can customize the resume sections and AI suggestions for you
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
            {features.map((feature, index) => (
              <Chip 
                key={index}
                icon={feature.icon}
                label={feature.text} 
                color="primary" 
                sx={{ fontWeight: 600 }} 
              />
            ))}
          </Box>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 4,
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                    borderColor: 'success.main',
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }
                }}
                onClick={() => navigate('/resume-builder/fresher')}
              >
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 4,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      mb: 4,
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <School sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Fresher / Entry Level
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                    New to the job market or recent graduate looking to create your first professional resume
                  </Typography>
                  
                  <Paper sx={{ p: 3, mb: 4, backgroundColor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'success.dark' }}>
                      ✨ Sections we'll focus on:
                    </Typography>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ mb: 1, color: 'success.dark' }}>
                        • Personal Details & Contact Info
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'success.dark' }}>
                        • Professional Summary (AI-Generated)
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'success.dark' }}>
                        • Education & Academic Achievements
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'success.dark' }}>
                        • Projects & Coursework
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'success.dark' }}>
                        • Skills & Certifications
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'success.dark' }}>
                        • Hobbies & Interests
                      </Typography>
                    </Box>
                  </Paper>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                      }
                    }}
                  >
                    Start as Fresher
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 4,
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)',
                    borderColor: 'warning.main',
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  }
                }}
                onClick={() => navigate('/resume-builder/experienced')}
              >
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 4,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      mb: 4,
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <Work sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Experienced Professional
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                    Seasoned professional with work experience looking to advance your career
                  </Typography>

                  <Paper sx={{ p: 3, mb: 4, backgroundColor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'warning.dark' }}>
                      🚀 Sections we'll focus on:
                    </Typography>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ mb: 1, color: 'warning.dark' }}>
                        • Personal Details & Contact Info
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'warning.dark' }}>
                        • Executive Summary (AI-Generated)
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'warning.dark' }}>
                        • Professional Experience
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'warning.dark' }}>
                        • Key Projects & Achievements
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: 'warning.dark' }}>
                        • Technical Skills & Expertise
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                        • Education & Certifications
                      </Typography>
                    </Box>
                  </Paper>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(245, 158, 11, 0.4)',
                      }
                    }}
                  >
                    Start as Experienced
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Don't worry, you can always customize later!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
              Our AI will help generate content based on your selection, but you'll have full control to edit and customize every section to match your unique profile.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default CreateResume;