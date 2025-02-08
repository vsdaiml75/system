require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'resource_requisition_db'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRY || '24h'
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  },

  services: {
    masterData: process.env.MASTER_DATA_SERVICE_URL || 'http://localhost:3002',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3003'
  }
};

module.exports = config; 