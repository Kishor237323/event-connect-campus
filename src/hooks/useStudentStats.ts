import { useState, useCallback, useEffect } from 'react';
import { ApiError, reportsApi } from '@/lib/api';

export function useStudentStats(college_id?: string) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reportsApi.getStudentStats(college_id);
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch student stats');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to fetch student stats';
      setError(errorMessage);
      console.error('Error fetching student stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [college_id]);

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
