import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api';

export interface StudentRegistrationData {
  name: string;
  srn: string;
  phone: string;
  email: string;
  event_id: string;
  college_id: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerForEvent = useCallback(async (registrationData: StudentRegistrationData): Promise<RegistrationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Registration failed', response.status);
      }

      return {
        success: true,
        message: data.message || 'Registration successful!',
        data: data.data
      };
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to register for event';
      
      setError(errorMessage);
      console.error('Registration error:', err);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkRegistrationStatus = useCallback(async (eventId: string, srn: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/registrations/check?event_id=${eventId}&srn=${srn}`
      );
      
      const data = await response.json();
      return data.isRegistered || false;
    } catch (err) {
      console.error('Error checking registration status:', err);
      return false;
    }
  }, []);

  return {
    registerForEvent,
    checkRegistrationStatus,
    isLoading,
    error,
  };
}
