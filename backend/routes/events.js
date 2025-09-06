import express from 'express';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all events with filters
router.get('/', async (req, res) => {
  try {
    const { college_id, status, category, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT e.*, c.name as college_name 
      FROM events e 
      JOIN colleges c ON e.college_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    if (college_id) {
      query += ' AND e.college_id = ?';
      params.push(college_id);
    }
    
    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }
    
    if (category && category !== 'All') {
      query += ' AND e.category = ?';
      params.push(category);
    }
    
    // Ensure limit and offset are valid numbers
    const validLimit = parseInt(limit) || 50;
    const validOffset = parseInt(offset) || 0;
    
    query += ' ORDER BY e.created_at DESC LIMIT ? OFFSET ?';
    params.push(validLimit, validOffset);
    
    const events = await executeQuery(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM events e WHERE 1=1';
    const countParams = [];
    
    if (college_id) {
      countQuery += ' AND e.college_id = ?';
      countParams.push(college_id);
    }
    
    if (status) {
      countQuery += ' AND e.status = ?';
      countParams.push(status);
    }
    
    if (category && category !== 'All') {
      countQuery += ' AND e.category = ?';
      countParams.push(category);
    }
    
    const [countResult] = await executeQuery(countQuery, countParams);
    const total = countResult.total;
    
    res.json({
      success: true,
      data: { events, total }
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT e.*, c.name as college_name 
      FROM events e 
      JOIN colleges c ON e.college_id = c.id 
      WHERE e.id = ?
    `;
    
    const events = await executeQuery(query, [id]);
    
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: events[0]
    });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const {
      college_id,
      title,
      description = '',
      event_type,
      category,
      start_date,
      end_date,
      location = '',
      capacity = null,
      created_by = 'admin'
    } = req.body;
    
    // Validate required fields
    if (!college_id || !title || !event_type || !category || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const eventId = uuidv4();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Fetch the college name for the given college_id
    const collegeResult = await executeQuery('SELECT name FROM colleges WHERE id = ?', [college_id]);
    const college_name = collegeResult.length > 0 ? collegeResult[0].name : '';
    
    // Convert ISO datetime strings to MySQL DATETIME format
    const formatDateTime = (isoString) => {
      return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
    };
    
    const query = `
      INSERT INTO events (id, college_id, college_name, title, description, event_type, category, start_date, end_date, location, capacity, status, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
    `;
    
    const params = [
      eventId, college_id, college_name, title, description, event_type, category,
      formatDateTime(start_date), formatDateTime(end_date), location, capacity, created_by, now, now
    ];
    
    await executeQuery(query, params);
    
    // Fetch the created event
    const createdEvent = await executeQuery(
      'SELECT e.*, c.name as college_name FROM events e JOIN colleges c ON e.college_id = c.id WHERE e.id = ?',
      [eventId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: createdEvent[0]
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    console.error('SQL Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    console.error('Request body:', req.body);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
      details: {
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage
      }
    });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const allowedFields = ['title', 'description', 'event_type', 'category', 'start_date', 'end_date', 'location', 'capacity', 'status'];
    const updateFields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    updateFields.push('updated_at = ?');
    params.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
    params.push(id);
    
    const query = `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const result = await executeQuery(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Fetch updated event
    const updatedEvent = await executeQuery(
      'SELECT e.*, c.name as college_name FROM events e JOIN colleges c ON e.college_id = c.id WHERE e.id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent[0]
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM events WHERE id = ?';
    const result = await executeQuery(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// Publish event
router.patch('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'UPDATE events SET status = "active", updated_at = ? WHERE id = ?';
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await executeQuery(query, [now, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event published successfully'
    });
    
  } catch (error) {
    console.error('Error publishing event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish event',
      error: error.message
    });
  }
});

// Cancel event
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'UPDATE events SET status = "cancelled", updated_at = ? WHERE id = ?';
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await executeQuery(query, [now, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event cancelled successfully'
    });
    
  } catch (error) {
    console.error('Error cancelling event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel event',
      error: error.message
    });
  }
});

export default router;
