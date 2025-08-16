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
  Skeleton
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
  School
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  
  const navigate = useNavigate();

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
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
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
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
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
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Failed to load resumes:', error);
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
      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
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
      
      // Reload stats
      loadDashboardStats();
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
    setPage(0); // Reset pagination when changing tabs
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
    if (currentTab === 0) loadUsers();
    else if (currentTab === 1) loadResumes();
    else if (currentTab === 2) loadFeedback();
  }, [searchTerm, filterType, page, rowsPerPage, sortBy, sortOrder, currentTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Admin Navigation */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <Toolbar>
          <AdminPanelSettings sx={{ mr: 2, fontSize: 32, color: '#64b5f6' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            Admin Dashboard
          </Typography>
          
          <Chip
            label={adminData.role || 'Admin'}
            size="small"
            sx={{
              backgroundColor: 'rgba(100, 181, 246, 0.2)',
              color: '#64b5f6',
              fontWeight: 600,
              mr: 2
            }}
          />
          
          <Button
            color="inherit"
            onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
            startIcon={
              <Avatar sx={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                {adminData.name?.[0] || 'A'}
              </Avatar>
            }
            sx={{ color: 'white', fontWeight: 600 }}
          >
            {adminData.name || 'Admin'}
          </Button>
          
          <Menu
            anchorEl={adminMenuAnchor}
            open={Boolean(adminMenuAnchor)}
            onClose={() => setAdminMenuAnchor(null)}
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
        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}>
            Dashboard Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {dashboardStats?.stats?.totalUsers || 0}
                      </Typography>
                      <Typography variant="body1">Total Users</Typography>
                    </Box>
                    <People sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {dashboardStats?.stats?.totalResumes || 0}
                      </Typography>
                      <Typography variant="body1">Total Resumes</Typography>
                    </Box>
                    <Description sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {dashboardStats?.stats?.totalFeedback || 0}
                      </Typography>
                      <Typography variant="body1">Total Feedback</Typography>
                    </Box>
                    <Feedback sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {dashboardStats?.stats?.activeUsers || 0}
                      </Typography>
                      <Typography variant="body1">Active Users</Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none'
              }
            }}
          >
            <Tab icon={<People />} label="Users" />
            <Tab icon={<Description />} label="Resumes" />
            <Tab icon={<Feedback />} label="Feedback" />
          </Tabs>
        </Paper>

        {/* Search and Filter Controls */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {currentTab === 2 && (
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={handleFilterChange}
                    label="Filter by Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="bug">Bug Report</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="help">Help</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            
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
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tab Content */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Users Tab */}
          {currentTab === 0 && (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Resumes</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={user.photoURL}
                              sx={{ mr: 2, width: 40, height: 40 }}
                            >
                              {user.displayName?.[0] || user.email?.[0] || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user.displayName || 'No Name'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user._id.slice(-6)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.resumeCount || 0} 
                            color="primary" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleUserDetails(user._id)}
                            sx={{ mr: 1 }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeleteTarget({ type: 'user', id: user._id, name: user.displayName || user.email });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
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
              />
            </Paper>
          )}

          {/* Resumes Tab */}
          {currentTab === 1 && (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Resume</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>ATS Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resumes.map((resume) => (
                      <TableRow key={resume._id} hover>
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
                              {resume.userId?.displayName?.[0] || resume.userId?.email?.[0] || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
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
                          />
                        </TableCell>
                        <TableCell>{formatDate(resume.createdAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeleteTarget({ 
                                type: 'resume', 
                                id: resume._id, 
                                name: resume.personalDetails?.fullName || resume.title 
                              });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
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
              />
            </Paper>
          )}

          {/* Feedback Tab */}
          {currentTab === 2 && (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedback.map((fb) => (
                      <TableRow key={fb._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={fb.user?.photoURL}
                              sx={{ mr: 1, width: 32, height: 32 }}
                            >
                              {fb.user?.displayName?.[0] || fb.user?.email?.[0] || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
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
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: '#ffc107', mr: 0.5, fontSize: 16 }} />
                            <Typography variant="body2">{fb.rating}/5</Typography>
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
                          />
                        </TableCell>
                        <TableCell>{formatDate(fb.createdAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleFeedbackStatusUpdate(fb._id, !fb.resolved)}
                            color={fb.resolved ? 'warning' : 'success'}
                            sx={{ mr: 1 }}
                          >
                            {fb.resolved ? <Cancel /> : <CheckCircle />}
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeleteTarget({ 
                                type: 'feedback', 
                                id: fb._id, 
                                name: `${fb.type} feedback from ${fb.user?.email || fb.email}` 
                              });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
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
              />
            </Paper>
          )}
        </motion.div>
      </Container>

      {/* User Details Dialog */}
      <Dialog
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={selectedUser.user?.photoURL}
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                    >
                      {selectedUser.user?.displayName?.[0] || selectedUser.user?.email?.[0] || 'U'}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedUser.user?.displayName || 'No Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.user?.email}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Account Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Joined: {formatDate(selectedUser.user?.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Assignment sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Total Resumes: {selectedUser.stats?.totalResumes || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Star sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Average Score: {selectedUser.stats?.avgResumeScore || 0}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <Feedback sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Total Feedback: {selectedUser.stats?.totalFeedback || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {selectedUser.resumes?.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Recent Resumes
                  </Typography>
                  {selectedUser.resumes.slice(0, 3).map((resume) => (
                    <Card key={resume._id} sx={{ mb: 2 }}>
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
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ color: 'error.main', mr: 2 }} />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;