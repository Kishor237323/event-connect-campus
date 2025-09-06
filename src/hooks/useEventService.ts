// Event service hooks using REST API
import { useState, useCallback } from 'react';
import { eventsApi, ApiError } from '@/lib/api';
import { CreateEventRequest, Event } from '@/types';

// Hook for creating events
export function useCreateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(async (eventData: CreateEventRequest, collegeId: string, createdBy: string = 'admin') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eventsApi.createEvent({
        ...eventData,
        college_id: collegeId,
        created_by: createdBy,
      });

      if (response.success) {
        console.log('Event created successfully:', response.data.id);
        return response.data;
      } else {
        throw new Error('Failed to create event');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to create event';
      
      setError(errorMessage);
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createNewEvent: createEvent,
    isLoading,
    error,
    clearError: () => setError(null),
  };

}

// Hook for fetching events
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEvents = useCallback(async (filters: {
    college_id?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching events with filters:', filters);
      const response = await eventsApi.getEvents(filters);
      
      if (response.success) {
        console.log('Events fetched successfully:', response.data.events.length);
        setEvents(response.data.events);
        setTotal(response.data.total);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch events';
      
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    events,
    isLoading,
    error,
    total,
    fetchEvents,
    refetch: fetchEvents,
  };
}

// Hook for deleting events
export function useDeleteEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eventsApi.deleteEvent(eventId);
      
      if (response.success) {
        console.log('Event deleted successfully:', eventId);
        return true;
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to delete event';
      
      setError(errorMessage);
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteEventData: deleteEvent,
    isLoading,
    error,
    clearError: () => setError(null),
  };

}

// Hook for publishing events
export function usePublishEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eventsApi.publishEvent(eventId);
      
      if (response.success) {
        console.log('Event published successfully:', eventId);
        return true;
      } else {
        throw new Error('Failed to publish event');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to publish event';
      
      setError(errorMessage);
      console.error('Error publishing event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    publishEvent,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Hook for cancelling events
export function useCancelEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eventsApi.cancelEvent(eventId);
      
      if (response.success) {
        console.log('Event cancelled successfully:', eventId);
        return true;
      } else {
        throw new Error('Failed to cancel event');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to cancel event';
      
      setError(errorMessage);
      console.error('Error cancelling event:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cancelEvent,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}