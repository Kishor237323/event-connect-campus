import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api';

export interface EventRegistrationCount {
  event_id: string;
  registration_count: number;
  college_id: string;
}

export function useEventRegistrations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRegistrationCount = useCallback(async (eventId: string, collegeId?: string): Promise<EventRegistrationCount | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const url = collegeId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations/count/${eventId}?college_id=${collegeId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations/count/${eventId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Failed to fetch registration count', response.status);
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch registration count';
      
      setError(errorMessage);
      console.error('Registration count error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEventRegistrations = useCallback(async (eventId: string, collegeId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = collegeId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations/event/${eventId}?college_id=${collegeId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations/event/${eventId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Failed to fetch event registrations', response.status);
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch event registrations';
      
      setError(errorMessage);
      console.error('Event registrations error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getRegistrationCount,
    getEventRegistrations,
    isLoading,
    error,
  };
}
