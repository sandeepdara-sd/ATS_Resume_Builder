import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { testConnection } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';
import router from './routes/feedback.js';

// Load environment variables
dotenv.config();

const app = express();


// console.log('🚀 Starting ATS Resume Builder Server...');
// console.log('📍 Environment:', process.env.NODE_ENV || 'development');

// Initialize Firebase Admin SDK
// console.log('🔄 Initializing Firebase Admin SDK...');
initializeFirebase();

// Connect to MongoDB
// console.log('🔄 Connecting to MongoDB...');
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
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  // console.log(`📝 ${req.method} ${req.path} - ${timestamp}`);
  
  // Log request body for debugging (excluding sensitive data)
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    if (logBody.idToken) logBody.idToken = '***';
    // console.log('📦 Request body:', JSON.stringify(logBody, null, 2).substring(0, 500));
  }
  
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', resumeRoutes);
app.use('/api', aiRoutes);
app.use('/api/feedback',router )

app.use("/",(req,res)=>{
  res.send("Welocme to ATS Resume Builder ")
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoStatus = await testConnection();
  
  res.json({ 
    status: 'OK', 
    message: 'ATS Resume Builder Server is running',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoStatus ? 'Connected' : 'Disconnected',
      firebase: 'Initialized',
      ai: 'Available'
    },
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'ATS Resume Builder API',
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/register',
        'POST /api/login', 
        'POST /api/sync-firebase-user'
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
      ]
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  // Handle specific error types
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
  
  // Close server
  server.close(() => {
    console.log('🔄 HTTP server closed');
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(() => {
        console.log('🔄 MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const server = app.listen(5000, () => {
  // console.log(`🚀 Server running on port ${PORT}`);
  // console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  // console.log(`📍 API docs: http://localhost:${PORT}/api`);
  // console.log(`📍 Frontend: http://localhost:5173`);
  console.log('✅ Server is ready to accept connections');
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
