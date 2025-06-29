// Updated server.js with improved CORS configuration and Auto Admin Creation
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { testConnection } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';

// Import Admin model for auto-creation
import Admin from './models/Admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Initialize Firebase Admin SDK
initializeFirebase();

// Connect to MongoDB
await connectDB();

// Function to automatically create admin user if it doesn't exist
const ensureAdminExists = async () => {
  try {
    console.log('🔍 Checking if admin user exists...');

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔐 Use your existing password to login');
      return;
    }

    console.log('🔄 Creating initial admin user...');

    // Create admin user
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save middleware
      name: adminName,
      role: 'super-admin',
      permissions: ['users', 'resumes', 'feedback', 'analytics', 'settings'],
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🔐 Role: super-admin');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error ensuring admin exists:', error);
    // Do not exit process; continue running
  }
};


// Test MongoDB connection and create admin if needed
setTimeout(async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ MongoDB is ready for operations');
    
    // Automatically create admin user if it doesn't exist
    await ensureAdminExists();
  } else {
    console.log('⚠️ MongoDB connection test failed');
  }
}, 2000);

// Define allowed origins
const getAllowedOrigins = () => {
  const prodOrigins = [
    'https://sd-resume-builder.vercel.app',
    'https://ats-resume-builder-1.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const devOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://sd-resume-builder.vercel.app' // Allow production frontend in development
  ];

  return process.env.NODE_ENV === 'production' ? prodOrigins : [...devOrigins, ...prodOrigins];
};

// CORS Configuration - Simplified and more reliable
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS check for origin: ${origin || 'No Origin'}`);
    
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    const allowedOrigins = getAllowedOrigins();
    console.log('📋 Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origin ${origin} is allowed`);
      callback(null, true);
    } else {
      console.log(`❌ Origin ${origin} is not allowed`);
      // In development, be more permissive
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔓 Development mode: allowing anyway');
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires',
    'X-Access-Token',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Length', 'Access-Control-Allow-Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 200 // Changed from 204 to 200 for better compatibility
};

// Apply CORS middleware early
app.use(cors(corsOptions));

// Additional CORS middleware for extra safety
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const allowedOrigins = getAllowedOrigins();
  
  console.log(`🔍 Additional CORS middleware - Origin: ${origin}, Method: ${req.method}`);
  
  // Set CORS headers explicitly
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production')) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`✅ Set Access-Control-Allow-Origin: ${origin}`);
  } else if (!origin) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log('✅ Set Access-Control-Allow-Origin: *');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma,Expires,X-Access-Token');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return res.status(200).json({
      status: 'OK',
      methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
      headers: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    });
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.get('Origin') || 'No Origin';
  const userAgent = req.get('User-Agent') || 'No User-Agent';
  
  console.log(`📊 ${timestamp} - ${req.method} ${req.path}`);
  console.log(`   Origin: ${origin}`);
  console.log(`   User-Agent: ${userAgent.substring(0, 50)}...`);
  
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    // Hide sensitive data in logs
    if (logBody.password) logBody.password = '***';
    if (logBody.idToken) logBody.idToken = '***';
    if (logBody.token) logBody.token = '***';
    console.log(`   Body keys: ${Object.keys(req.body).join(', ')}`);
  }
  
  next();
});

// Routes - Make sure these are mounted correctly
app.use('/api', authRoutes);
app.use('/api', resumeRoutes);
app.use('/api', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ATS Resume Builder with Admin Dashboard",
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// Deploy initialization endpoint (optional - for manual admin creation if needed)
app.get('/deploy/init-admin', async (req, res) => {
  try {
    // Optional: Add a simple security check
    const deployKey = req.query.key;
    if (deployKey !== process.env.DEPLOY_KEY && deployKey !== 'init-admin-2024') {
      return res.status(403).json({ error: 'Unauthorized - Invalid deploy key' });
    }

    await ensureAdminExists();

    res.json({
      message: 'Admin initialization completed',
      note: 'Check server logs for admin credentials'
    });
  } catch (error) {
    console.error('❌ Deploy init error:', error);
    res.status(500).json({ error: 'Failed to initialize admin' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const mongoStatus = await testConnection();
    
    // Check if admin exists
    const adminExists = await Admin.findOne({ email: 'admin@resumebuilder.com' });
    
    res.json({ 
      status: 'OK', 
      message: 'ATS Resume Builder Server with Admin Dashboard is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        mongodb: mongoStatus ? 'Connected' : 'Disconnected',
        firebase: 'Initialized',
        ai: 'Available',
        admin: adminExists ? 'Admin User Created' : 'Admin User Missing',
        email: process.env.EMAIL_USER && process.env.EMAIL_PASS ? 'Configured' : 'Not Configured'
      },
      version: '2.0.0',
      cors: {
        allowedOrigins: getAllowedOrigins(),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
      }
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'ATS Resume Builder API with Admin Dashboard',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins: getAllowedOrigins(),
      credentials: true
    },
    endpoints: {
      auth: [
        'POST /api/register',
        'POST /api/login', 
        'POST /api/sync-firebase-user',
        'POST /api/forgot-password',
        'POST /api/reset-password',
        'POST /api/update-password'
      ],
      resume: [
        'POST /api/upload-resume',
        'POST /api/save-resume',
        'GET /api/resumes',
        'GET /api/resume/:id',
        'DELETE /api/resume/:id',
        'POST /api/download-resume'
      ],
      ai: [
        'POST /api/generate-summary',
        'POST /api/generate-skills',
        'POST /api/analyze-resume'
      ],
      admin: [
        'POST /api/admin/login',
        'POST /api/admin/create-initial-admin',
        'GET /api/admin/dashboard/stats',
        'GET /api/admin/users',
        'GET /api/admin/resumes',
        'GET /api/admin/feedback'
      ],
      deployment: [
        'GET /deploy/init-admin?key=init-admin-2024'
      ]
    }
  });
});

// Catch-all for API routes to help debug missing routes
app.use('/api/*', (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl,
    message: 'Check the API documentation at /api',
    availableRoutes: [
      '/api/health',
      '/api/register',
      '/api/login',
      '/api/forgot-password',
      '/api/reset-password'
    ]
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Global Error Handler:', error);
  
  // CORS error
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Cross-origin request blocked',
      origin: req.get('Origin'),
      allowedOrigins: getAllowedOrigins()
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.message,
      fields: Object.keys(error.errors || {})
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return res.status(400).json({ 
      error: `Duplicate entry for ${field}`,
      field: field
    });
  }

  if (error.name === 'MulterError') {
    return res.status(400).json({ 
      error: 'File upload error', 
      details: error.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    suggestion: 'Try /api for API documentation or /api/health for health check'
  });
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`🔄 ${signal} received, shutting down gracefully...`);
  
  server.close(() => {
    console.log('🔄 HTTP server closed');
    
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(() => {
        console.log('🔄 MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ================================================`);
  console.log(`✅ Server with Admin Dashboard is ready on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🔒 CORS allowed origins:`);
  getAllowedOrigins().forEach(origin => console.log(`   - ${origin}`));
  console.log(`📧 Email service: ${process.env.EMAIL_USER && process.env.EMAIL_PASS ? '✅ Configured' : '❌ Not Configured'}`);
  console.log(`🔐 Admin auto-creation: ✅ Enabled`);
  console.log(`================================================\n`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
