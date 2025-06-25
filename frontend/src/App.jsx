import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UploadResume from './pages/UploadResume';
import CreateResume from './pages/CreateResume';
import ResumeBuilder from './pages/ResumeBuilder';
import ScoreResume from './pages/ScoreResume';
import FeedbackWidget from './components/FeedbackWidget';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import theme from './theme';

function App() {
  const { user, loading } = useAuth();

  // console.log('App render - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner message="Loading application..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignupPage />
            } 
          />
          {/* <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              user ? <Profile /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/upload-resume" 
            element={
              user ? <UploadResume /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/create-resume" 
            element={
              user ? <CreateResume /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/resume-builder/:type" 
            element={
              user ? <ResumeBuilder /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/score-resume" 
            element={
              user ? <ScoreResume /> : <Navigate to="/login" replace />
            } 
          /> */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/upload-resume" 
            element={user ? <UploadResume /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/create-resume" 
            element={user ? <CreateResume /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/resume-builder/:type" 
            element={user ? <ResumeBuilder /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/score-resume" 
            element={user ? <ScoreResume /> : <Navigate to="/" replace />} 
          />

          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />}
          />
        </Routes>
        
        {/* Global Feedback Widget - only show when user is logged in */}
        {user && <FeedbackWidget />}
      </Router>
    </ThemeProvider>
  );
}

export default App;