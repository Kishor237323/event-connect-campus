// Database configuration using Dexie.js (IndexedDB)
import Dexie, { Table } from 'dexie';
import { College, Event, Student, Registration, Attendance, Feedback } from '@/types';

// Database class extending Dexie
class CampusEventsDB extends Dexie {
  colleges!: Table<College>;
  events!: Table<Event>;
  students!: Table<Student>;
  registrations!: Table<Registration>;
  attendance!: Table<Attendance>;
  feedback!: Table<Feedback>;

  constructor() {
    super('CampusEventsDB');
    
    this.version(1).stores({
      colleges: 'id, name, domain, created_at, updated_at',
      events: 'id, college_id, title, event_type, category, start_date, end_date, status, created_at, updated_at',
      students: 'id, college_id, student_id, name, email, major, year, created_at, updated_at',
      registrations: 'id, event_id, student_id, registered_at, status',
      attendance: 'id, registration_id, checked_in_at, checked_out_at, status, created_at',
      feedback: 'id, registration_id, rating, comment, submitted_at'
    });
  }
}

// Create database instance
const db = new CampusEventsDB();

// Database helper functions
export const getDatabase = () => db;

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    await db.open();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Close database
export const closeDatabase = (): void => {
  db.close();
  console.log('Database connection closed');
};

// Export database instance
export { db };
