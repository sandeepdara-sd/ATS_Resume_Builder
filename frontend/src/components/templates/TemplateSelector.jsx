import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Visibility,
  Close,
  Star,
  TrendingUp,
  Business,
  School,
  Code
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import actual template components
import ModernProfessionalTemplate from './ModernProfessionalTemplate';
import ClassicExecutiveTemplate from './ClassicExecutiveTemplate';
import TechFocusedTemplate from './TechFocusedTemplate';
import FreshGraduateTemplate from './FreshGraduateTemplate';
import MinimalElegantTemplate from './MinimalElegantTemplate';

const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean ATS-optimized design for corporate roles',
    category: 'Professional',
    atsScore: 98,
    features: ['ATS Optimized', 'Clean Layout'],
    icon: <Business />,
    color: '#667eea',
    component: ModernProfessionalTemplate
  },
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    description: 'Traditional format ideal for senior positions',
    category: 'Executive',
    atsScore: 99,
    features: ['ATS Perfect', 'Executive Level'],
    icon: <Star />,
    color: '#10b981',
    component: ClassicExecutiveTemplate
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Optimized for software developers and tech roles',
    category: 'Technology',
    atsScore: 96,
    features: ['ATS Optimized', 'Tech Focused'],
    icon: <Code />,
    color: '#f59e0b',
    component: TechFocusedTemplate
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    description: 'Perfect for new graduates and entry-level',
    category: 'Entry Level',
    atsScore: 94,
    features: ['ATS Optimized', 'Education Focus'],
    icon: <School />,
    color: '#ef4444',
    component: FreshGraduateTemplate
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Sophisticated minimalist design for any industry',
    category: 'Universal',
    atsScore: 97,
    features: ['ATS Optimized', 'Minimalist'],
    icon: <TrendingUp />,
    color: '#8b5cf6',
    component: MinimalElegantTemplate
  }
];

// Enhanced Mock Data - More realistic and comprehensive
const mockResumeData = {
  personalDetails: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
    website: 'sarahjohnson.dev'
  },
  summary: 'Results-driven Full-Stack Developer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies with a proven track record of delivering high-quality solutions. Passionate about clean code, user experience, and continuous learning.',
  experience: [
    {
      jobTitle: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'Seattle, WA',
      startDate: '2022-03',
      endDate: '',
      currentJob: true,
      responsibilities: '• Led development of customer-facing dashboard serving 100K+ daily users, improving load time by 45%\n• Architected and implemented microservices architecture using Node.js and Docker, reducing system downtime by 60%\n• Mentored 3 junior developers and conducted weekly code reviews to maintain code quality standards\n• Collaborated with product managers and designers to deliver 15+ features on schedule'
    },
    {
      jobTitle: 'Software Developer',
      company: 'Digital Innovations Inc.',
      location: 'Portland, OR',
      startDate: '2020-06',
      endDate: '2022-02',
      currentJob: false,
      responsibilities: '• Developed and maintained RESTful APIs using Node.js and Express, handling 1M+ requests daily\n• Built responsive frontend components with React and Material-UI, improving user engagement by 30%\n• Implemented automated testing with Jest and Cypress, increasing code coverage to 85%\n• Optimized database queries reducing average response time by 40%'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Washington',
      location: 'Seattle, WA',
      startDate: '2016-09',
      endDate: '2020-05',
      graduationDate: '2020-05',
      gpa: '3.85',
      achievements: 'Dean\'s List (6 semesters), Computer Science Department Award for Academic Excellence'
    }
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Express',
    'Python',
    'Django',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Kubernetes',
    'AWS',
    'Git',
    'Jenkins',
    'REST APIs',
    'GraphQL',
    'Agile/Scrum'
  ],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Implemented features like product search, filtering, cart management, and order tracking.',
      technologies: 'React, Node.js, Express, MongoDB, Stripe API, Redux, Material-UI',
      link: 'github.com/sarah/ecommerce-platform',
      duration: '2023'
    },
    {
      name: 'Task Management System',
      description: 'Developed a collaborative task management application with real-time updates, team collaboration features, and analytics dashboard. Supports multiple workspaces and role-based access control.',
      technologies: 'React, Firebase, TypeScript, Tailwind CSS, Chart.js',
      link: 'github.com/sarah/task-manager',
      duration: '2022'
    }
  ],
  achievements: [
    {
      title: 'AWS Certified Solutions Architect - Associate',
      organization: 'Amazon Web Services',
      description: 'Demonstrated expertise in designing distributed systems on AWS platform',
      date: '2023-08',
      link: ''
    },
    {
      title: 'Best Innovation Award',
      organization: 'TechCorp Solutions Hackathon 2023',
      description: 'Led team that developed an AI-powered code review tool, reducing review time by 50%',
      date: '2023-06',
      link: ''
    },
    {
      title: 'Open Source Contributor',
      organization: 'Various Projects',
      description: 'Active contributor to React and Node.js ecosystems with 500+ GitHub contributions',
      date: '',
      link: 'github.com/sarahjohnson'
    }
  ],
  hobbies: [
    'Open Source Contributing',
    'Tech Blogging',
    'Photography',
    'Hiking',
    'Playing Guitar'
  ]
};

