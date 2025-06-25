import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState, useEffect } from 'react';

function HobbiesForm({ data, onChange }) {
  const [hobbies, setHobbies] = useState(data || []);
  const [newHobby, setNewHobby] = useState('');

  useEffect(() => {
    onChange(hobbies);
  }, [hobbies, onChange]);

  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (hobbyToRemove) => {
    setHobbies(hobbies.filter(hobby => hobby !== hobbyToRemove));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addHobby();
    }
  };

  const suggestedHobbies = [
    'Reading', 'Photography', 'Traveling', 'Cooking', 'Gaming',
    'Music', 'Sports', 'Fitness', 'Volunteering', 'Blogging',
    'Painting', 'Dancing', 'Hiking', 'Cycling', 'Swimming'
  ];

  const addSuggestedHobby = (hobby) => {
    if (!hobbies.includes(hobby)) {
      setHobbies([...hobbies, hobby]);
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Add your hobbies and interests. This section helps show your personality and can be a great conversation starter during interviews.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Add a Hobby"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Photography, Reading, Traveling"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addHobby}
            disabled={!newHobby.trim()}
            sx={{ 
              height: '56px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add Hobby
          </Button>
        </Grid>
      </Grid>

      {hobbies.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Your Hobbies ({hobbies.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {hobbies.map((hobby, index) => (
              <Chip
                key={index}
                label={hobby}
                onDelete={() => removeHobby(hobby)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Suggested Hobbies
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {suggestedHobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              onClick={() => addSuggestedHobby(hobby)}
              variant="outlined"
              sx={{
                cursor: 'pointer',
                opacity: hobbies.includes(hobby) ? 0.5 : 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              disabled={hobbies.includes(hobby)}
            />
          ))}
        </Box>
      </Box>

      <Alert severity="info">
        <Typography variant="body2">
          <strong>Tip:</strong> Choose hobbies that are relevant to your field or demonstrate valuable qualities like creativity, leadership, or teamwork.
        </Typography>
      </Alert>
    </Box>
  );
}

export default HobbiesForm;