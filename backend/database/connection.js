import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Kishor@2373',
  database: process.env.DB_NAME || 'campus_events',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 100
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error.message);
    return false;
  }
};

// Get connection from pool
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
};

// Execute query with parameters
export const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Execute transaction
export const executeTransaction = async (queries) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.query(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Transaction error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export default pool;
