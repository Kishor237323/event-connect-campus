import { executeQuery } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupStudentsTable() {
  try {
    console.log('Setting up students table...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, '../database/create_students_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await executeQuery(statement.trim());
        console.log('✅ Executed SQL statement');
      }
    }
    
    console.log('✅ Students table setup completed successfully');
    
  } catch (error) {
    console.error('❌ Error setting up students table:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupStudentsTable()
    .then(() => {
      console.log('Students table setup finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupStudentsTable };
