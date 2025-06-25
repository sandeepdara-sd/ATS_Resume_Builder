import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';

function AchievementsForm({ data, onChange }) {
  const [achievementsList, setAchievementsList] = useState(data.length > 0 ? data : [
    {
      title: '',
      description: '',
      date: '',
      organization: '',
      link: ''
    }
  ]);

  useEffect(() => {
    onChange(achievementsList);
  }, [achievementsList, onChange]);

  const addAchievement = () => {
    setAchievementsList([
      ...achievementsList,
      {
        title: '',
        description: '',
        date: '',
        organization: '',
        link: ''
      }
    ]);
  };

  const removeAchievement = (index) => {
    if (achievementsList.length > 1) {
      setAchievementsList(achievementsList.filter((_, i) => i !== index));
    }
  };

  const updateAchievement = (index, field, value) => {
    const updated = achievementsList.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setAchievementsList(updated);
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Add your achievements, awards, certifications, or any notable recognition you've received.
      </Typography>

      {achievementsList.map((achievement, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Achievement/Certification {index + 1}
              </Typography>
              {achievementsList.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeAchievement(index)}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Achievement Title"
                  value={achievement.title}
                  onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                  placeholder="Dean's List, Employee of the Month, Certification Name"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="month"
                  value={achievement.date}
                  onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization / Institution"
                  value={achievement.organization}
                  onChange={(e) => updateAchievement(index, 'organization', e.target.value)}
                  placeholder="University, Company, Certification Body"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link (optional)"
                  value={achievement.link}
                  onChange={(e) => updateAchievement(index, 'link', e.target.value)}
                  placeholder="https://certificate.com/example"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={achievement.description}
                  onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                  placeholder="Brief description of the achievement and its significance..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addAchievement}
        sx={{ mt: 2 }}
      >
        Add Another Achievement
      </Button>
    </Box>
  );
}

export default AchievementsForm;
