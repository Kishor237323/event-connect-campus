import express from 'express';
import { executeQuery } from '../database/connection.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { college_id } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (college_id) {
      whereClause = 'WHERE e.college_id = ?';
      params.push(college_id);
    }
    
    // Total events
    const totalEventsQuery = `SELECT COUNT(*) as total FROM events e ${whereClause}`;
    const [totalEventsResult] = await executeQuery(totalEventsQuery, params);
    
    // Active events
    const activeEventsQuery = `SELECT COUNT(*) as total FROM events e ${whereClause} AND e.status = 'active'`;
    const [activeEventsResult] = await executeQuery(activeEventsQuery, params);
    
    // Total registrations
    const registrationsQuery = `
      SELECT COUNT(*) as total 
      FROM registrations r 
      JOIN events e ON r.event_id = e.id 
      ${whereClause.replace('e.', 'e.')}
    `;
    const [registrationsResult] = await executeQuery(registrationsQuery, params);
    
    // Total attendance
    const attendanceQuery = `
      SELECT COUNT(*) as total 
      FROM attendance a 
      JOIN registrations r ON a.registration_id = r.id 
      JOIN events e ON r.event_id = e.id 
      ${whereClause.replace('e.', 'e.')}
    `;
    const [attendanceResult] = await executeQuery(attendanceQuery, params);
    
    // Average attendance rate
    const avgAttendanceQuery = `
      SELECT 
        CASE 
          WHEN COUNT(r.id) > 0 THEN (COUNT(a.id) * 100.0 / COUNT(r.id))
          ELSE 0 
        END as rate
      FROM registrations r 
      JOIN events e ON r.event_id = e.id 
      LEFT JOIN attendance a ON r.id = a.registration_id 
      ${whereClause.replace('e.', 'e.')}
    `;
    const [avgAttendanceResult] = await executeQuery(avgAttendanceQuery, params);
    
    // Average rating
    const avgRatingQuery = `
      SELECT AVG(f.rating) as average 
      FROM feedback f 
      JOIN registrations r ON f.registration_id = r.id 
      JOIN events e ON r.event_id = e.id 
      ${whereClause.replace('e.', 'e.')}
    `;
    const [avgRatingResult] = await executeQuery(avgRatingQuery, params);
    
    const stats = {
      total_events: totalEventsResult.total,
      active_events: activeEventsResult.total,
      total_registrations: registrationsResult.total,
      total_attendance: attendanceResult.total,
      average_attendance_rate: parseFloat(avgAttendanceResult.rate || 0),
      average_rating: parseFloat(avgRatingResult.average || 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// Get event popularity report
router.get('/event-popularity', async (req, res) => {
  try {
    const { college_id, limit = 10 } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (college_id) {
      whereClause = 'WHERE e.college_id = ?';
      params.push(college_id);
    }
    
    const query = `
      SELECT 
        e.id,
        e.title,
        e.event_type,
        e.category,
        e.start_date,
        c.name as college_name,
        COUNT(r.id) as registration_count,
        COUNT(a.id) as attendance_count,
        AVG(f.rating) as average_rating
      FROM events e
      JOIN colleges c ON e.college_id = c.id
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN attendance a ON r.id = a.registration_id
      LEFT JOIN feedback f ON r.id = f.registration_id
      ${whereClause}
      GROUP BY e.id, e.title, e.event_type, e.category, e.start_date, c.name
      ORDER BY registration_count DESC
      LIMIT ?
    `;
    
    params.push(parseInt(limit));
    const events = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: events
    });
    
  } catch (error) {
    console.error('Error fetching event popularity report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event popularity report',
      error: error.message
    });
  }
});

// Get student participation report
router.get('/student-participation', async (req, res) => {
  try {
    const { college_id, limit = 10 } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (college_id) {
      whereClause = 'WHERE s.college_id = ?';
      params.push(college_id);
    }
    
    const query = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.major,
        s.year,
        c.name as college_name,
        COUNT(r.id) as events_registered,
        COUNT(a.id) as events_attended,
        AVG(f.rating) as average_rating
      FROM students s
      JOIN colleges c ON s.college_id = c.id
      LEFT JOIN registrations r ON s.id = r.student_id
      LEFT JOIN attendance a ON r.id = a.registration_id
      LEFT JOIN feedback f ON r.id = f.registration_id
      ${whereClause}
      GROUP BY s.id, s.name, s.email, s.major, s.year, c.name
      ORDER BY events_registered DESC
      LIMIT ?
    `;
    
    params.push(parseInt(limit));
    const students = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: students
    });
    
  } catch (error) {
    console.error('Error fetching student participation report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student participation report',
      error: error.message
    });
  }
});

export default router;
