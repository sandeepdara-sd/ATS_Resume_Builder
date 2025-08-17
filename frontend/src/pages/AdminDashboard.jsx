import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TablePagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  Description,
  Feedback,
  Delete,
  Visibility,
  Search,
  FilterList,
  Download,
  AdminPanelSettings,
  Logout,
  Settings,
  Analytics,
  TrendingUp,
  Person,
  Assignment,
  Star,
  Warning,
  CheckCircle,
  Cancel,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Work,
  School,
  BarChart,
  PieChart,
  ShowChart,
  Timeline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';
import axios from 'axios';
import { api_url } from '../helper/Helper';

function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [chartData, setChartData] = useState({
    userGrowth: [],
    resumeStats: [],
    feedbackDistribution: [],
    scoreDistribution: []
  });
  
  const navigate = useNavigate();
  const theme = useTheme();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }

    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    
    // Load initial data
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDashboardStats(),
        loadUsers(),
        loadResumes(),
        loadFeedback()
      ]);
      generateChartData();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      setSnackbar({
        open: true,
        message: 'Failed to load dashboard data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get(`${api_url}/api/admin/dashboard/stats`);
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Set empty stats to prevent errors
      setDashboardStats({
        stats: {
          totalUsers: 0,
          totalResumes: 0,
          totalFeedback: 0,
          activeUsers: 0,
          userGrowthRate: 0
        },
        recentActivity: {
          users: []
        }
      });
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${api_url}/api/admin/users`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          sortBy,
          sortOrder
        }
      });
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    }
  };

  const loadResumes = async () => {
    try {
      const response = await axios.get(`${api_url}/api/admin/resumes`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          sortBy,
          sortOrder
        }
      });
      setResumes(Array.isArray(response.data.resumes) ? response.data.resumes : []);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      setResumes([]);
    }
  };

  const loadFeedback = async () => {
    try {
      const response = await axios.get(`${api_url}/api/admin/feedback`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          type: filterType === 'all' ? '' : filterType,
          sortBy,
          sortOrder
        }
      });
      setFeedback(Array.isArray(response.data.feedback) ? response.data.feedback : []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setFeedback([]);
    }
  };

  const generateChartData = () => {
    try {
      // Generate user growth data (last 7 days)
      const userGrowthData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Calculate users created on this day
        const usersOnDay = users.filter(user => {
          if (!user.createdAt) return false;
          const userDate = new Date(user.createdAt);
          return userDate.toDateString() === date.toDateString();
        }).length;
        
        userGrowthData.push({
          date: dateStr,
          users: usersOnDay,
          cumulative: users.filter(user => {
            if (!user.createdAt) return false;
            return new Date(user.createdAt) <= date;
          }).length
        });
      }

      // Resume statistics
      const resumeStatsData = [
        { name: 'Total Resumes', value: resumes.length, color: '#667eea' },
        { name: 'High Score (90+)', value: resumes.filter(r => r.score >= 90).length, color: '#10b981' },
        { name: 'Good Score (70-89)', value: resumes.filter(r => r.score >= 70 && r.score < 90).length, color: '#f59e0b' },
        { name: 'Needs Improvement (<70)', value: resumes.filter(r => r.score < 70).length, color: '#ef4444' }
      ];

      // Feedback distribution
      const feedbackTypes = ['general', 'bug', 'feature', 'help'];
      const feedbackDistData = feedbackTypes.map(type => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: feedback.filter(f => f.type === type).length,
        color: type === 'general' ? '#667eea' : 
               type === 'bug' ? '#ef4444' :
               type === 'feature' ? '#f59e0b' : '#10b981'
      }));

      // Score distribution
      const scoreRanges = [
        { range: '90-100', min: 90, max: 100, color: '#10b981' },
        { range: '80-89', min: 80, max: 89, color: '#3b82f6' },
        { range: '70-79', min: 70, max: 79, color: '#f59e0b' },
        { range: '60-69', min: 60, max: 69, color: '#ef4444' },
        { range: '0-59', min: 0, max: 59, color: '#6b7280' }
      ];

      const scoreDistData = scoreRanges.map(range => ({
        range: range.range,
        count: resumes.filter(r => {
          const score = r.score || 0;
          return score >= range.min && score <= range.max;
        }).length,
        color: range.color
      }));

      setChartData({
        userGrowth: userGrowthData,
        resumeStats: resumeStatsData,
        feedbackDistribution: feedbackDistData,
        scoreDistribution: scoreDistData
      });
    } catch (error) {
      console.error('Error generating chart data:', error);
      // Set empty chart data on error
      setChartData({
        userGrowth: [],
        resumeStats: [],
        feedbackDistribution: [],
        scoreDistribution: []
      });
    }
  };

  const handleUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${api_url}/api/admin/users/${userId}`);
      setSelectedUser(response.data);
      setUserDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load user details',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'user') {
        await axios.delete(`${api_url}/api/admin/users/${deleteTarget.id}`);
        setUsers(users.filter(user => user._id !== deleteTarget.id));
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
      } else if (deleteTarget.type === 'resume') {
        await axios.delete(`${api_url}/api/admin/resumes/${deleteTarget.id}`);
        setResumes(resumes.filter(resume => resume._id !== deleteTarget.id));
        setSnackbar({
          open: true,
          message: 'Resume deleted successfully',
          severity: 'success'
        });
      } else if (deleteTarget.type === 'feedback') {
        await axios.delete(`${api_url}/api/admin/feedback/${deleteTarget.id}`);
        setFeedback(feedback.filter(fb => fb._id !== deleteTarget.id));
        setSnackbar({
          open: true,
          message: 'Feedback deleted successfully',
          severity: 'success'
        });
      }
      
      // Reload stats and regenerate charts
      await loadDashboardStats();
      generateChartData();
    } catch (error) {
      console.error('Failed to delete:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete item',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleFeedbackStatusUpdate = async (feedbackId, resolved) => {
    try {
      await axios.patch(`${api_url}/api/admin/feedback/${feedbackId}`, { resolved });
      setFeedback(feedback.map(fb => 
        fb._id === feedbackId ? { ...fb, resolved } : fb
      ));
      setSnackbar({
        open: true,
        message: `Feedback marked as ${resolved ? 'resolved' : 'unresolved'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update feedback status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update feedback status',
        severity: 'error'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reload data when filters change
  useEffect(() => {
    if (!loading) {
      if (currentTab === 1) loadUsers();
      else if (currentTab === 2) loadResumes();
      else if (currentTab === 3) loadFeedback();
    }
  }, [searchTerm, filterType, page, rowsPerPage, sortBy, sortOrder, currentTab]);

  // Regenerate chart data when data changes
  useEffect(() => {
    if (users.length > 0 || resumes.length > 0 || feedback.length > 0) {
      generateChartData();
    }
  }, [users, resumes, feedback]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const adminData = (() => {
    try {
      return JSON.parse(localStorage.getItem('adminData') || '{}');
    } catch (error) {
      return {};
    }
  })();

  if (loading && !dashboardStats) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <Toolbar>
            <AdminPanelSettings sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Enhanced Admin Navigation */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                ATS Resume Builder Management
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Chip
            label={adminData.role || 'Admin'}
            size="small"
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontWeight: 600,
              mr: 2,
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          />
          
          <Button
            color="inherit"
            onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
            startIcon={
              <Avatar sx={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                {(adminData.name && adminData.name[0]) || 'A'}
              </Avatar>
            }
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {adminData.name || 'Admin'}
          </Button>
          
          <Menu
            anchorEl={adminMenuAnchor}
            open={Boolean(adminMenuAnchor)}
            onClose={() => setAdminMenuAnchor(null)}
            PaperProps={{
              sx: { borderRadius: 2, mt: 1 }
            }}
          >
            <MenuItem onClick={() => setAdminMenuAnchor(null)}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 2, 
                fontWeight: 800, 
                color: '#1e293b',
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Analytics Overview
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Real-time insights into platform performance and user engagement
            </Typography>
          </Box>
          
          {/* Enhanced Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {dashboardStats?.stats?.totalUsers || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          Total Users
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          +{dashboardStats?.stats?.userGrowthRate || 0}% this month
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <People sx={{ fontSize: 32, opacity: 0.9 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {dashboardStats?.stats?.totalResumes || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          Total Resumes
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {resumes.filter(r => (r.score || 0) >= 80).length} high-scoring
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Description sx={{ fontSize: 32, opacity: 0.9 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {dashboardStats?.stats?.totalFeedback || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          Total Feedback
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {feedback.filter(f => !f.resolved).length} pending
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Feedback sx={{ fontSize: 32, opacity: 0.9 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'rgba(255,255,255,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                          {dashboardStats?.stats?.activeUsers || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          Active Users
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Last 30 days
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 32, opacity: 0.9 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Enhanced Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 72,
                py: 2
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          >
            <Tab 
              icon={<Analytics sx={{ fontSize: 24 }} />} 
              label="Analytics" 
              iconPosition="start"
              sx={{ minWidth: 140 }}
            />
            <Tab 
              icon={<People sx={{ fontSize: 24 }} />} 
              label="Users" 
              iconPosition="start"
              sx={{ minWidth: 140 }}
            />
            <Tab 
              icon={<Description sx={{ fontSize: 24 }} />} 
              label="Resumes" 
              iconPosition="start"
              sx={{ minWidth: 140 }}
            />
            <Tab 
              icon={<Feedback sx={{ fontSize: 24 }} />} 
              label="Feedback" 
              iconPosition="start"
              sx={{ minWidth: 140 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Analytics Tab */}
          {currentTab === 0 && (
            <Grid container spacing={4}>
              {/* User Growth Chart */}
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 4, borderRadius: 3, height: 400 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <ShowChart sx={{ mr: 2, color: 'primary.main' }} />
                    User Growth Trend (Last 7 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.userGrowth}>
                      <defs>
                        <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#667eea"
                        strokeWidth={3}
                        fill="url(#userGradient)"
                        name="Total Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Resume Score Distribution */}
              <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 4, borderRadius: 3, height: 400 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <PieChart sx={{ mr: 2, color: 'success.main' }} />
                    Resume Score Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.scoreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {chartData.scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Feedback Distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 3, height: 350 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <BarChart sx={{ mr: 2, color: 'warning.main' }} />
                    Feedback Categories
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsBarChart data={chartData.feedbackDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                        fill="#f59e0b"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 3, height: 350 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Timeline sx={{ mr: 2, color: 'info.main' }} />
                    Recent Activity
                  </Typography>
                  <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                    {dashboardStats?.recentActivity?.users?.slice(0, 5).map((user, index) => (
                      <Box key={user._id || index} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, borderRadius: 2, backgroundColor: 'grey.50' }}>
                        <Avatar
                          src={user.photoURL}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          {(user.displayName && user.displayName[0]) || (user.email && user.email[0]) || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.displayName || 'New User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Joined {formatDate(user.createdAt)}
                          </Typography>
                        </Box>
                        <Chip size="small" label="New" color="success" />
                      </Box>
                    )) || (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No recent activity
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Performance Metrics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Analytics sx={{ mr: 2, color: 'primary.main' }} />
                    Platform Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {resumes.length > 0 ? Math.round(resumes.reduce((sum, r) => sum + (r.score || 0), 0) / resumes.length) : 0}%
                        </Typography>
                        <Typography variant="body2">Average ATS Score</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1) : 0}
                        </Typography>
                        <Typography variant="body2">Average Rating</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {users.length > 0 ? (resumes.length / users.length).toFixed(1) : 0}
                        </Typography>
                        <Typography variant="body2">Resumes per User</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, backgroundColor: 'info.light', color: 'info.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {Math.round((feedback.filter(f => f.resolved).length / Math.max(feedback.length, 1)) * 100)}%
                        </Typography>
                        <Typography variant="body2">Resolution Rate</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Users Tab */}
          {currentTab === 1 && (
            <>
              {/* Search and Filter Controls */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => {
                        setSearchTerm('');
                        setPage(0);
                      }}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.75 }}
                    >
                      Clear Search
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'grey.50' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Resumes</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Joined</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={user.photoURL}
                                sx={{ mr: 2, width: 40, height: 40 }}
                              >
                                {(user.displayName && user.displayName[0]) || (user.email && user.email[0]) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {user.displayName || 'No Name'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {user._id && user._id.slice(-6)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.resumeCount || 0} 
                              color="primary" 
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleUserDetails(user._id)}
                                sx={{ 
                                  backgroundColor: 'info.light',
                                  color: 'info.main',
                                  '&:hover': { backgroundColor: 'info.main', color: 'white' }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDeleteTarget({ type: 'user', id: user._id, name: user.displayName || user.email });
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{ 
                                  backgroundColor: 'error.light',
                                  color: 'error.main',
                                  '&:hover': { backgroundColor: 'error.main', color: 'white' }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={dashboardStats?.stats?.totalUsers || 0}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
              </Paper>
            </>
          )}

          {/* Resumes Tab */}
          {currentTab === 2 && (
            <>
              {/* Search Controls */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      placeholder="Search resumes by name or email..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => {
                        setSearchTerm('');
                        setPage(0);
                      }}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.75 }}
                    >
                      Clear Search
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'grey.50' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Resume</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Owner</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>ATS Score</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Template</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resumes.map((resume) => (
                        <TableRow key={resume._id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {resume.personalDetails?.fullName || resume.title || 'Untitled Resume'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {resume.personalDetails?.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={resume.userId?.photoURL}
                                sx={{ mr: 1, width: 32, height: 32 }}
                              >
                                {(resume.userId?.displayName && resume.userId.displayName[0]) || 
                                 (resume.userId?.email && resume.userId.email[0]) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {resume.userId?.displayName || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {resume.userId?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={resume.score ? `${resume.score}%` : 'Not Scored'}
                              color={getScoreColor(resume.score)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={resume.selectedTemplate?.name || 'Modern Professional'}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(resume.createdAt)}</Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeleteTarget({ 
                                  type: 'resume', 
                                  id: resume._id, 
                                  name: resume.personalDetails?.fullName || resume.title || 'Untitled Resume'
                                });
                                setDeleteDialogOpen(true);
                              }}
                              sx={{ 
                                backgroundColor: 'error.light',
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'error.main', color: 'white' }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={dashboardStats?.stats?.totalResumes || 0}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
              </Paper>
            </>
          )}

          {/* Feedback Tab */}
          {currentTab === 3 && (
            <>
              {/* Search and Filter Controls */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Type</InputLabel>
                      <Select
                        value={filterType}
                        onChange={handleFilterChange}
                        label="Filter by Type"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="general">General</MenuItem>
                        <MenuItem value="bug">Bug Report</MenuItem>
                        <MenuItem value="feature">Feature Request</MenuItem>
                        <MenuItem value="help">Help</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                        setPage(0);
                      }}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.75 }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'grey.50' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Rating</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Message</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feedback.map((fb) => (
                        <TableRow key={fb._id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={fb.user?.photoURL}
                                sx={{ mr: 1, width: 32, height: 32 }}
                              >
                                {(fb.user?.displayName && fb.user.displayName[0]) || 
                                 (fb.user?.email && fb.user.email[0]) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {fb.user?.displayName || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {fb.user?.email || fb.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={fb.type}
                              color={
                                fb.type === 'bug' ? 'error' :
                                fb.type === 'feature' ? 'warning' :
                                fb.type === 'help' ? 'info' : 'default'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star sx={{ color: '#ffc107', mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {fb.rating || 0}/5
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 200, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {fb.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={fb.resolved ? 'Resolved' : 'Open'}
                              color={fb.resolved ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(fb.createdAt)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleFeedbackStatusUpdate(fb._id, !fb.resolved)}
                                sx={{ 
                                  backgroundColor: fb.resolved ? 'warning.light' : 'success.light',
                                  color: fb.resolved ? 'warning.main' : 'success.main',
                                  '&:hover': { 
                                    backgroundColor: fb.resolved ? 'warning.main' : 'success.main', 
                                    color: 'white' 
                                  }
                                }}
                              >
                                {fb.resolved ? <Cancel fontSize="small" /> : <CheckCircle fontSize="small" />}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDeleteTarget({ 
                                    type: 'feedback', 
                                    id: fb._id, 
                                    name: `${fb.type} feedback from ${fb.user?.email || fb.email}` 
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{ 
                                  backgroundColor: 'error.light',
                                  color: 'error.main',
                                  '&:hover': { backgroundColor: 'error.main', color: 'white' }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={dashboardStats?.stats?.totalFeedback || 0}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
              </Paper>
            </>
          )}
        </motion.div>
      </Container>

      {/* Enhanced User Details Dialog */}
      <Dialog
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Details & Analytics
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedUser && (
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={selectedUser.user?.photoURL}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    >
                      {(selectedUser.user?.displayName && selectedUser.user.displayName[0]) || 
                       (selectedUser.user?.email && selectedUser.user.email[0]) || 'U'}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {selectedUser.user?.displayName || 'No Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedUser.user?.email}
                    </Typography>
                    <Chip 
                      label="Active User" 
                      color="success" 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Account Statistics
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {selectedUser.stats?.totalResumes || 0}
                        </Typography>
                        <Typography variant="body2">Total Resumes</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'success.light', color: 'success.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {selectedUser.stats?.avgResumeScore || 0}%
                        </Typography>
                        <Typography variant="body2">Avg Score</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                      Joined: {formatDate(selectedUser.user?.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Assignment sx={{ fontSize: 16, mr: 1 }} />
                      Total Feedback: {selectedUser.stats?.totalFeedback || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {selectedUser.resumes && selectedUser.resumes.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Recent Resumes
                  </Typography>
                  {selectedUser.resumes.slice(0, 3).map((resume) => (
                    <Card key={resume._id} sx={{ mb: 2, borderRadius: 2 }}>
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {resume.personalDetails?.fullName || resume.title || 'Untitled'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Created: {formatDate(resume.createdAt)}
                            </Typography>
                          </Box>
                          <Chip
                            label={resume.score ? `${resume.score}%` : 'Not Scored'}
                            color={getScoreColor(resume.score)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUserDetailsOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
          <Warning sx={{ color: 'error.main', mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirm Deletion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are about to permanently delete "{deleteTarget?.name}". All associated data will be lost.
          </Alert>
          <Typography variant="body1">
            Are you sure you want to proceed with this deletion?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            sx={{ 
              minWidth: 100,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            borderRadius: 2,
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
