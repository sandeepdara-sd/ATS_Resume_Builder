import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f093fb',
      light: '#fbbf24',
      dark: '#ec4899',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '2.8rem', // Reduced from 3.5rem (3.5 * 0.8 ≈ 2.8)
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',   // Reduced from 2.5rem (2.5 * 0.8 = 2)
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.6rem', // Reduced from 2rem (2 * 0.8 = 1.6)
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: '1.2rem', // Reduced from 1.5rem (1.5 * 0.8 = 1.2)
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',    // Reduced from 1.25rem (1.25 * 0.8 = 1)
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem', // Reduced from 1rem (1 * 0.8 = 0.8, rounded to 0.875)
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem', // Reduced from 1rem (1 * 0.8 = 0.8, rounded to 0.875)
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.75rem',  // Reduced from 0.875rem (0.875 * 0.8 ≈ 0.7, rounded to 0.75)
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 10, // Reduced from 12 (12 * 0.8 ≈ 10)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 10,      // Reduced from 12
          padding: '10px 20px',  // Reduced from 12px 24px
          fontSize: '0.875rem',  // Reduced from 1rem
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 3px 10px rgba(0,0,0,0.15)', // Slightly reduced shadow
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,  // Reduced from 16 (16 * 0.8 ≈ 13, rounded to 12)
          boxShadow: '0 3px 5px -1px rgba(0, 0, 0, 0.1), 0 2px 3px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10, // Reduced from 12
          },
        },
      },
    },
  },
});

export default theme;