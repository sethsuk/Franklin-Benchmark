// connect to a PostgreSQL DB (AWS RDS compatible)
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

// Check if connecting to RDS
const isRDS = process.env.DB_HOST && process.env.DB_HOST.includes('rds.amazonaws.com');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // SSL is required for AWS RDS connections
  ssl: isRDS ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err.message));
  
module.exports = pool;