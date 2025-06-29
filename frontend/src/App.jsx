import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UploadResume from './pages/UploadResume';
import CreateResume from './pages/CreateResume';
import ResumeBuilder from './pages/ResumeBuilder';
import ScoreResume from './pages/ScoreResume';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackWidget from './components/FeedbackWidget';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import theme from './theme';

function App() {
  const { user, loading } = useAuth();

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
          {/* Public Routes */}
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
          <Route 
            path="/forgot-password" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <ResetPassword />
            } 
          />

          {/* Protected User Routes */}
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

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