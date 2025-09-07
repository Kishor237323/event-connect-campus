import { executeQuery } from '../database/connection.js';

async function insertSampleStudents() {
  try {
    console.log('Inserting sample students...');
    
    // First, create the students table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        college_id VARCHAR(36) NOT NULL,
        major VARCHAR(100),
        year ENUM('1st', '2nd', '3rd', '4th', '5th', 'graduate'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
      )
    `;
    
    await executeQuery(createTableQuery);
    console.log('✅ Students table created/verified');
    
    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_students_college_id ON students(college_id)',
      'CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id)',
      'CREATE INDEX IF NOT EXISTS idx_students_email ON students(email)'
    ];
    
    for (const indexQuery of indexes) {
      await executeQuery(indexQuery);
    }
    console.log('✅ Indexes created');
    
    // Insert sample students
    const students = [
      ['student-1', 'Arjun Sharma', 'R21CS001', 'arjun.sharma@reva.edu.in', 'college-1', 'Computer Science', '3rd'],
      ['student-2', 'Priya Patel', 'R21EC002', 'priya.patel@reva.edu.in', 'college-1', 'Electronics', '2nd'],
      ['student-3', 'Rahul Kumar', 'R21ME003', 'rahul.kumar@reva.edu.in', 'college-1', 'Mechanical', '4th'],
      ['student-4', 'Sneha Reddy', 'R21IT004', 'sneha.reddy@reva.edu.in', 'college-1', 'Information Technology', '2nd'],
      ['student-5', 'Vikram Singh', 'R21EE005', 'vikram.singh@reva.edu.in', 'college-1', 'Electrical', '3rd'],
      ['student-6', 'Ananya Gupta', 'C21CS001', 'ananya.gupta@christ.edu.in', 'college-2', 'Computer Science', '1st'],
      ['student-7', 'Karthik Nair', 'C21BBA002', 'karthik.nair@christ.edu.in', 'college-2', 'Business Administration', '2nd'],
      ['student-8', 'Divya Iyer', 'C21PSY003', 'divya.iyer@christ.edu.in', 'college-2', 'Psychology', '3rd']
    ];
    
    for (const student of students) {
      const insertQuery = `
        INSERT IGNORE INTO students (id, name, student_id, email, college_id, major, year) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await executeQuery(insertQuery, student);
      console.log(`✅ Inserted student: ${student[1]}`);
    }
    
    // Verify the data
    const countQuery = 'SELECT COUNT(*) as count FROM students';
    const [result] = await executeQuery(countQuery);
    console.log(`✅ Total students in database: ${result.count}`);
    
    // Show students by college
    const collegeQuery = `
      SELECT college_id, COUNT(*) as count 
      FROM students 
      GROUP BY college_id
    `;
    const collegeResults = await executeQuery(collegeQuery);
    console.log('Students by college:');
    collegeResults.forEach(row => {
      console.log(`  ${row.college_id}: ${row.count} students`);
    });
    
    console.log('✅ Sample students inserted successfully');
    
  } catch (error) {
    console.error('❌ Error inserting sample students:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertSampleStudents()
    .then(() => {
      console.log('Student insertion completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Student insertion failed:', error);
      process.exit(1);
    });
}

export { insertSampleStudents };
