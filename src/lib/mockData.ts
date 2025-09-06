// Mock data service for populating the database with sample data
import { db } from './database';
import { v4 as uuidv4 } from 'uuid';

// Sample colleges
const colleges = [
  { id: 'college-1', name: 'University of Technology', domain: 'tech.edu', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'college-2', name: 'State University', domain: 'state.edu', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'college-3', name: 'Community College', domain: 'community.edu', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// Sample students
const students = [
  // College 1 students
  { id: 'student-1', college_id: 'college-1', student_id: 'STU001', name: 'Alice Johnson', email: 'alice@tech.edu', major: 'Computer Science', year: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-2', college_id: 'college-1', student_id: 'STU002', name: 'Bob Smith', email: 'bob@tech.edu', major: 'Engineering', year: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-3', college_id: 'college-1', student_id: 'STU003', name: 'Carol Davis', email: 'carol@tech.edu', major: 'Business', year: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-4', college_id: 'college-1', student_id: 'STU004', name: 'David Brown', email: 'david@tech.edu', major: 'Science', year: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-5', college_id: 'college-1', student_id: 'STU005', name: 'Emma Wilson', email: 'emma@tech.edu', major: 'Arts', year: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // College 2 students
  { id: 'student-6', college_id: 'college-2', student_id: 'STU006', name: 'Frank Miller', email: 'frank@state.edu', major: 'Medicine', year: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-7', college_id: 'college-2', student_id: 'STU007', name: 'Grace Lee', email: 'grace@state.edu', major: 'Law', year: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-8', college_id: 'college-2', student_id: 'STU008', name: 'Henry Taylor', email: 'henry@state.edu', major: 'Education', year: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // College 3 students
  { id: 'student-9', college_id: 'college-3', student_id: 'STU009', name: 'Ivy Chen', email: 'ivy@community.edu', major: 'Nursing', year: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'student-10', college_id: 'college-3', student_id: 'STU010', name: 'Jack Anderson', email: 'jack@community.edu', major: 'Criminal Justice', year: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// Sample events
const events = [
  {
    id: 'event-1',
    college_id: 'college-1',
    title: 'Tech Symposium 2024',
    description: 'Annual technology conference featuring industry leaders and innovative projects',
    event_type: 'single' as const,
    category: 'academic' as const,
    start_date: '2024-03-15T14:00:00Z',
    end_date: '2024-03-15T18:00:00Z',
    location: 'Engineering Hall, Room 101',
    capacity: 200,
    status: 'active' as const,
    created_by: 'admin-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-2',
    college_id: 'college-1',
    title: 'Cultural Festival',
    description: 'Celebrate diversity with music, dance, and cultural performances',
    event_type: 'single' as const,
    category: 'cultural' as const,
    start_date: '2024-03-20T10:00:00Z',
    end_date: '2024-03-20T20:00:00Z',
    location: 'Campus Grounds',
    capacity: 500,
    status: 'active' as const,
    created_by: 'admin-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-3',
    college_id: 'college-1',
    title: 'Career Fair 2024',
    description: 'Connect with top employers and explore career opportunities',
    event_type: 'single' as const,
    category: 'professional' as const,
    start_date: '2024-03-25T09:00:00Z',
    end_date: '2024-03-25T16:00:00Z',
    location: 'Student Center',
    capacity: 400,
    status: 'active' as const,
    created_by: 'admin-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-4',
    college_id: 'college-1',
    title: 'Science Fair',
    description: 'Showcase of innovative research projects and scientific discoveries',
    event_type: 'single' as const,
    category: 'academic' as const,
    start_date: '2024-04-05T13:00:00Z',
    end_date: '2024-04-05T17:00:00Z',
    location: 'Science Building',
    capacity: 150,
    status: 'draft' as const,
    created_by: 'admin-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-5',
    college_id: 'college-2',
    title: 'Medical Conference',
    description: 'Latest advances in medical research and practice',
    event_type: 'single' as const,
    category: 'academic' as const,
    start_date: '2024-03-18T08:00:00Z',
    end_date: '2024-03-18T17:00:00Z',
    location: 'Medical Center',
    capacity: 300,
    status: 'active' as const,
    created_by: 'admin-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-6',
    college_id: 'college-2',
    title: 'Law Symposium',
    description: 'Legal professionals discuss current legal issues',
    event_type: 'single' as const,
    category: 'professional' as const,
    start_date: '2024-03-22T09:00:00Z',
    end_date: '2024-03-22T15:00:00Z',
    location: 'Law School',
    capacity: 250,
    status: 'active' as const,
    created_by: 'admin-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'event-7',
    college_id: 'college-3',
    title: 'Nursing Workshop',
    description: 'Hands-on nursing skills and patient care techniques',
    event_type: 'single' as const,
    category: 'academic' as const,
    start_date: '2024-03-28T10:00:00Z',
    end_date: '2024-03-28T16:00:00Z',
    location: 'Health Sciences Building',
    capacity: 100,
    status: 'active' as const,
    created_by: 'admin-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Generate random registrations
function generateRegistrations() {
  const registrations = [];
  const registrationStatuses = ['registered', 'cancelled', 'waitlisted'];
  
  events.forEach(event => {
    // Randomly select students to register (60-90% of capacity)
    const numRegistrations = Math.floor(Math.random() * (event.capacity * 0.3) + event.capacity * 0.6);
    const shuffledStudents = students.filter(s => s.college_id === event.college_id).sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(numRegistrations, shuffledStudents.length); i++) {
      const student = shuffledStudents[i];
      const status = registrationStatuses[Math.floor(Math.random() * registrationStatuses.length)];
      
      registrations.push({
        id: uuidv4(),
        event_id: event.id,
        student_id: student.id,
        registered_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: status
      });
    }
  });
  
  return registrations;
}

// Generate random attendance records
function generateAttendance(registrations: any[]) {
  const attendance = [];
  
  registrations.forEach(reg => {
    if (reg.status === 'registered') {
      // 80-95% attendance rate
      const willAttend = Math.random() < 0.87;
      
      if (willAttend) {
        const checkedInAt = new Date(reg.registered_at);
        checkedInAt.setMinutes(checkedInAt.getMinutes() + Math.random() * 60); // Within 1 hour of event start
        
        const checkedOutAt = new Date(checkedInAt);
        checkedOutAt.setHours(checkedOutAt.getHours() + 2 + Math.random() * 2); // 2-4 hours duration
        
        attendance.push({
          id: uuidv4(),
          registration_id: reg.id,
          checked_in_at: checkedInAt.toISOString(),
          checked_out_at: checkedOutAt.toISOString(),
          status: 'present' as const,
          created_at: new Date().toISOString()
        });
      }
    }
  });
  
  return attendance;
}

// Generate random feedback
function generateFeedback(registrations: any[], attendance: any[]) {
  const feedback = [];
  
  registrations.forEach(reg => {
    const attendanceRecord = attendance.find(a => a.registration_id === reg.id);
    
    if (attendanceRecord && reg.status === 'registered') {
      // 60-80% feedback rate
      const willGiveFeedback = Math.random() < 0.7;
      
      if (willGiveFeedback) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars (mostly positive)
        const comments = [
          'Great event! Very informative.',
          'Excellent speakers and content.',
          'Well organized and engaging.',
          'Learned a lot, would attend again.',
          'Good networking opportunities.',
          'Could be improved with better food.',
          'Too crowded, need more space.',
          'Amazing experience!',
          'Very professional and well-run.',
          'Highly recommend to others.'
        ];
        
        feedback.push({
          id: uuidv4(),
          registration_id: reg.id,
          rating: rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
          submitted_at: new Date(attendanceRecord.checked_out_at).toISOString()
        });
      }
    }
  });
  
  return feedback;
}

// Populate database with mock data
export async function populateMockData(): Promise<void> {
  try {
    console.log('Populating database with mock data...');
    
    // Check if data already exists
    const existingEvents = await db.events.count();
    const existingColleges = await db.colleges.count();
    
    if (existingEvents > 0 || existingColleges > 0) {
      console.log('Database already has data, skipping mock data population');
      return;
    }
    
    // Clear existing data only if it's empty
    await db.feedback.clear();
    await db.attendance.clear();
    await db.registrations.clear();
    await db.events.clear();
    await db.students.clear();
    await db.colleges.clear();
    
    // Insert colleges
    await db.colleges.bulkAdd(colleges);
    
    // Insert students
    await db.students.bulkAdd(students);
    
    // Insert events
    await db.events.bulkAdd(events);
    
    // Generate and insert registrations
    const registrations = generateRegistrations();
    await db.registrations.bulkAdd(registrations);
    
    // Generate and insert attendance
    const attendance = generateAttendance(registrations);
    await db.attendance.bulkAdd(attendance);
    
    // Generate and insert feedback
    const feedback = generateFeedback(registrations, attendance);
    await db.feedback.bulkAdd(feedback);
    
    console.log('Mock data populated successfully!');
    console.log(`- ${colleges.length} colleges`);
    console.log(`- ${students.length} students`);
    console.log(`- ${events.length} events`);
    console.log(`- ${registrations.length} registrations`);
    console.log(`- ${attendance.length} attendance records`);
    console.log(`- ${feedback.length} feedback records`);
    
  } catch (error) {
    console.error('Error populating mock data:', error);
    throw error;
  }
}

// Clear all data
export async function clearMockData(): Promise<void> {
  try {
    console.log('Clearing mock data...');
    
    await db.feedback.clear();
    await db.attendance.clear();
    await db.registrations.clear();
    await db.events.clear();
    await db.students.clear();
    await db.colleges.clear();
    
    console.log('Mock data cleared successfully!');
  } catch (error) {
    console.error('Error clearing mock data:', error);
    throw error;
  }
}

// Ensure essential data exists (colleges) without clearing events
export async function ensureEssentialData(): Promise<void> {
  try {
    console.log('Ensuring essential data exists...');
    
    // Check if colleges exist
    const existingColleges = await db.colleges.count();
    
    if (existingColleges === 0) {
      console.log('Adding colleges to database...');
      await db.colleges.bulkAdd(colleges);
      console.log('Colleges added successfully');
    } else {
      console.log('Colleges already exist, skipping');
    }
  } catch (error) {
    console.error('Error ensuring essential data:', error);
    throw error;
  }
}