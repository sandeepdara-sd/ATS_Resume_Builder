//ResumePreview.jsx

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { ArrowBack, Save, Download, Edit, Palette } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { templateComponents, TemplateSelector } from './templates';

function ResumePreview({ 
  resumeData, 
  onBack, 
  onSave, 
  onDownload, 
  saving, 
  downloading,
  selectedTemplate,
  onTemplateChange 
}) {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Get the template component
  const TemplateComponent = selectedTemplate 
    ? templateComponents[selectedTemplate.id] 
    : templateComponents['modern-professional'];

  const handleTemplateSelect = (template) => {
    onTemplateChange(template);
    setTemplateDialogOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Resume Preview
          </Typography>
          
          {/* Template Info */}
          {selectedTemplate && (
            <Chip
              icon={selectedTemplate.icon}
              label={selectedTemplate.name}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                mr: 2
              }}
            />
          )}
          
          <Button
            color="inherit"
            startIcon={<Palette />}
            onClick={() => setTemplateDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            Change Template
          </Button>
          <Button
            color="inherit"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={onSave}
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            color="inherit"
            startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
            onClick={onDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper 
            sx={{ 
              minHeight: '297mm',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            {/* Render the selected template */}
            {TemplateComponent && <TemplateComponent resumeData={resumeData} />}
          </Paper>
        </motion.div>
      </Container>

      {/* Template Selection Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Choose Resume Template
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            resumeData={resumeData}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTemplateDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResumePreview;