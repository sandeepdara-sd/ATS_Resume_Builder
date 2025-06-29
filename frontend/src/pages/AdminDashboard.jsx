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
  Tooltip,
  Switch,
  FormControlLabel,
  Skeleton,
  useTheme,
  alpha
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
  Refresh,
  Download,
  Upload,
  NotificationsActive,
  Security,
  Speed,
  Timeline,
  Assessment,
  TrendingDown,
  PersonAdd,
  FilePresent,
  RateReview,
  CalendarToday,
  Schedule,
  Group,
  Assignment,
  BarChart,
  PieChart,
  ShowChart,
  DataUsage,
  Insights,
  AutoGraph,
  MonetizationOn,
  WorkspacePremium,
  EmojiEvents,
  LocalFireDepartment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../helper/Helper';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Enhanced color palette
const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
  orange: '#f97316',
  emerald: '#059669',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  violet: '#7c3aed',
  amber: '#d97706'
};

const chartColors = [colors.primary, colors.success, colors.warning, colors.error, colors.purple, colors.pink];

function AdminDashboard() {
  const theme = useTheme();
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
  const [darkMode, setDarkMode] = useState(false);
  const [realTimeData, setRealTimeData] = useState(true);
  
  const navigate = useNavigate();

  // Mock data for enhanced charts
  const [chartData, setChartData] = useState({
    userGrowth: [
      { month: 'Jan', users: 120, resumes: 89, active: 95 },
      { month: 'Feb', users: 180, resumes: 145, active: 142 },
      { month: 'Mar', users: 250, resumes: 198, active: 189 },
      { month: 'Apr', users: 320, resumes: 267, active: 245 },
      { month: 'May', users: 410, resumes: 356, active: 312 },
      { month: 'Jun', users: 520, resumes: 445, active: 398 }
    ],
    resumeScores: [
      { range: '90-100', count: 45, percentage: 18 },
      { range: '80-89', count: 78, percentage: 31 },
      { range: '70-79', count: 65, percentage: 26 },
      { range: '60-69', count: 42, percentage: 17 },
      { range: '0-59', count: 20, percentage: 8 }
    ],
    feedbackTypes: [
      { name: 'General', value: 45, color: colors.primary },
      { name: 'Bug Reports', value: 23, color: colors.error },
      { name: 'Feature Requests', value: 32, color: colors.warning },
      { name: 'Help Requests', value: 18, color: colors.info }
    ],
    dailyActivity: [
      { day: 'Mon', logins: 45, downloads: 32, uploads: 28 },
      { day: 'Tue', logins: 52, downloads: 38, uploads: 31 },
      { day: 'Wed', logins: 48, downloads: 35, uploads: 29 },
      { day: 'Thu', logins: 61, downloads: 42, uploads: 35 },
      { day: 'Fri', logins: 55, downloads: 39, uploads: 33 },
      { day: 'Sat', logins: 38, downloads: 25, uploads: 22 },
      { day: 'Sun', logins: 42, downloads: 28, uploads: 24 }
    ]
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
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

  // Enhanced Stat Card Component
  const EnhancedStatCard = ({ title, value, icon, color, growth, trend, subtitle, isLoading }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
          border: `1px solid ${color}30`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                {title}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 1 }}>
                  <CountUp end={value || 0} duration={2} />
                </Typography>
              )}
              {subtitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: `${color}20`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
          
          {growth !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                label={`${growth > 0 ? '+' : ''}${growth}%`}
                size="small"
                color={growth > 0 ? 'success' : growth < 0 ? 'error' : 'default'}
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // Chart Components
  const UserGrowthChart = () => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <ShowChart sx={{ mr: 1, color: colors.primary }} />
            User Growth Trend
          </Typography>
          <Chip label="Last 6 Months" size="small" color="primary" variant="outlined" />
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.userGrowth}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="resumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.success} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.success} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              stroke={colors.primary}
              fillOpacity={1}
              fill="url(#userGradient)"
              strokeWidth={3}
              name="Total Users"
            />
            <Area
              type="monotone"
              dataKey="resumes"
              stroke={colors.success}
              fillOpacity={1}
              fill="url(#resumeGradient)"
              strokeWidth={3}
              name="Resumes Created"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const ResumeScoresChart = () => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1, color: colors.warning }} />
          Resume Score Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={chartData.resumeScores}>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
            <XAxis dataKey="range" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8
              }}
            />
            <Bar 
              dataKey="count" 
              fill={colors.warning}
              radius={[4, 4, 0, 0]}
              name="Number of Resumes"
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const FeedbackPieChart = () => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
          <PieChart sx={{ mr: 1, color: colors.info }} />
          Feedback Categories
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData.feedbackTypes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.feedbackTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const ActivityChart = () => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
          <Timeline sx={{ mr: 1, color: colors.purple }} />
          Weekly Activity
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData.dailyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
            <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8
              }}
            />
            <Legend />
            <Bar dataKey="logins" fill={colors.primary} radius={[2, 2, 0, 0]} name="Logins" />
            <Line type="monotone" dataKey="downloads" stroke={colors.success} strokeWidth={3} name="Downloads" />
            <Line type="monotone" dataKey="uploads" stroke={colors.warning} strokeWidth={3} name="Uploads" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Performance Metrics Component
  const PerformanceMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CircularProgressbar
              value={87}
              text="87%"
              styles={buildStyles({
                textColor: colors.success,
                pathColor: colors.success,
                trailColor: alpha(colors.success, 0.2)
              })}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.success }}>
            System Health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All systems operational
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CircularProgressbar
              value={92}
              text="92%"
              styles={buildStyles({
                textColor: colors.primary,
                pathColor: colors.primary,
                trailColor: alpha(colors.primary, 0.2)
              })}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
            User Satisfaction
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on feedback
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CircularProgressbar
              value={78}
              text="78%"
              styles={buildStyles({
                textColor: colors.warning,
                pathColor: colors.warning,
                trailColor: alpha(colors.warning, 0.2)
              })}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.warning }}>
            Conversion Rate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visitors to users
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CircularProgressbar
              value={95}
              text="95%"
              styles={buildStyles({
                textColor: colors.info,
                pathColor: colors.info,
                trailColor: alpha(colors.info, 0.2)
              })}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.info }}>
            Uptime
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last 30 days
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Enhanced Navigation */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AdminPanelSettings sx={{ mr: 2, fontSize: 32, color: '#64b5f6' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Advanced Analytics & Management
                </Typography>
              </Box>
            </Box>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={realTimeData}
                  onChange={(e) => setRealTimeData(e.target.checked)}
                  color="default"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
                  Real-time
                </Typography>
              }
            />
            
            <Badge badgeContent={4} color="error">
              <NotificationsActive sx={{ color: 'white', cursor: 'pointer' }} />
            </Badge>
            
            <Chip
              label={adminData.role || 'Admin'}
              size="small"
              icon={<Security />}
              sx={{
                backgroundColor: 'rgba(100, 181, 246, 0.2)',
                color: '#64b5f6',
                fontWeight: 600,
                border: '1px solid rgba(100, 181, 246, 0.3)'
              }}
            />
            
            <IconButton
              color="inherit"
              onClick={(e) => setAdminMenuAnchor(e.currentTarget)}
              sx={{
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={adminMenuAnchor}
            open={Boolean(adminMenuAnchor)}
            onClose={() => setAdminMenuAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.05)'
              }
            }}
          >
            <MenuItem onClick={() => { setAdminMenuAnchor(null); loadDashboardStats(); }}>
              <ListItemIcon><Refresh /></ListItemIcon>
              <ListItemText>Refresh Data</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setAdminMenuAnchor(null)}>
              <ListItemIcon><Download /></ListItemIcon>
              <ListItemText>Export Data</ListItemText>
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
        {/* Dashboard Overview */}
        {currentTab === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#1a1a2e' }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time insights and analytics for your platform
              </Typography>
            </Box>
            
            {/* Enhanced Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatCard
                  title="Total Users"
                  value={dashboardStats?.stats?.totalUsers}
                  icon={<People sx={{ fontSize: 32 }} />}
                  color={colors.primary}
                  growth={dashboardStats?.stats?.userGrowthRate}
                  trend="up"
                  subtitle="Active members"
                  isLoading={!dashboardStats}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatCard
                  title="Total Resumes"
                  value={dashboardStats?.stats?.totalResumes}
                  icon={<Description sx={{ fontSize: 32 }} />}
                  color={colors.success}
                  growth={15.2}
                  trend="up"
                  subtitle="Created this month"
                  isLoading={!dashboardStats}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatCard
                  title="Feedback Received"
                  value={dashboardStats?.stats?.totalFeedback}
                  icon={<Feedback sx={{ fontSize: 32 }} />}
                  color={colors.warning}
                  growth={8.7}
                  trend="up"
                  subtitle="User responses"
                  isLoading={!dashboardStats}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedStatCard
                  title="Active Users"
                  value={dashboardStats?.stats?.activeUsers}
                  icon={<TrendingUp sx={{ fontSize: 32 }} />}
                  color={colors.purple}
                  growth={12.3}
                  trend="up"
                  subtitle="Last 30 days"
                  isLoading={!dashboardStats}
                />
              </Grid>
            </Grid>

            {/* Performance Metrics */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Speed sx={{ mr: 2, color: colors.info }} />
                Performance Metrics
              </Typography>
              <PerformanceMetrics />
            </Box>

            {/* Charts Grid */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} lg={8}>
                <UserGrowthChart />
              </Grid>
              <Grid item xs={12} lg={4}>
                <FeedbackPieChart />
              </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} lg={6}>
                <ResumeScoresChart />
              </Grid>
              <Grid item xs={12} lg={6}>
                <ActivityChart />
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                      <PersonAdd sx={{ mr: 1, color: colors.success }} />
                      Recent Users
                    </Typography>
                    {dashboardStats?.recentActivity?.users?.map((user, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}>
                          <Avatar 
                            src={user.photoURL} 
                            sx={{ 
                              mr: 2,
                              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                            }}
                          >
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
                          <Chip label="New" size="small" color="success" />
                        </Box>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                      <FilePresent sx={{ mr: 1, color: colors.warning }} />
                      Recent Resumes
                    </Typography>
                    {dashboardStats?.recentActivity?.resumes?.map((resume, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${colors.warning}, ${colors.orange})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <Description sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {resume.personalDetails?.fullName || resume.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Score: {resume.score || 'N/A'}% • {new Date(resume.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${resume.score || 0}%`} 
                            size="small" 
                            color={resume.score >= 80 ? 'success' : resume.score >= 60 ? 'warning' : 'error'} 
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 64
              }
            }}
          >
            <Tab 
              icon={<Dashboard />} 
              label="Dashboard" 
              iconPosition="start"
              sx={{ 
                '&.Mui-selected': { 
                  background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)}, ${alpha(colors.secondary, 0.1)})`,
                  borderRadius: 2
                }
              }}
            />
            <Tab 
              icon={<People />} 
              label="Users" 
              iconPosition="start"
              sx={{ 
                '&.Mui-selected': { 
                  background: `linear-gradient(135deg, ${alpha(colors.success, 0.1)}, ${alpha(colors.emerald, 0.1)})`,
                  borderRadius: 2
                }
              }}
            />
            <Tab 
              icon={<Description />} 
              label="Resumes" 
              iconPosition="start"
              sx={{ 
                '&.Mui-selected': { 
                  background: `linear-gradient(135deg, ${alpha(colors.warning, 0.1)}, ${alpha(colors.orange, 0.1)})`,
                  borderRadius: 2
                }
              }}
            />
            <Tab 
              icon={<Feedback />} 
              label="Feedback" 
              iconPosition="start"
              sx={{ 
                '&.Mui-selected': { 
                  background: `linear-gradient(135deg, ${alpha(colors.info, 0.1)}, ${alpha(colors.cyan, 0.1)})`,
                  borderRadius: 2
                }
              }}
            />
          </Tabs>
        </Box>

        {/* Search and Filter Bar */}
        {currentTab > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder={`Search ${currentTab === 1 ? 'users' : currentTab === 2 ? 'resumes' : 'feedback'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                      sx: { borderRadius: 3 }
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                      height: '56px',
                      borderRadius: 3,
                      fontWeight: 600
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {/* Users Table */}
        {currentTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Resumes</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Joined</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <LinearProgress sx={{ borderRadius: 1 }} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          component={TableRow}
                          hover
                          sx={{ '&:hover': { backgroundColor: alpha(colors.primary, 0.04) } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={user.photoURL} 
                                sx={{ 
                                  mr: 2,
                                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                }}
                              >
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
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUserDetails(user._id)}
                                  sx={{ 
                                    backgroundColor: alpha(colors.info, 0.1),
                                    '&:hover': { backgroundColor: alpha(colors.info, 0.2) }
                                  }}
                                >
                                  <Visibility sx={{ color: colors.info }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete User">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDeleteTarget({ type: 'user', id: user._id, name: user.displayName || user.email });
                                    setDeleteConfirmOpen(true);
                                  }}
                                  sx={{ 
                                    backgroundColor: alpha(colors.error, 0.1),
                                    '&:hover': { backgroundColor: alpha(colors.error, 0.2) }
                                  }}
                                >
                                  <Delete sx={{ color: colors.error }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
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
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        )}

        {/* Resumes Table */}
        {currentTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Resume</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Score</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <LinearProgress sx={{ borderRadius: 1 }} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      resumes.map((resume, index) => (
                        <motion.tr
                          key={resume._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          component={TableRow}
                          hover
                          sx={{ '&:hover': { backgroundColor: alpha(colors.warning, 0.04) } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  background: `linear-gradient(135deg, ${colors.warning}, ${colors.orange})`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}
                              >
                                <Description sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {resume.personalDetails?.fullName || resume.title || 'Untitled'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={resume.userId?.photoURL} 
                                sx={{ 
                                  mr: 2, 
                                  width: 32, 
                                  height: 32,
                                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                }}
                              >
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
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>{new Date(resume.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete Resume">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDeleteTarget({ 
                                    type: 'resume', 
                                    id: resume._id, 
                                    name: resume.personalDetails?.fullName || resume.title 
                                  });
                                  setDeleteConfirmOpen(true);
                                }}
                                sx={{ 
                                  backgroundColor: alpha(colors.error, 0.1),
                                  '&:hover': { backgroundColor: alpha(colors.error, 0.2) }
                                }}
                              >
                                <Delete sx={{ color: colors.error }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </motion.tr>
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
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        )}

        {/* Feedback Table */}
        {currentTab === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Message</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <LinearProgress sx={{ borderRadius: 1 }} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      feedback.map((fb, index) => (
                        <motion.tr
                          key={fb._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          component={TableRow}
                          hover
                          sx={{ '&:hover': { backgroundColor: alpha(colors.info, 0.04) } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={fb.user?.photoURL} 
                                sx={{ 
                                  mr: 2, 
                                  width: 32, 
                                  height: 32,
                                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                }}
                              >
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
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star sx={{ color: '#ffc107', mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {fb.rating}/5
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
                              icon={fb.resolved ? <CheckCircle /> : <Warning />}
                              label={fb.resolved ? 'Resolved' : 'Pending'}
                              size="small"
                              color={fb.resolved ? 'success' : 'warning'}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>{new Date(fb.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete Feedback">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDeleteTarget({ 
                                    type: 'feedback', 
                                    id: fb._id, 
                                    name: `${fb.type} feedback` 
                                  });
                                  setDeleteConfirmOpen(true);
                                }}
                                sx={{ 
                                  backgroundColor: alpha(colors.error, 0.1),
                                  '&:hover': { backgroundColor: alpha(colors.error, 0.2) }
                                }}
                              >
                                <Delete sx={{ color: colors.error }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </motion.tr>
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
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </Container>

      {/* Enhanced User Details Dialog */}
      <Dialog
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 2 }} />
            User Details
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.primary }}>
                  User Information
                </Typography>
                <Box sx={{ p: 3, backgroundColor: alpha(colors.primary, 0.05), borderRadius: 3 }}>
                  <Typography sx={{ mb: 1 }}><strong>Name:</strong> {selectedUser.user.displayName || 'N/A'}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Email:</strong> {selectedUser.user.email}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Phone:</strong> {selectedUser.user.phone || 'N/A'}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Location:</strong> {selectedUser.user.location || 'N/A'}</Typography>
                  <Typography><strong>Joined:</strong> {new Date(selectedUser.user.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.success }}>
                  Statistics
                </Typography>
                <Box sx={{ p: 3, backgroundColor: alpha(colors.success, 0.05), borderRadius: 3 }}>
                  <Typography sx={{ mb: 1 }}><strong>Total Resumes:</strong> {selectedUser.stats.totalResumes}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Total Feedback:</strong> {selectedUser.stats.totalFeedback}</Typography>
                  <Typography><strong>Avg Resume Score:</strong> {selectedUser.stats.avgResumeScore}%</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setUserDetailsOpen(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: colors.error,
          fontWeight: 600
        }}>
          <Warning sx={{ mr: 2, fontSize: 28 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            This will permanently remove all associated data.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2 }}
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
          sx={{ 
            width: '100%', 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
