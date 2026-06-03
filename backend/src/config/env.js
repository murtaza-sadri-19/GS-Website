const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const required = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const port = parseInt(process.env.PORT || '5000');

module.exports = {
  nodeEnv:   process.env.NODE_ENV || 'development',
  port,
  appUrl:    process.env.APP_URL || `http://localhost:${port}`,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'SGSITS_DB',
  },

  jwt: {
    secret:    process.env.JWT_SECRET    || 'dev_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  smtp: {
    host:     process.env.SMTP_HOST || 'smtp.gmail.com',
    port:     parseInt(process.env.SMTP_PORT || '587'),
    user:     process.env.SMTP_USER || '',
    pass:     process.env.SMTP_PASS || '',
    from:     process.env.SMTP_FROM || 'SGSITS Portal <no-reply@sgsits.ac.in>',
  },

  frontendUrl: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
};
