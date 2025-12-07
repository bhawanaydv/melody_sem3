const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Melody API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Melody Music API', 
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Use port 5001 directly to avoid .env loading issues
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
  🎵 Melody Server is running!
  📍 Port: ${PORT}
  🔗 API: http://localhost:${PORT}/api
  `);
});
