// Data service hooks using REST API
import { useState, useEffect, useCallback } from 'react';
import { collegesApi, reportsApi, ApiError } from '@/lib/api';

export interface DashboardStats {
  total_events: number;
  active_events: number;
  total_registrations: number;
  total_attendance: number;
  average_attendance_rate: number;
  average_rating: number;
}

export function useDataService() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data service
  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test API connection by fetching colleges
      await collegesApi.getColleges();
      
      setIsInitialized(true);
      console.log('Data service initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to initialize data service';
      
      setError(errorMessage);
      console.error('Error initializing data service:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return {
    isInitialized,
    isLoading,
    error,
    initializeData,
  };
}

// Hook for fetching colleges
export function useColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await collegesApi.getColleges();
      
      if (response.success) {
        setColleges(response.data);
      } else {
        throw new Error('Failed to fetch colleges');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch colleges';
      
      setError(errorMessage);
      console.error('Error fetching colleges:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    colleges,
    isLoading,
    error,
    fetchColleges,
    refetch: fetchColleges,
  };
}

// Hook for dashboard statistics
export function useDashboardStats(collegeId?: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (id?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reportsApi.getDashboardStats(id || collegeId);
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch dashboard statistics');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch dashboard statistics';
      
      setError(errorMessage);
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [collegeId]);

  // Auto-fetch stats when collegeId changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    refetch: fetchStats,
  };
}

// Hook for event popularity report
export function useEventPopularityReport() {
  const [report, setReport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (collegeId?: string, limit?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reportsApi.getEventPopularityReport(collegeId, limit);
      
      if (response.success) {
        setReport(response.data);
      } else {
        throw new Error('Failed to fetch event popularity report');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch event popularity report';
      
      setError(errorMessage);
      console.error('Error fetching event popularity report:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    report,
    isLoading,
    error,
    fetchReport,
    refetch: fetchReport,
  };
}

// Hook for student participation report
export function useStudentParticipationReport() {
  const [report, setReport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (collegeId?: string, limit?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reportsApi.getStudentParticipationReport(collegeId, limit);
      
      if (response.success) {
        setReport(response.data);
      } else {
        throw new Error('Failed to fetch student participation report');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch student participation report';
      
      setError(errorMessage);
      console.error('Error fetching student participation report:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    report,
    isLoading,
    error,
    fetchReport,
    refetch: fetchReport,
  };
}