function TemplateSelector({ selectedTemplate, onTemplateSelect, resumeData }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(0.45);

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  const handleSelect = (template) => {
    onTemplateSelect(template);
  };

  const handleZoomIn = () => {
    setPreviewZoom(prev => Math.min(prev + 0.05, 0.7));
  };

  const handleZoomOut = () => {
    setPreviewZoom(prev => Math.max(prev - 0.05, 0.3));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, textAlign: 'center' }}>
        Choose Your Resume Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 600, mx: 'auto', lineHeight: 1.5 }}>
        All templates are ATS-friendly and optimized for applicant tracking systems. Each template uses the same data structure for consistency.
      </Typography>

      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} key={template.id}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                onClick={() => handleSelect(template)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: selectedTemplate?.id === template.id ? template.color : 'divider',
                  backgroundColor: selectedTemplate?.id === template.id ? `${template.color}08` : 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: template.color,
                    boxShadow: `0 4px 16px ${template.color}20`,
                  }
                }}
              >
                {selectedTemplate?.id === template.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2
                    }}
                  >
                    <CheckCircle sx={{ color: template.color, fontSize: 20 }} />
                  </Box>
                )}

                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: `${template.color}15`,
                        color: template.color,
                        mr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {React.cloneElement(template.icon, { sx: { fontSize: 20 } })}
                    </Box>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.2 }}>
                        {template.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip
                          label={template.category}
                          size="small"
                          sx={{
                            backgroundColor: `${template.color}15`,
                            color: template.color,
                            fontWeight: 500,
                            height: 20,
                            fontSize: '0.65rem'
                          }}
                        />
                        <Chip
                          label="ATS ✓"
                          size="small"
                          sx={{ 
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            fontSize: '0.65rem', 
                            height: 20,
                            fontWeight: 600
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: template.color, 
                            fontWeight: 700,
                            ml: 0.5
                          }}
                        >
                          {template.atsScore}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1.5, 
                      fontSize: '0.85rem', 
                      lineHeight: 1.4 
                    }}
                  >
                    {template.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {template.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 20,
                          color: feature.includes('ATS') ? 'success.main' : 'text.secondary',
                          borderColor: feature.includes('ATS') ? 'success.main' : 'divider'
                        }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility sx={{ fontSize: 16 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template);
                      }}
                      sx={{ 
                        flex: 1,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        py: 0.75,
                        borderWidth: 1.5,
                        '&:hover': {
                          borderWidth: 1.5
                        }
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        flex: 1,
                        backgroundColor: template.color,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        py: 0.75,
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: template.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      {selectedTemplate?.id === template.id ? '✓ Selected' : 'Select'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog - Using Actual Template Components */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2.5,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {previewTemplate?.name} Preview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Using actual template with sample data
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              size="small"
              onClick={handleZoomOut}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              -
            </Button>
            <Chip
              label={`${Math.round(previewZoom * 100)}%`}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Button
              size="small"
              onClick={handleZoomIn}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              +
            </Button>
            <IconButton onClick={() => setPreviewOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, bgcolor: '#f5f5f5' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              minHeight: '70vh',
              maxHeight: '75vh',
              overflow: 'auto',
              p: 3
            }}
          >
            <Box
              sx={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                mb: 4
              }}
            >
              {previewTemplate && React.createElement(previewTemplate.component, {
                resumeData: mockResumeData
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setPreviewOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSelect(previewTemplate);
              setPreviewOpen(false);
            }}
            sx={{
              backgroundColor: previewTemplate?.color,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: previewTemplate?.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TemplateSelector;