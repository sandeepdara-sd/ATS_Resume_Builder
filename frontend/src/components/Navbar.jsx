import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  Logout,
  Settings,
  Person,
  Description,
  CloudUpload,
  TrendingUp,
  Rocket
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    handleClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Rocket sx={{ mr: 1, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              fontFamily: 'Poppins'
            }}
          >
            ATS Resume Builder
          </Typography>
        </motion.div>
        
        <Chip 
          label="AI Powered" 
          size="small" 
          sx={{ 
            ml: 2, 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem'
          }} 
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
            sx={{
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/upload-resume')}
            sx={{
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              backgroundColor: isActive('/upload-resume') ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Upload
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Description />}
            onClick={() => navigate('/create-resume')}
            sx={{
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              backgroundColor: isActive('/create-resume') ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Create
          </Button>
          
          
        </Box>

        {/* User Menu */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
            sx={{
              p: 0.5,
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: 5,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.4)',
              }
            }}
          >
           <Avatar
            src={user?.photoURL || ''}
            alt={user?.displayName || 'User'}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: 'rgba(255,255,255,0.2)'
            }}
          >
            {user?.displayName?.[0]|| user?.email?.charAt(0) || 'U'}
          </Avatar>

          </IconButton>
        </motion.div>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 3,
              minWidth: 220,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid rgba(0,0,0,0.05)',
              mt: 1
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {user?.email}
            </Typography>
          </Box>
          
          <MenuItem 
            onClick={() => handleNavigation('/dashboard')}
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemIcon>
              <Dashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MenuItem>
          
          <MenuItem 
            onClick={() => handleNavigation('/profile')}
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          
         
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              py: 1.5, 
              px: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;