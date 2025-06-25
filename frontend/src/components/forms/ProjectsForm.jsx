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

function ProjectsForm({ data, type, onChange }) {
  const [projectsList, setProjectsList] = useState(data.length > 0 ? data : [
    {
      name: '',
      description: '',
      technologies: '',
      link: '',
      duration: ''
    }
  ]);

  useEffect(() => {
    onChange(projectsList);
  }, [projectsList, onChange]);

  const addProject = () => {
    setProjectsList([
      ...projectsList,
      {
        name: '',
        description: '',
        technologies: '',
        link: '',
        duration: ''
      }
    ]);
  };

  const removeProject = (index) => {
    if (projectsList.length > 1) {
      setProjectsList(projectsList.filter((_, i) => i !== index));
    }
  };

  const updateProject = (index, field, value) => {
    const updated = projectsList.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setProjectsList(updated);
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {type === 'fresher' 
          ? 'Showcase your academic projects, personal projects, or any work that demonstrates your skills and creativity.'
          : 'Highlight key projects that demonstrate your technical skills and business impact. Focus on recent and relevant projects.'
        }
      </Typography>

      {projectsList.map((project, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Project {index + 1}
              </Typography>
              {projectsList.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeProject(index)}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="E-commerce Web Application"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={project.duration}
                  onChange={(e) => updateProject(index, 'duration', e.target.value)}
                  placeholder="3 months"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Project Description"
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder="Describe what the project does, your role, key features, and any achievements or metrics..."
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Technologies Used"
                  value={project.technologies}
                  onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB, Express.js"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Project Link"
                  value={project.link}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addProject}
        sx={{ mt: 2 }}
      >
        Add Another Project
      </Button>
    </Box>
  );
}

export default ProjectsForm;