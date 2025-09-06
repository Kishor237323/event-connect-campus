// Event service for CRUD operations
import { db } from './database';
import { CreateEventRequest, Event, UpdateEventRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Create a new event
export async function createEvent(eventData: CreateEventRequest, collegeId: string, createdBy: string): Promise<Event> {
  try {
    const now = new Date().toISOString();
    
    const newEvent: Event = {
      id: uuidv4(),
      college_id: collegeId,
      title: eventData.title,
      description: eventData.description || '',
      event_type: eventData.event_type,
      category: eventData.category,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      location: eventData.location,
      capacity: eventData.capacity,
      status: 'draft',
      created_by: createdBy,
      created_at: now,
      updated_at: now
    };

    await db.events.add(newEvent);
    
    // Verify the event was stored
    const storedEvent = await db.events.get(newEvent.id);
    console.log('Event created successfully:', newEvent.id);
    console.log('Stored event verification:', storedEvent);
    
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
}

// Get all events with optional filters
export async function getEvents(filters: {
  college_id?: string;
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ events: Event[]; total: number }> {
  try {
    console.log('getEvents called with filters:', filters);
    
    let query = db.events.orderBy('created_at');

    if (filters.college_id) {
      query = query.filter(event => event.college_id === filters.college_id);
    }

    if (filters.status) {
      query = query.filter(event => event.status === filters.status);
    }

    if (filters.category) {
      query = query.filter(event => event.category === filters.category);
    }

    const total = await query.count();
    const events = await query
      .offset(filters.offset || 0)
      .limit(filters.limit || 50)
      .reverse()
      .toArray();

    console.log('getEvents result:', { events: events.length, total });
    console.log('Events retrieved:', events.map(e => ({ id: e.id, title: e.title, college_id: e.college_id })));
    return { events, total };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
}

// Get single event by ID
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const event = await db.events.get(eventId);
    return event || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
}

// Update an event
export async function updateEvent(eventId: string, eventData: UpdateEventRequest): Promise<Event> {
  try {
    const existingEvent = await db.events.get(eventId);
    if (!existingEvent) {
      throw new Error('Event not found');
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...eventData,
      updated_at: new Date().toISOString()
    };

    await db.events.put(updatedEvent);
    
    console.log('Event updated successfully:', eventId);
    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
}

// Delete an event
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    // Check if event exists
    const event = await db.events.get(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Delete related data first
    const registrations = await db.registrations
      .where('event_id')
      .equals(eventId)
      .toArray();

    const registrationIds = registrations.map(r => r.id);

    // Delete attendance records
    if (registrationIds.length > 0) {
      await db.attendance
        .where('registration_id')
        .anyOf(registrationIds)
        .delete();
    }

    // Delete feedback records
    if (registrationIds.length > 0) {
      await db.feedback
        .where('registration_id')
        .anyOf(registrationIds)
        .delete();
    }

    // Delete registrations
    await db.registrations
      .where('event_id')
      .equals(eventId)
      .delete();

    // Delete the event
    await db.events.delete(eventId);
    
    console.log('Event deleted successfully:', eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}

// Publish an event (change status from draft to active)
export async function publishEvent(eventId: string): Promise<Event> {
  try {
    const event = await db.events.get(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'draft') {
      throw new Error('Only draft events can be published');
    }

    const updatedEvent = await updateEvent(eventId, { status: 'active' });
    return updatedEvent;
  } catch (error) {
    console.error('Error publishing event:', error);
    throw new Error('Failed to publish event');
  }
}

// Cancel an event
export async function cancelEvent(eventId: string): Promise<Event> {
  try {
    const event = await db.events.get(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status === 'completed') {
      throw new Error('Completed events cannot be cancelled');
    }

    const updatedEvent = await updateEvent(eventId, { status: 'cancelled' });
    return updatedEvent;
  } catch (error) {
    console.error('Error cancelling event:', error);
    throw new Error('Failed to cancel event');
  }
}

// Get events by college
export async function getEventsByCollege(collegeId: string): Promise<Event[]> {
  try {
    const events = await db.events
      .where('college_id')
      .equals(collegeId)
      .reverse()
      .sortBy('created_at');
    
    return events;
  } catch (error) {
    console.error('Error fetching events by college:', error);
    throw new Error('Failed to fetch events by college');
  }
}

// Get upcoming events
export async function getUpcomingEvents(collegeId?: string, limit: number = 10): Promise<Event[]> {
  try {
    const now = new Date().toISOString();
    
    let query = db.events
      .where('start_date')
      .above(now)
      .and(event => event.status === 'active');

    if (collegeId) {
      query = query.and(event => event.college_id === collegeId);
    }

    const events = await query
      .limit(limit)
      .sortBy('start_date');
    
    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
}

// Debug function to check database state
export async function debugDatabaseState(): Promise<void> {
  try {
    console.log('=== DATABASE DEBUG ===');
    
    // Check if database is open
    console.log('Database isOpen:', db.isOpen());
    
    // Get all events count
    const totalEvents = await db.events.count();
    console.log('Total events in database:', totalEvents);
    
    // Get all events
    const allEvents = await db.events.toArray();
    console.log('All events:', allEvents.map(e => ({ 
      id: e.id, 
      title: e.title, 
      college_id: e.college_id, 
      status: e.status,
      created_at: e.created_at 
    })));
    
    // Check colleges
    const totalColleges = await db.colleges.count();
    console.log('Total colleges in database:', totalColleges);
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug database error:', error);
  }
}
