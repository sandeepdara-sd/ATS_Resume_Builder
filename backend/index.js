import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { testConnection } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Initialize Firebase Admin SDK
initializeFirebase();

// Connect to MongoDB
await connectDB();

// Test MongoDB connection
setTimeout(async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ MongoDB is ready for operations');
  } else {
    console.log('⚠️ MongoDB connection test failed');
  }
}, 2000);

// Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? [
//         'https://sd-resume-builder.vercel.app', 
//         'https://your-vercel-app.vercel.app',
//         process.env.FRONTEND_URL
//       ].filter(Boolean)
//     : ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true
// }));

app.use(cors())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    if (logBody.idToken) logBody.idToken = '***';
  }
  
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', resumeRoutes);
app.use('/api', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.use("/",(req,res)=>{
  res.send("Welcome to ATS Resume Builder with Admin Dashboard")
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoStatus = await testConnection();
  
  res.json({ 
    status: 'OK', 
    message: 'ATS Resume Builder Server with Admin Dashboard is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      mongodb: mongoStatus ? 'Connected' : 'Disconnected',
      firebase: 'Initialized',
      ai: 'Available',
      admin: 'Available'
    },
    version: '2.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'ATS Resume Builder API with Admin Dashboard',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
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
        'GET /api/admin/dashboard/stats',
        'GET /api/admin/users',
        'GET /api/admin/resumes',
        'GET /api/admin/feedback'
      ]
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
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
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: '/api'
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
  
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server with Admin Dashboard is ready on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
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
