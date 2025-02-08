require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./infrastructure/database/database'); // Import the testConnection function
const config = require('../config/config');

const app = express();
const port = config.server.port;
const dbHost = config.database.host;

// Middleware
app.use(cors({
  origin: config.cors.allowedOrigins
}));
app.use(express.json());

// Test database connection
testConnection(); // Call the testConnection function here

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Add this route before the error handling middleware
app.get('/', (req, res) => {
  res.send('Welcome to the Resource Requisition Service API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.server.nodeEnv === 'development' ? err.message : undefined
  });
});

console.log(`Connecting to database at: ${dbHost}`);
app.listen(port, () => {
  console.log(`Resource Requisition Service listening on port ${port}`);
});