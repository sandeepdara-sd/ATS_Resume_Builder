import React from 'react';
import { Box, CircularProgress, Typography, Fade, Zoom } from '@mui/material';
import { keyframes } from '@mui/system';

// Custom animations
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 0.7;
  }
`;

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.4;
  }
`;

const textPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const ripple = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.4);
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, #64b5f6 0%, #42a5f5 100%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: `${pulse} 4s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '33%',
            right: '25%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, #ba68c8 0%, #ab47bc 100%)',
            borderRadius: '50%',
            filter: 'blur(35px)',
            animation: `${pulse} 5s ease-in-out infinite 1s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            left: '33%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, #f48fb1 0%, #f06292 100%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: `${pulse} 6s ease-in-out infinite 2s`,
          }}
        />
      </Box>

      {/* Floating particles */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              bgcolor: 'white',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `${float} ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}
      </Box>

      {/* Glass morphism backdrop */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Main content */}
      <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Ripple effect behind spinner */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120px',
              height: '120px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              animation: `${ripple} 3s linear infinite`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120px',
              height: '120px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              animation: `${ripple} 3s linear infinite 1s`,
            }}
          />
          
          {/* Main spinner */}
          <Zoom in timeout={800}>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress
                size={80}
                thickness={6}
                sx={{
                  '& .MuiCircularProgress-circle': {
                    stroke: 'url(#progressGradient)',
                    strokeLinecap: 'round',
                  },
                }}
              />
              
              {/* SVG gradient definition */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64b5f6" />
                    <stop offset="50%" stopColor="#ba68c8" />
                    <stop offset="100%" stopColor="#f48fb1" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center pulsing dot */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                  animation: `${pulse} 2s ease-in-out infinite`,
                }}
              />
            </Box>
          </Zoom>
        </Box>

        {/* Animated text */}
        <Fade in timeout={1200}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: 2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                animation: `${textPulse} 3s ease-in-out infinite`,
              }}
            >
              {message}
            </Typography>
            
            {/* Bouncing dots */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: '8px',
                    height: '8px',
                    bgcolor: 'white',
                    borderRadius: '50%',
                    animation: `${bounce} 1.4s ease-in-out infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Progress bar */}
        <Fade in timeout={1600}>
          <Box sx={{ mt: 4, width: '280px' }}>
            <Box
              sx={{
                height: '4px',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, #64b5f6, #ba68c8, #f48fb1)',
                  borderRadius: '2px',
                  animation: `${shimmer} 2s ease-in-out infinite`,
                }}
              />
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default LoadingSpinner;