import express from 'express';
import { executeQuery } from '../database/connection.js';

const router = express.Router();

// GET /api/students - Get all students from database
router.get('/', async (req, res) => {
  try {
    const { college_id, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        s.id,
        s.name,
        s.student_id,
        s.email,
        s.college_id,
        s.major,
        s.year,
        s.created_at,
        COUNT(r.id) as total_registrations
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
    `;
    
    const params = [];
    
    if (college_id) {
      query += ` WHERE s.college_id = ?`;
      params.push(college_id);
    }
    
    query += `
      GROUP BY s.id, s.name, s.student_id, s.email, s.college_id, s.major, s.year, s.created_at
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));

    const students = await executeQuery(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(DISTINCT s.id) as total FROM students s`;
    const countParams = [];
    
    if (college_id) {
      countQuery += ` WHERE s.college_id = ?`;
      countParams.push(college_id);
    }
    
    const [{ total }] = await executeQuery(countQuery, countParams);

    res.json({
      success: true,
      data: {
        students,
        total: parseInt(total),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// GET /api/students/stats - Get student statistics from database
router.get('/stats', async (req, res) => {
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

// GET /api/students/:id - Get specific student details from database
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const studentQuery = `
      SELECT 
        s.*,
        COUNT(r.id) as total_registrations
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
      WHERE s.id = ?
      GROUP BY s.id
    `;

    const [student] = await executeQuery(studentQuery, [id]);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get student's registrations
    const registrationsQuery = `
      SELECT 
        r.*,
        e.title as event_title,
        e.start_date as event_start_date
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.student_id = ?
      ORDER BY r.registered_at DESC
    `;

    const registrations = await executeQuery(registrationsQuery, [id]);

    res.json({
      success: true,
      data: {
        ...student,
        registrations
      }
    });

  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student details',
      error: error.message
    });
  }
});

export default router;
