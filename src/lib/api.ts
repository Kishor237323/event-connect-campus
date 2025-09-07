// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Events API
export const eventsApi = {
  // Get all events with filters
  async getEvents(filters: {
    college_id?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const params = new URLSearchParams();
    
    if (filters.college_id) params.append('college_id', filters.college_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    
    return apiRequest<{ success: boolean; data: { events: any[]; total: number } }>(endpoint);
  },

  // Get event by ID
  async getEvent(id: string) {
    return apiRequest<{ success: boolean; data: any }>(`/events/${id}`);
  },

  // Create new event
  async createEvent(eventData: {
    college_id: string;
    title: string;
    description?: string;
    event_type: string;
    category: string;
    start_date: string;
    end_date: string;
    location?: string;
    capacity?: number;
    created_by?: string;
  }) {
    return apiRequest<{ success: boolean; message: string; data: any }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Update event
  async updateEvent(id: string, updates: Partial<any>) {
    return apiRequest<{ success: boolean; message: string; data: any }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete event
  async deleteEvent(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Publish event
  async publishEvent(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}/publish`, {
      method: 'PATCH',
    });
  },

  // Cancel event
  async cancelEvent(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// Colleges API
export const collegesApi = {
  // Get all colleges
  async getColleges() {
    return apiRequest<{ success: boolean; data: any[] }>('/colleges');
  },

  // Get college by ID
  async getCollege(id: string) {
    return apiRequest<{ success: boolean; data: any }>(`/colleges/${id}`);
  },
};

// Reports API
export const reportsApi = {
  // Get student statistics
  async getStudentStats(college_id?: string) {
    const params = college_id ? `?college_id=${college_id}` : '';
    return apiRequest<{ success: boolean; data: any }>(`/reports/student-stats${params}`);
  },
  // Get dashboard statistics
  async getDashboardStats(college_id?: string) {
    const params = college_id ? `?college_id=${college_id}` : '';
    return apiRequest<{ success: boolean; data: any }>(`/reports/dashboard${params}`);
  },

  // Get event popularity report
  async getEventPopularityReport(college_id?: string, limit?: number) {
    const params = new URLSearchParams();
    if (college_id) params.append('college_id', college_id);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/reports/event-popularity?${queryString}` : '/reports/event-popularity';
    
    return apiRequest<{ success: boolean; data: any[] }>(endpoint);
  },

  // Get student participation report
  async getStudentParticipationReport(college_id?: string, limit?: number) {
    const params = new URLSearchParams();
    if (college_id) params.append('college_id', college_id);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/reports/student-participation?${queryString}` : '/reports/student-participation';
    
    return apiRequest<{ success: boolean; data: any[] }>(endpoint);
  },
};

export const studentsApi = {
  async getStudents(filters: { college_id?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.college_id) params.append('college_id', filters.college_id);
    const queryString = params.toString();
    const endpoint = queryString ? `/students?${queryString}` : '/students';
    return apiRequest<{ success: boolean; data: { students: any[] } }>(endpoint);
  },
};

export { ApiError };