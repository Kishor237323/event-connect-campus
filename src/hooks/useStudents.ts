import { useState, useCallback, useEffect } from 'react';
import { ApiError, studentsApi } from '@/lib/api';
import { Student } from '@/types';

export function useStudents(filtersArg: { college_id?: string } = {}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (filters: { college_id?: string } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studentsApi.getStudents(filters);
      if (response.success) {
        setStudents(Array.isArray(response.data) ? response.data : response.data.students);
      } else {
        throw new Error('Failed to fetch students');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to fetch students';
      setError(errorMessage);
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(filtersArg);
  }, [JSON.stringify(filtersArg)]);

  return {
    students,
    isLoading,
    error,
    fetchStudents,
    refetch: fetchStudents,
  };
}
