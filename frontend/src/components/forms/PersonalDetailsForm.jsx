import {
  Grid,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';

function PersonalDetailsForm({ data, onChange }) {
  const [formData, setFormData] = useState(data || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });

  // Update formData only when new data is passed
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Notify parent only when formData has actual content
  useEffect(() => {
    const hasData = Object.values(formData).some((val) => val !== '');
    if (hasData) {
      onChange(formData);
    }
  }, [formData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
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
