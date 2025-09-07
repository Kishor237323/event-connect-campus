import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

// Mock database - replace with actual database implementation
let registrations = [];
let events = []; // This should be imported from your events data

// POST /api/registrations - Register student for event
router.post('/', async (req, res) => {
  try {
    const { name, srn, phone, email, event_id, college_id } = req.body;

    // Validation
    if (!name || !srn || !phone || !email || !event_id || !college_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, srn, phone, email, event_id, college_id'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // Check for duplicate registration (same SRN for same event)
    const existingRegistration = registrations.find(
      reg => reg.srn.toLowerCase() === srn.toLowerCase() && reg.event_id === event_id
    );

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Create new registration
    const registration = {
      id: uuidv4(),
      name: name.trim(),
      srn: srn.trim().toUpperCase(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      event_id,
      college_id,
      registered_at: new Date().toISOString(),
      status: 'confirmed'
    };

    // Add to registrations
    registrations.push(registration);

    // TODO: In a real implementation, you would:
    // 1. Insert into database
    // 2. Update event registration count
    // 3. Send confirmation email
    
    console.log(`New registration: ${name} (${srn}) registered for event ${event_id}`);
    console.log(`Total registrations for this event: ${registrations.filter(r => r.event_id === event_id).length}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        registration_id: registration.id,
        event_id: registration.event_id,
        student_name: registration.name,
        registered_at: registration.registered_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// GET /api/registrations/check - Check if student is already registered
router.get('/check', async (req, res) => {
  try {
    const { event_id, srn } = req.query;

    if (!event_id || !srn) {
      return res.status(400).json({
        success: false,
        message: 'event_id and srn are required'
      });
    }

    const isRegistered = registrations.some(
      reg => reg.srn.toLowerCase() === srn.toLowerCase() && reg.event_id === event_id
    );

    res.json({
      success: true,
      isRegistered,
      message: isRegistered ? 'Student is registered for this event' : 'Student is not registered for this event'
    });

  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking registration status'
    });
  }
});

// GET /api/registrations/count/:eventId - Get registration count for an event
router.get('/count/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { college_id } = req.query;

    let eventRegistrations = registrations.filter(reg => reg.event_id === eventId);

    // Filter by college if provided
    if (college_id) {
      eventRegistrations = eventRegistrations.filter(reg => reg.college_id === college_id);
    }

    res.json({
      success: true,
      data: {
        event_id: eventId,
        registration_count: eventRegistrations.length,
        college_id: college_id || 'all'
      }
    });

  } catch (error) {
    console.error('Get registration count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration count'
    });
  }
});

// GET /api/registrations/event/:eventId - Get all registrations for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { college_id } = req.query;

    let eventRegistrations = registrations.filter(reg => reg.event_id === eventId);

    // Filter by college if provided
    if (college_id) {
      eventRegistrations = eventRegistrations.filter(reg => reg.college_id === college_id);
    }

    res.json({
      success: true,
      data: {
        event_id: eventId,
        total_registrations: eventRegistrations.length,
        registrations: eventRegistrations.map(reg => ({
          id: reg.id,
          name: reg.name,
          srn: reg.srn,
          phone: reg.phone,
          email: reg.email,
          registered_at: reg.registered_at,
          status: reg.status
        }))
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event registrations'
    });
  }
});

// GET /api/registrations/student/:srn - Get all registrations for a student
router.get('/student/:srn', async (req, res) => {
  try {
    const { srn } = req.params;
    const { college_id } = req.query;

    let studentRegistrations = registrations.filter(
      reg => reg.srn.toLowerCase() === srn.toLowerCase()
    );

    // Filter by college if provided
    if (college_id) {
      studentRegistrations = studentRegistrations.filter(reg => reg.college_id === college_id);
    }

    res.json({
      success: true,
      data: {
        srn: srn.toUpperCase(),
        total_registrations: studentRegistrations.length,
        registrations: studentRegistrations.map(reg => ({
          id: reg.id,
          event_id: reg.event_id,
          registered_at: reg.registered_at,
          status: reg.status
        }))
      }
    });

  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student registrations'
    });
  }
});

// DELETE /api/registrations/:registrationId - Cancel registration
router.delete('/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registrationIndex = registrations.findIndex(reg => reg.id === registrationId);

    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const removedRegistration = registrations.splice(registrationIndex, 1)[0];

    console.log(`Registration cancelled: ${removedRegistration.name} (${removedRegistration.srn}) for event ${removedRegistration.event_id}`);

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        cancelled_registration_id: registrationId,
        event_id: removedRegistration.event_id
      }
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling registration'
    });
  }
});

export default router;
