import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';

function EducationForm({ data, onChange }) {
  const [educationList, setEducationList] = useState(data.length > 0 ? data : [
    {
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ''
    }
  ]);

  useEffect(() => {
    onChange(educationList);
  }, [educationList, onChange]);

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: ''
      }
    ]);
  };

  const removeEducation = (index) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (index, field, value) => {
    const updated = educationList.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setEducationList(updated);
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Add your educational background. Start with your most recent degree first.
      </Typography>

      {educationList.map((education, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Education {index + 1}
              </Typography>
              {educationList.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeEducation(index)}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={education.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University of Technology"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={education.location}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  placeholder="New York, NY"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GPA / Grade"
                  value={education.gpa}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="3.8/4.0 or First Class"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Achievements / Coursework"
                  value={education.achievements}
                  onChange={(e) => updateEducation(index, 'achievements', e.target.value)}
                  placeholder="Dean's List, Relevant coursework, Academic honors, etc."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addEducation}
        sx={{ mt: 2 }}
      >
        Add Another Education
      </Button>
    </Box>
  );
}

export default EducationForm;