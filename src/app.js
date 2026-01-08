const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./utils/errorHandler');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// CORS middleware (simple version)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Health check route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Role-Based Task Management API',
    version: '1.0.0',
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler (must be after routes)
app.use(errorHandler);

module.exports = app;
