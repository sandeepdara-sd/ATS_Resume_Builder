import {
  Grid,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';

function PersonalDetailsForm({ data, onChange }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });

  // Initialize formData only once when component mounts or when data prop changes significantly
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(prev => ({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        website: data.website || ''
      }));
    }
  }, []); // Remove data dependency to prevent unnecessary updates

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    const updatedFormData = {
      ...formData,
      [field]: newValue
    };
    
    setFormData(updatedFormData);
    
    // Call onChange immediately with the updated data
    onChange(updatedFormData);
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Let's start with your basic information.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName || ''}
            onChange={handleChange('fullName')}
            placeholder="John Doe"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            value={formData.email || ''}
            onChange={handleChange('email')}
            placeholder="john.doe@email.com"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone || ''}
            onChange={handleChange('phone')}
            placeholder="+91 9876543210"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location || ''}
            onChange={handleChange('location')}
            placeholder="City, State"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={formData.linkedin || ''}
            onChange={handleChange('linkedin')}
            placeholder="https://linkedin.com/in/..."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="GitHub"
            value={formData.github || ''}
            onChange={handleChange('github')}
            placeholder="https://github.com/..."
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Portfolio"
            value={formData.website || ''}
            onChange={handleChange('website')}
            placeholder="https://yourportfolio.com"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PersonalDetailsForm;
