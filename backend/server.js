import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './database/connection.js';

// Import routes
import eventsRouter from './routes/events.js';
import collegesRouter from './routes/colleges.js';
import reportsRouter from './routes/reports.js';
import registrationsRouter from './routes/registrations.js';
import studentsRouter from './routes/students.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // allow 1000 requests per minute for local dev
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:8082',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Events API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Events API is running',
    version: '1.0.0',
    endpoints: {
      events: '/api/events',
      colleges: '/api/colleges',
      reports: '/api/reports',
      registrations: '/api/registrations',
      students: '/api/students',
      health: '/health'
    }
  });
});

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/colleges', collegesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/students', studentsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your MySQL configuration.');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Campus Events API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
