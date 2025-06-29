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
  IconButton
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

const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate roles',
    category: 'Professional',
    atsScore: 95,
    features: ['Clean Layout', 'ATS Optimized', 'Professional'],
    preview: '/templates/modern-professional-preview.jpg',
    icon: <Business />,
    color: '#667eea'
  },
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    description: 'Traditional format ideal for senior positions',
    category: 'Executive',
    atsScore: 98,
    features: ['Traditional', 'Executive Level', 'Conservative'],
    preview: '/templates/classic-executive-preview.jpg',
    icon: <Star />,
    color: '#10b981'
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Optimized for software developers and tech roles',
    category: 'Technology',
    atsScore: 92,
    features: ['Tech Optimized', 'Skills Focused', 'Modern'],
    preview: '/templates/tech-focused-preview.jpg',
    icon: <Code />,
    color: '#f59e0b'
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    description: 'Perfect for new graduates and entry-level positions',
    category: 'Entry Level',
    atsScore: 90,
    features: ['Education Focus', 'Clean Design', 'Entry Level'],
    preview: '/templates/fresh-graduate-preview.jpg',
    icon: <School />,
    color: '#ef4444'
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Sophisticated minimalist design for any industry',
    category: 'Universal',
    atsScore: 94,
    features: ['Minimalist', 'Elegant', 'Universal'],
    preview: '/templates/minimal-elegant-preview.jpg',
    icon: <TrendingUp />,
    color: '#8b5cf6'
  }
];

function TemplateSelector({ selectedTemplate, onTemplateSelect, resumeData }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  const handleSelect = (template) => {
    onTemplateSelect(template);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
        Choose Your Resume Template
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        All templates are ATS-friendly and optimized for applicant tracking systems. Choose the one that best fits your industry and career level.
      </Typography>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: selectedTemplate?.id === template.id ? template.color : 'divider',
                  backgroundColor: selectedTemplate?.id === template.id ? `${template.color}10` : 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: template.color,
                    boxShadow: `0 8px 25px ${template.color}20`,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                {selectedTemplate?.id === template.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2
                    }}
                  >
                    <CheckCircle sx={{ color: template.color, fontSize: 28 }} />
                  </Box>
                )}

                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        backgroundColor: `${template.color}15`,
                        color: template.color,
                        mr: 2
                      }}
                    >
                      {template.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {template.name}
                      </Typography>
                      <Chip
                        label={template.category}
                        size="small"
                        sx={{
                          backgroundColor: `${template.color}15`,
                          color: template.color,
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {template.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                        ATS Score:
                      </Typography>
                      <Typography variant="body2" sx={{ color: template.color, fontWeight: 700 }}>
                        {template.atsScore}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSelect(template)}
                      sx={{
                        flex: 1,
                        backgroundColor: template.color,
                        '&:hover': {
                          backgroundColor: template.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {previewTemplate?.name} Preview
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
              Template preview will be rendered here with your actual resume data
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPreviewOpen(false)}>
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