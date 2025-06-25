import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Zoom
} from '@mui/material';
import { 
  AutoAwesome, 
  Speed, 
  Security, 
  CloudUpload,
  Description,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowForward,
  PlayArrow,
  Visibility,
  Download,
  Analytics,
  Work,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ExpandMore,
  HelpOutline,
  Search,
  Assessment,
  FileUpload,
  Verified,
  Rocket,
  FlashOn,
  Shield,
  KeyboardArrowUp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';


const features = [
  {
    
    icon: <AutoAwesome />,
    title: 'AI-Powered Content Generation',
    description: 'Our advanced AI analyzes job descriptions and generates tailored content that matches what recruiters are looking for',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: <TrendingUp />,
    title: 'ATS Score Analysis',
    description: 'Get real-time scoring against job descriptions with detailed feedback on keyword optimization and formatting',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    icon: <Security />,
    title: 'Industry-Standard Templates',
    description: 'Professional templates designed by HR experts and tested across major ATS systems like Workday and Greenhouse',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    icon: <Speed />,
    title: 'Lightning-Fast Creation',
    description: 'Transform your career story into a compelling resume in under 10 minutes with our streamlined builder',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  {
    icon: <Analytics />,
    title: 'Smart Keyword Optimization',
    description: 'Automatically identify and suggest industry-specific keywords that increase your resume visibility by 40%',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  },
  {
    icon: <CheckCircle />,
    title: 'Format Compatibility',
    description: 'Ensure your resume passes through any ATS system with our format validation and compatibility checker',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
  }
];

const stats = [
  { 
    number: "95%", 
    label: "ATS Pass Rate", 
    description: "of resumes created pass major ATS systems",
    icon: <CheckCircle />,
    color: '#10b981'
  },
  { 
    number: "3x", 
    label: "More Interviews", 
    description: "average increase in interview callbacks",
    icon: <TrendingUp />,
    color: '#667eea'
  },
  { 
    number: "50K+", 
    label: "Success Stories", 
    description: "professionals have landed their dream jobs",
    icon: <Star />,
    color: '#f59e0b'
  },
  { 
    number: "24/7", 
    label: "AI Assistant", 
    description: "always available to optimize your resume",
    icon: <AutoAwesome />,
    color: '#8b5cf6'
  }
];

const processSteps = [
  {
    icon: <CloudUpload />,
    title: "Upload or Start Fresh",
    description: "Upload your existing resume or start from scratch with our guided builder",
    color: '#667eea'
  },
  {
    icon: <AutoAwesome />,
    title: "AI Enhancement",
    description: "Our AI analyzes and enhances your content for maximum ATS compatibility",
    color: '#10b981'
  },
  {
    icon: <TrendingUp />,
    title: "Score & Optimize", 
    description: "Get your ATS score and receive personalized optimization recommendations",
    color: '#f59e0b'
  },
  {
    icon: <Download />,
    title: "Download & Apply",
    description: "Export your professional resume and start applying with confidence",
    color: '#ef4444'
  }
];

const faqs = [
  {
    question: "What is an ATS and why do I need an ATS-optimized resume?",
    answer: "An Applicant Tracking System (ATS) is software used by 99% of Fortune 500 companies and 70% of all employers to automatically screen resumes before human recruiters see them. ATS systems scan resumes for keywords, formatting, and relevance to job descriptions. Without ATS optimization, your resume might be automatically rejected before a human ever reads it, regardless of your qualifications.",
    icon: <Search />
  },
  {
    question: "How does your AI analyze and optimize my resume?",
    answer: "Our AI technology analyzes over 1,000 job descriptions daily across various industries to understand current hiring trends and keyword requirements. It compares your resume against job descriptions, identifies missing keywords, suggests content improvements, and ensures proper formatting. The AI also checks for ATS-friendly elements like standard section headings, appropriate file formats, and readable fonts.",
    icon: <AutoAwesome />
  },
  {
    question: "What ATS systems have you tested your templates with?",
    answer: "We've extensively tested our templates with major ATS platforms including Workday, Greenhouse, Lever, BambooHR, iCIMS, Taleo, SuccessFactors, and over 40 other systems. Our templates maintain 95%+ compatibility across all major ATS platforms, ensuring your resume gets properly parsed and ranked.",
    icon: <Verified />
  },
  {
    question: "How accurate is your ATS scoring system?",
    answer: "Our ATS scoring system has 94% accuracy compared to actual ATS results. We continuously update our algorithms based on real ATS feedback and hiring manager preferences. The score considers keyword density, formatting compatibility, section organization, and content relevance. We also provide detailed explanations for each score component so you understand exactly how to improve.",
    icon: <Assessment />
  },
  {
    question: "Can I upload my existing resume and have it optimized?",
    answer: "Absolutely! You can upload your existing resume in PDF, Word, or text format. Our AI will extract your information, analyze the content against ATS requirements, and suggest improvements. We preserve your original content while optimizing formatting, adding relevant keywords, and restructuring sections for maximum ATS compatibility.",
    icon: <FileUpload />
  },
  {
    question: "What file formats should I use when applying for jobs?",
    answer: "We recommend PDF format for most applications as it preserves formatting across different systems. However, some ATS systems prefer Word documents (.docx). Our platform provides both formats optimized for ATS parsing. We also include guidance on when to use each format based on the company's ATS system.",
    icon: <Description />
  },
  {
    question: "How often should I update my ATS-optimized resume?",
    answer: "Update your resume for each job application by incorporating 3-5 key terms from the specific job description. Our AI makes this process quick by suggesting relevant modifications for each position. Also, update your resume every 3-6 months to reflect new skills, achievements, and industry keyword trends.",
    icon: <TrendingUp />
  },
  {
    question: "Do you provide industry-specific optimization?",
    answer: "Yes! Our AI understands industry-specific requirements for over 50 sectors including technology, healthcare, finance, marketing, engineering, and more. Each industry has unique keyword patterns, skill requirements, and formatting preferences that our system automatically applies to your resume.",
    icon: <Work />
  },
  {
    question: "Is my personal information secure when using your platform?",
    answer: "Absolutely. We use enterprise-grade encryption (AES-256) to protect your data, and we never share your personal information with third parties. Your resume data is stored securely and you can delete your account and all associated data at any time. We're GDPR compliant and follow strict data protection protocols.",
    icon: <Security />
  },
  {
    question: "What's included in the free version vs. premium features?",
    answer: "The free version includes basic ATS optimization, one template, and standard keyword suggestions. Premium features include advanced AI analysis, 20+ professional templates, real-time ATS scoring, industry-specific optimization, unlimited downloads, cover letter builder, and priority support. Most users see significant improvement even with the free version.",
    icon: <Star />
  }
];

const carouselImages = [
  {
    url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    alt: 'Professional working on laptop with resume optimization',
    title: 'Professional Success'
  },
  {
    url: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg',
    alt: 'Resume and documents organized on modern desk',
    title: 'Perfect Resume'
  },
  {
    url: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg',
    alt: 'Professional business meeting interview success',
    title: 'Interview Success'
  },
  {
    url: 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg',
    alt: 'Career success and achievement celebration',
    title: 'Career Growth'
  },
  {
    url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    alt: 'Successful team collaboration in modern office',
    title: 'Team Success'
  }
];

function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(imageTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }} component="main">
      {/* Enhanced Navigation */}
      <AppBar 
        position="fixed" 
        component="header"
        sx={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 20px rgba(102, 126, 234, 0.15)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          zIndex: 1300
        }}
      >
        <Toolbar sx={{ py: 1 }} component="nav">
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              LinkComponent={Link}
              to='/'
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
                  component="h1"
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
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
            </motion.div>
          </Box>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              color="primary" 
              sx={{ mr: 2, fontWeight: 600, color: '#667eea' }}
              LinkComponent={Link}
              to='/login'
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              LinkComponent={Link}
              to='/signup'
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              Get Started Free
            </Button>
          </motion.div>
        </Toolbar>
      </AppBar>

      {/* Enhanced Hero Section with Proper Space-Between Alignment */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: 10
        }}
        component="section"
      >
        {/* Animated Background Particles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            overflow: 'hidden'
          }}
        >
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 120 + 60,
                height: Math.random() * 120 + 60,
                background: 'white',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '80vh',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 6, md: 8 }
              }}
            >
              {/* Left Content Section */}
              <Box sx={{ flex: 1, maxWidth: { md: '50%' } }}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant={isMobile ? "h3" : "h1"}
                    component="h2"
                    sx={{
                      color: 'white',
                      mb: 3,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Beat the ATS System with{' '}
                    <Box 
                      component="span" 
                      sx={{ 
                        color: '#fbbf24',
                        
                      }}
                    >
                      AI-Powered
                    </Box>{' '}
                    Resume Builder
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      mb: 5,
                      lineHeight: 1.6,
                      fontWeight: 400,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    Create ATS-optimized resumes that get past automated screening systems and land you more interviews. 
                    Our AI analyzes job descriptions and optimizes your resume for maximum visibility.
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 5 }}>
                    <motion.div 
                      whileHover={{ scale: 1.08, y: -3 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        LinkComponent={Link}
                        to='/signup'
                        startIcon={<PlayArrow />}
                        sx={{
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: 'white',
                          px: 5,
                          py: 2.5,
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          borderRadius: 3,
                          boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            boxShadow: '0 12px 30px rgba(251, 191, 36, 0.5)'
                          }
                        }}
                      >
                        Start Building Free
                      </Button>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.08, y: -3 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Visibility />}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 5,
                          py: 2.5,
                          fontSize: '1.15rem',
                          fontWeight: 600,
                          borderRadius: 3,
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: '#fbbf24',
                            color: '#fbbf24',
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            borderWidth: 2,
                            boxShadow: '0 8px 25px rgba(251, 191, 36, 0.2)'
                          }
                        }}
                      >
                        Watch Demo
                      </Button> */}
                    </motion.div>
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                          No credit card required
                        </Typography>
                      </Box>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                          95% ATS pass rate
                        </Typography>
                      </Box>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                          Instant download
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              </Box>

              {/* Right Content Section - Enhanced Image Carousel */}
              <Box sx={{ flex: 1, maxWidth: { md: '50%' }, width: '100%' }}>
                <motion.div
                  variants={itemVariants}
                  animate={floatingAnimation}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 550,
                        height: 450,
                        borderRadius: 6,
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        transform: 'perspective(1000px) rotateY(-5deg)',
                        '&:hover': {
                          transform: 'perspective(1000px) rotateY(0deg)',
                          transition: 'transform 0.8s ease'
                        }
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImage}
                          initial={{ opacity: 0, scale: 1.2, rotateY: -20 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Box
                            component="img"
                            src={carouselImages[currentImage].url}
                            alt={carouselImages[currentImage].alt}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                            }}
                          />
                          
                          {/* Image Title Overlay */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              p: 4,
                              color: 'white'
                            }}
                          >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              {carouselImages[currentImage].title}
                            </Typography>
                          </Box>
                        </motion.div>
                      </AnimatePresence>

                      {/* Enhanced Carousel Indicators */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 25,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1.5,
                          zIndex: 2
                        }}
                      >
                        {carouselImages.map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.6 }}
                            animate={{ 
                              scale: index === currentImage ? 1.4 : 0.8,
                              backgroundColor: index === currentImage ? '#fbbf24' : 'rgba(255,255,255,0.6)'
                            }}
                            whileHover={{ scale: index === currentImage ? 1.5 : 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                            onClick={() => setCurrentImage(index)}
                          />
                        ))}
                      </Box>

                      {/* Enhanced Navigation Arrows */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          sx={{
                            position: 'absolute',
                            left: 15,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            '&:hover': { 
                              bgcolor: 'rgba(0,0,0,0.6)',
                              borderColor: 'rgba(255,255,255,0.4)'
                            },
                            zIndex: 2
                          }}
                          onClick={() => setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                          aria-label="Previous image"
                        >
                          <KeyboardArrowLeft />
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: 15,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            '&:hover': { 
                              bgcolor: 'rgba(0,0,0,0.6)',
                              borderColor: 'rgba(255,255,255,0.4)'
                            },
                            zIndex: 2
                          }}
                          onClick={() => setCurrentImage((prev) => (prev + 1) % carouselImages.length)}
                          aria-label="Next image"
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                      </motion.div>
                    </Box>

                    {/* Enhanced Floating Cards */}
                    <motion.div
                      initial={{ opacity: 0, x: 80, y: -20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.2, duration: 1 }}
                      style={{
                        position: 'absolute',
                        top: 30,
                        right: -30,
                        zIndex: 3
                      }}
                    >
                      <motion.div animate={pulseAnimation}>
                        <Paper
                          sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: 4,
                            color: 'white',
                            minWidth: 220,
                            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <FlashOn sx={{ color: '#fbbf24', fontSize: 28 }} />
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              Success Rate
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 800 }}>
                            95% ATS Pass
                          </Typography>
                        </Paper>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -80, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.8, duration: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: 30,
                        left: -40,
                        zIndex: 3
                      }}
                    >
                      <motion.div animate={pulseAnimation}>
                        <Paper
                          sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: 4,
                            color: 'white',
                            minWidth: 200,
                            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <AutoAwesome sx={{ color: '#10b981', fontSize: 28 }} />
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              AI Powered
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)' }}>
                            Smart optimization
                          </Typography>
                        </Paper>
                      </motion.div>
                    </motion.div>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -6, position: 'relative', zIndex: 2 }} component="section">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Paper
            sx={{
              p: 6,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                zIndex: 0
              }}
            />
            
            <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                            color: 'white',
                            mb: 2,
                            boxShadow: `0 8px 25px ${stat.color}40`
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </motion.div>
                      <Typography 
                        variant="h2" 
                        component="div"
                        sx={{ 
                          fontWeight: 800, 
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                          fontSize: { xs: '2.5rem', md: '3rem' }
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {stat.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Container>

      {/* Enhanced How It Works Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }} component="section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              align="center"
              sx={{ mb: 3, color: 'text.primary', fontWeight: 800 }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              component="p"
              align="center"
              sx={{ mb: 8, color: 'text.secondary', maxWidth: 650, mx: 'auto', lineHeight: 1.6 }}
            >
              Transform your career story into an ATS-optimized resume in 4 simple steps
            </Typography>
          </motion.div>

          <Grid container spacing={5}>
            {processSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.02 }}
                >
                  <Box sx={{ position: 'relative', pt: 4 }}>
                    {/* Step Number Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        boxShadow: `0 4px 15px ${step.color}40`,
                        zIndex: 2,
                        border: '2px solid white',
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 4,
                        pt: 6,
                        zIndex: 1,
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255,255,255,0.5)',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          boxShadow: `0 20px 40px ${step.color}30`,
                          borderColor: step.color
                        }
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            p: 3,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`,
                            color: 'white',
                            mb: 3,
                            mt: 2,
                            boxShadow: `0 8px 25px ${step.color}30`
                          }}
                        >
                          {step.icon}
                        </Box>
                      </motion.div>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>
                    </Card>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }} component="section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{ mb: 3, color: 'text.primary', fontWeight: 800 }}
          >
            Powerful ATS Features
          </Typography>
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{ mb: 8, color: 'text.secondary', maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
          >
            Everything you need to create resumes that pass ATS systems and impress hiring managers
          </Typography>
        </motion.div>

        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.4s ease',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: `0 25px 50px ${feature.color}20`,
                      borderColor: feature.color,
                      '&::before': {
                        opacity: 1
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: feature.gradient,
                      opacity: 0,
                      transition: 'opacity 0.4s ease'
                    }
                  }}
                >
                  <CardContent sx={{ p: 5, textAlign: 'center', position: 'relative' }}>
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 3,
                          borderRadius: '50%',
                          background: feature.gradient,
                          color: 'white',
                          mb: 3,
                          boxShadow: `0 10px 30px ${feature.color}30`
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </motion.div>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced FAQ Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }} component="section">
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div
                animate={pulseAnimation}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    mb: 4
                  }}
                >
                  <HelpOutline sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </motion.div>
              <Typography
                variant="h2"
                component="h2"
                sx={{ mb: 3, color: 'white', fontWeight: 800 }}
              >
                Frequently Asked Questions
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
              >
                Everything you need to know about ATS optimization and our resume builder
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Accordion
                    expanded={expandedFaq === `panel${index}`}
                    onChange={handleFaqChange(`panel${index}`)}
                    sx={{
                      mb: 3,
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px !important',
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        background: 'rgba(255,255,255,0.18)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: 'white', fontSize: 32 }} />}
                      sx={{
                        color: 'white',
                        py: 2,
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          gap: 3,
                          margin: '16px 0'
                        }
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            flexShrink: 0
                          }}
                        >
                          {faq.icon}
                        </Box>
                      </motion.div>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ color: 'rgba(255,255,255,0.95)', pt: 0, pb: 3 }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.8, pl: 8, fontSize: '1.05rem' }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
        component="section"
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1
          }}
        >
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 80 + 40,
                height: Math.random() * 80 + 40,
                background: 'white',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </Box>
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              align="center"
              sx={{ color: 'white', mb: 4, fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
            >
              Ready to Beat the ATS System?
            </Typography>
            <Typography
              variant="h5"
              component="p"
              align="center"
              sx={{ color: 'rgba(255,255,255,0.9)', mb: 6, lineHeight: 1.6 }}
            >
              Join over 50,000 professionals who have successfully landed interviews with our ATS-optimized resumes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
              <motion.div 
                whileHover={{ scale: 1.08, y: -5 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  LinkComponent={Link}
                  to='/signup'
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    px: 8,
                    py: 3,
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    borderRadius: 4,
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      boxShadow: '0 12px 40px rgba(251, 191, 36, 0.5)'
                    }
                  }}
                >
                  Start Building Your Resume Now
                </Button>
              </motion.div>
            </Box>
            <Typography
              variant="body1"
              component="p"
              align="center"
              sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}
            >
              No credit card required • Free forever • Export instantly
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="large"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
            },
            zIndex: 1000
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
}

export default LandingPage;