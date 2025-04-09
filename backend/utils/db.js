const config = require('./config');
const logger = require('./logger');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  port: 3307,  // Added port 3307
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connect = async () => {
  try {
    await pool.getConnection();
    logger.info('Database connection successful');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};

const query = async (sql, params) => {
  try {
    const [rows, fields] = await pool.query(sql, params);
    return [rows, fields];
  } catch (error) {
    logger.error('Error executing SQL query', { sql, params, error });
    throw error;
  }
};

module.exports = {
  connect,
  query,
};
