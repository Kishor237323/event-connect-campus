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
    
    // Optimized: Fetch all stats in a single query using subqueries
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM events e ${whereClause}) as total_events,
        (SELECT COUNT(*) FROM events e ${whereClause ? `${whereClause} AND e.status = 'active'` : `WHERE e.status = 'active'`}) as active_events,
        (SELECT COUNT(*) FROM registrations r JOIN events e ON r.event_id = e.id ${whereClause}) as total_registrations,
        (SELECT COUNT(*) FROM attendance a JOIN registrations r ON a.registration_id = r.id JOIN events e ON r.event_id = e.id ${whereClause}) as total_attendance,
        (SELECT 
          CASE 
            WHEN COUNT(r.id) > 0 THEN (COUNT(a.id) * 100.0 / COUNT(r.id))
            ELSE 0 
          END
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         LEFT JOIN attendance a ON r.id = a.registration_id 
         ${whereClause}
        ) as average_attendance_rate,
        (SELECT AVG(f.rating) FROM feedback f JOIN registrations r ON f.registration_id = r.id JOIN events e ON r.event_id = e.id ${whereClause}) as average_rating
    `;
    
    // Build params array based on number of subqueries that use college_id
    const queryParams = college_id ? [college_id, college_id, college_id, college_id, college_id, college_id] : [];
    const [statsResult] = await executeQuery(statsQuery, queryParams);
    
    const stats = {
      total_events: statsResult.total_events,
      active_events: statsResult.active_events,
      total_registrations: statsResult.total_registrations,
      total_attendance: statsResult.total_attendance,
      average_attendance_rate: parseFloat(statsResult.average_attendance_rate || 0),
      average_rating: parseFloat(statsResult.average_rating || 0)
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

// Get student statistics
router.get('/student-stats', async (req, res) => {
  try {
    const { college_id } = req.query;

    let whereClause = '';
    const params = [];
    
    if (college_id) {
      whereClause = 'WHERE s.college_id = ?';
      params.push(college_id);
    }

    const statsQuery = `
      SELECT 
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT r.event_id) as events_with_registrations,
        CASE 
          WHEN COUNT(DISTINCT s.id) > 0 THEN COUNT(DISTINCT r.id) / COUNT(DISTINCT s.id)
          ELSE 0 
        END as avg_registrations_per_student
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
      ${whereClause}
    `;

    const [stats] = await executeQuery(statsQuery, params);

    // Get top active students
    const topStudentsQuery = `
      SELECT 
        s.name,
        s.student_id,
        COUNT(r.id) as registration_count
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
      ${whereClause}
      GROUP BY s.id, s.name, s.student_id
      HAVING COUNT(r.id) > 0
      ORDER BY registration_count DESC
      LIMIT 5
    `;

    const topStudents = await executeQuery(topStudentsQuery, params);

    res.json({
      success: true,
      data: {
        total_students: parseInt(stats.total_students) || 0,
        total_registrations: parseInt(stats.total_registrations) || 0,
        events_with_registrations: parseInt(stats.events_with_registrations) || 0,
        avg_registrations_per_student: parseFloat(stats.avg_registrations_per_student) || 0,
        top_students: topStudents
      }
    });

  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student statistics',
      error: error.message
    });
  }
});

export default router;
