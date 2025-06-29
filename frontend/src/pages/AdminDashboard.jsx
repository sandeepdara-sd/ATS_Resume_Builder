import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Pagination,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  People,
  Description,
  Feedback,
  TrendingUp,
  Delete,
  Visibility,
  Search,
  FilterList,
  AdminPanelSettings,
  Logout,
  Settings,
  Analytics,
  Warning,
  CheckCircle,
  Cancel,
  Star,
  BugReport,
  Lightbulb,
  Help,
  MoreVert,
  Refresh
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  
  const navigate = useNavigate();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }

    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    
    // Load initial data
    loadDashboardStats();
    loadUsers();
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get(`${api_url}/api/admin/dashboard/stats`);
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const loadUsers = async (page = 1, search = '', sort = 'createdAt') => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}/api/admin/users`, {
        params: { page, search, sortBy: sort, limit: 10 }
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load users:', error);
      showSnackbar('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}/api/admin/resumes`, {
        params: { page, search, limit: 10 }
      });
      setResumes(response.data.resumes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      showSnackbar('Failed to load resumes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async (page = 1, type = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}/api/admin/feedback`, {
        params: { page, type, limit: 10 }
      });
      setFeedback(response.data.feedback);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      showSnackbar('Failed to load feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
    setSearchTerm('');
    setFilterType('');
    
    switch (newValue) {
      case 1:
        loadUsers();
        break;
      case 2:
        loadResumes();
        break;
      case 3:
        loadFeedback();
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    switch (currentTab) {
      case 1:
        loadUsers(1, searchTerm);
        break;
      case 2:
        loadResumes(1, searchTerm);
        break;
      case 3:
        loadFeedback(1, filterType);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    switch (currentTab) {
      case 1:
        loadUsers(page, searchTerm);
        break;
      case 2:
        loadResumes(page, searchTerm);
        break;
      case 3:
        loadFeedback(page, filterType);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    try {
      const { type, id } = deleteTarget;
      
      switch (type) {
        case 'user':
          await axios.delete(`${api_url}/api/admin/users/${id}`);
          loadUsers(currentPage, searchTerm);
          showSnackbar('User deleted successfully', 'success');
          break;
        case 'resume':
          await axios.delete(`${api_url}/api/admin/resumes/${id}`);
          loadResumes(currentPage, searchTerm);
          showSnackbar('Resume deleted successfully', 'success');
          break;
        case 'feedback':
          await axios.delete(`${api_url}/api/admin/feedback/${id}`);
          loadFeedback(currentPage, filterType);
          showSnackbar('Feedback deleted successfully', 'success');
          break;
        default:
          break;
      }
      
      // Refresh stats
      loadDashboardStats();
    } catch (error) {
      console.error('Delete failed:', error);
      showSnackbar('Failed to delete item', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${api_url}/api/admin/users/${userId}`);
      setSelectedUser(response.data);
      setUserDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
      showSnackbar('Failed to load user details', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getAdminData = () => {
    try {
      return JSON.parse(localStorage.getItem('adminData') || '{}');
    } catch {
      return {};
    }
  };

  const adminData = getAdminData();

  const StatCard = ({ title, value, icon, color, growth }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
          border: `1px solid ${color}30`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 1 }}>
                {value?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {title}
              </Typography>
              {growth !== undefined && (
                <Chip
                  label={`${growth > 0 ? '+' : ''}${growth}%`}
                  size="small"
                  color={growth > 0 ? 'success' : growth < 0 ? 'error' : 'default'}
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: `${color}20`,
                color: color
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Admin Navigation */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar>
          <AdminPanelSettings sx={{ mr: 2, fontSize: 32, color: '#64b5f6' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}>
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
          
          <IconButton
            color="inherit"
            onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
          
          <Menu
            anchorEl={adminMenuAnchor}
            open={Boolean(adminMenuAnchor)}
            onClose={() => setAdminMenuAnchor(null)}
          >
            <MenuItem onClick={() => { setAdminMenuAnchor(null); loadDashboardStats(); }}>
              <ListItemIcon><Refresh /></ListItemIcon>
              <ListItemText>Refresh Data</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setAdminMenuAnchor(null)}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><Logout sx={{ color: 'error.main' }} /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Dashboard Stats */}
        {currentTab === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1a1a2e' }}>
              Dashboard Overview
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Users"
                  value={dashboardStats?.stats?.totalUsers}
                  icon={<People sx={{ fontSize: 40 }} />}
                  color="#667eea"
                  growth={dashboardStats?.stats?.userGrowthRate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Resumes"
                  value={dashboardStats?.stats?.totalResumes}
                  icon={<Description sx={{ fontSize: 40 }} />}
                  color="#10b981"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Feedback"
                  value={dashboardStats?.stats?.totalFeedback}
                  icon={<Feedback sx={{ fontSize: 40 }} />}
                  color="#f59e0b"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Users"
                  value={dashboardStats?.stats?.activeUsers}
                  icon={<TrendingUp sx={{ fontSize: 40 }} />}
                  color="#8b5cf6"
                />
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Users
                  </Typography>
                  {dashboardStats?.recentActivity?.users?.map((user, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={user.photoURL} sx={{ mr: 2 }}>
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {user.displayName || user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Resumes
                  </Typography>
                  {dashboardStats?.recentActivity?.resumes?.map((resume, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Description sx={{ mr: 2, color: 'primary.main' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {resume.personalDetails?.fullName || resume.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Score: {resume.score || 'N/A'}% • {new Date(resume.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab icon={<Dashboard />} label="Dashboard" />
            <Tab icon={<People />} label="Users" />
            <Tab icon={<Description />} label="Resumes" />
            <Tab icon={<Feedback />} label="Feedback" />
          </Tabs>
        </Box>

        {/* Search and Filter Bar */}
        {currentTab > 0 && (
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={`Search ${currentTab === 1 ? 'users' : currentTab === 2 ? 'resumes' : 'feedback'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              {currentTab === 3 && (
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Filter by Type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="bug">Bug Report</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="help">Help</MenuItem>
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: '56px'
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Users Table */}
        {currentTab === 1 && (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Resumes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={user.photoURL} sx={{ mr: 2 }}>
                              {user.displayName?.charAt(0) || user.email?.charAt(0)}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user.displayName || 'No Name'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.resumeCount || 0}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleUserDetails(user._id)}
                              sx={{ mr: 1 }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeleteTarget({ type: 'user', id: user._id, name: user.displayName || user.email });
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        )}

        {/* Resumes Table */}
        {currentTab === 2 && (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Resume</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    resumes.map((resume) => (
                      <TableRow key={resume._id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {resume.personalDetails?.fullName || resume.title || 'Untitled'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={resume.userId?.photoURL} sx={{ mr: 2, width: 32, height: 32 }}>
                              {resume.userId?.displayName?.charAt(0) || resume.userId?.email?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {resume.userId?.displayName || resume.userId?.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${resume.score || 0}%`}
                            size="small"
                            color={resume.score >= 80 ? 'success' : resume.score >= 60 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell>{new Date(resume.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="Delete Resume">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeleteTarget({ 
                                  type: 'resume', 
                                  id: resume._id, 
                                  name: resume.personalDetails?.fullName || resume.title 
                                });
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        )}

        {/* Feedback Table */}
        {currentTab === 3 && (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedback.map((fb) => (
                      <TableRow key={fb._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={fb.user?.photoURL} sx={{ mr: 2, width: 32, height: 32 }}>
                              {fb.user?.displayName?.charAt(0) || fb.user?.email?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {fb.user?.displayName || fb.user?.email || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              fb.type === 'bug' ? <BugReport /> :
                              fb.type === 'feature' ? <Lightbulb /> :
                              fb.type === 'help' ? <Help /> :
                              <Feedback />
                            }
                            label={fb.type}
                            size="small"
                            color={
                              fb.type === 'bug' ? 'error' :
                              fb.type === 'feature' ? 'warning' :
                              fb.type === 'help' ? 'info' :
                              'primary'
                            }
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
                            icon={fb.resolved ? <CheckCircle /> : <Warning />}
                            label={fb.resolved ? 'Resolved' : 'Pending'}
                            size="small"
                            color={fb.resolved ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{new Date(fb.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Tooltip title="Delete Feedback">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeleteTarget({ 
                                  type: 'feedback', 
                                  id: fb._id, 
                                  name: `${fb.type} feedback` 
                                });
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        )}
      </Container>

      {/* User Details Dialog */}
      <Dialog
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>User Information</Typography>
                <Typography><strong>Name:</strong> {selectedUser.user.displayName || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {selectedUser.user.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedUser.user.phone || 'N/A'}</Typography>
                <Typography><strong>Location:</strong> {selectedUser.user.location || 'N/A'}</Typography>
                <Typography><strong>Joined:</strong> {new Date(selectedUser.user.createdAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Statistics</Typography>
                <Typography><strong>Total Resumes:</strong> {selectedUser.stats.totalResumes}</Typography>
                <Typography><strong>Total Feedback:</strong> {selectedUser.stats.totalFeedback}</Typography>
                <Typography><strong>Avg Resume Score:</strong> {selectedUser.stats.avgResumeScore}%</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ color: 'error.main', mr: 2 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;