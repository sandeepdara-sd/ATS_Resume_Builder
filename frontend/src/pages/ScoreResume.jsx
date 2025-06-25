import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Lightbulb,
  Analytics,
  Assessment,
  AutoAwesome
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { api_url } from '../helper/Helper';

function ScoreResume() {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [error, setError] = useState('');

  const resumeData = location.state?.resumeData;

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post( `${api_url}/api/analyze-resume`, {
        resumeData,
        jobDescription
      });

      setScoreResult(response.data);
    } catch (error) {
      console.log(error);
      
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle />;
    if (score >= 60) return <Warning />;
    return <Error />;
  };

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
            Get Your ATS Score
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Paste the job description below and get a detailed analysis of how well your resume matches
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Analytics />}
              label="AI Analysis" 
              color="primary" 
              sx={{ fontWeight: 600 }} 
            />
            <Chip 
              icon={<Assessment />}
              label="Detailed Scoring" 
              color="success" 
              sx={{ fontWeight: 600 }} 
            />
            <Chip 
              icon={<AutoAwesome />}
              label="Smart Recommendations" 
              color="warning" 
              sx={{ fontWeight: 600 }} 
            />
          </Box>
        </motion.div>

        {!scoreResult ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Job Description Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Copy and paste the job description you want to analyze your resume against. Our AI will provide detailed insights and scoring.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                placeholder="Paste the complete job description here...

Example:
We are looking for a Software Engineer with 3+ years of experience in React, Node.js, and Python. The ideal candidate should have experience with cloud platforms like AWS, strong problem-solving skills, and excellent communication abilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={analyzeResume}
                disabled={loading || !jobDescription.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUp />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
              </Button>
              
              {loading && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Our AI is analyzing your resume against the job requirements...
                  </Typography>
                  <LinearProgress 
                    sx={{ 
                      borderRadius: 2, 
                      height: 6,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2
                      }
                    }} 
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Score Overview */}
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3, border: '2px solid', borderColor: `${getScoreColor(scoreResult.overallScore)}.main` }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Your ATS Compatibility Score
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={scoreResult.overallScore}
                    size={150}
                    thickness={6}
                    color={getScoreColor(scoreResult.overallScore)}
                    sx={{
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      }
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: `${getScoreColor(scoreResult.overallScore)}.main` }}>
                      {scoreResult.overallScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      out of 100
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Chip
                icon={getScoreIcon(scoreResult.overallScore)}
                label={
                  scoreResult.overallScore >= 80 ? 'Excellent Match! 🎉' :
                  scoreResult.overallScore >= 60 ? 'Good Match 👍' : 'Needs Improvement 📈'
                }
                color={getScoreColor(scoreResult.overallScore)}
                size="large"
                sx={{ fontSize: '1.1rem', py: 3, px: 2, fontWeight: 600 }}
              />
              
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}>
                {scoreResult.overallScore >= 80 
                  ? 'Your resume is highly optimized for this job! You have a great chance of passing ATS screening.'
                  : scoreResult.overallScore >= 60 
                  ? 'Your resume shows good alignment with the job requirements. A few improvements could boost your score.'
                  : 'Your resume needs optimization to better match this job. Follow our recommendations below to improve your ATS score.'
                }
              </Typography>
            </Paper>

            {/* Detailed Scores */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {scoreResult.detailedScores?.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.category}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.score}
                            color={getScoreColor(item.score)}
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: `${getScoreColor(item.score)}.main` }}>
                          {item.score}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Suggestions */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lightbulb sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                AI-Powered Recommendations
              </Typography>
              
              <Grid container spacing={2}>
                {scoreResult.suggestions?.map((suggestion, index) => (
                  <Grid item xs={12} key={index}>
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: 24
                        }
                      }}
                      icon={<Lightbulb />}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {suggestion}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Missing Keywords */}
            {scoreResult.missingKeywords?.length > 0 && (
              <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Missing Keywords
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Consider adding these important keywords to improve your ATS score:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {scoreResult.missingKeywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      variant="outlined"
                      color="warning"
                      sx={{ 
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'warning.light',
                          color: 'warning.contrastText'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setScoreResult(null)}
                sx={{ mr: 2, px: 4, py: 1.5, borderRadius: 2 }}
              >
                Analyze Another Job
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/resume-builder/improve', { state: { resumeData, scoreResult } })}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                Improve My Resume
              </Button>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

export default ScoreResume;