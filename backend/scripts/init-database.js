import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🚀 Initializing Campus Events Database...');
    
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database first
    await connection.query('CREATE DATABASE IF NOT EXISTS campus_events');
    console.log('✅ Database campus_events created/verified');
    
    // Use the database
    await connection.query('USE campus_events');
    console.log('✅ Using campus_events database');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    // First, remove comments and normalize whitespace
    const cleanSchema = schema
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('--'))
      .join(' ');
    
    const statements = cleanSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    console.log(`📝 Found ${statements.length} statements to execute`);
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`📝 Executing statement ${i + 1}: ${statement.substring(0, 100)}...`);
        try {
          await connection.query(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
          console.error(`Error: ${error.message}`);
        }
      }
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
    // Insert sample data
    await insertSampleData(connection);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertSampleData(connection) {
  try {
    console.log('📊 Inserting sample data...');
    
    // Insert sample colleges
    const colleges = [
      ['550e8400-e29b-41d4-a716-446655440001', 'MIT', 'mit.edu'],
      ['550e8400-e29b-41d4-a716-446655440002', 'Stanford University', 'stanford.edu'],
      ['550e8400-e29b-41d4-a716-446655440003', 'Harvard University', 'harvard.edu']
    ];
    
    for (const [id, name, domain] of colleges) {
      await connection.query(
        'INSERT IGNORE INTO colleges (id, name, domain) VALUES (?, ?, ?)',
        [id, name, domain]
      );
    }
    
    // Insert sample events
    const events = [
      [
        'event-001',
        '550e8400-e29b-41d4-a716-446655440001',
        'Tech Innovation Summit',
        'Annual technology conference showcasing latest innovations',
        'conference',
        'Academic',
        '2024-03-15 09:00:00',
        '2024-03-15 17:00:00',
        'MIT Campus Hall',
        200,
        'active',
        'admin@mit.edu'
      ],
      [
        'event-002',
        '550e8400-e29b-41d4-a716-446655440002',
        'Data Science Workshop',
        'Hands-on workshop on machine learning and data analysis',
        'workshop',
        'Academic',
        '2024-03-20 10:00:00',
        '2024-03-20 16:00:00',
        'Stanford CS Building',
        50,
        'active',
        'admin@stanford.edu'
      ]
    ];
    
    for (const event of events) {
      await connection.query(
        `INSERT IGNORE INTO events (id, college_id, title, description, event_type, category, start_date, end_date, location, capacity, status, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        event
      );
    }
    
    console.log('✅ Sample data inserted successfully!');
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

// Run initialization
initializeDatabase();
