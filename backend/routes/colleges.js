import express from 'express';
import { executeQuery } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new college with a UUID as the id
router.post('/', async (req, res) => {
  try {
    const { name, domain } = req.body;
    const collegeId = uuidv4();
    await executeQuery('INSERT INTO colleges (id, name, domain) VALUES (?, ?, ?)', [collegeId, name, domain]);
    res.status(201).json({
      success: true,
      message: 'College created successfully',
      collegeId
    });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create college',
      error: error.message
    });
  }
});

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM colleges ORDER BY name';
    const colleges = await executeQuery(query);
    
    res.json({
      success: true,
      data: colleges
    });
    
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges',
      error: error.message
    });
  }
});

// Update college name and ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain } = req.body;
    // Generate a new unique college ID using UUID v4

   

    
    // Start transaction: update college, update events
    const newCollegeId = uuidv4();
    await executeQuery('START TRANSACTION');
    await executeQuery('UPDATE colleges SET id = ?, name = ?, domain = ? WHERE id = ?', [newCollegeId, name, domain, id]);
    await executeQuery('UPDATE events SET college_id = ? WHERE college_id = ?', [newCollegeId, id]);
    await executeQuery('COMMIT');

    res.json({
      success: true,
      message: 'College and related events updated successfully',
      newCollegeId
    });
  } catch (error) {
    await executeQuery('ROLLBACK');
    console.error('Error updating college and events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update college and events',
      error: error.message
    });
  }
});

// Get college by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM colleges WHERE id = ?';
    const colleges = await executeQuery(query, [id]);
    
    if (colleges.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    res.json({
      success: true,
      data: colleges[0]
    });
    
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college',
      error: error.message
    });
  }
});

export default router;
