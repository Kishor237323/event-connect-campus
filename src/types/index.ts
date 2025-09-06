// TypeScript types and interfaces for Campus Event Management Platform

export interface College {
  id: string;
  name: string;
  domain: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  college_id: string;
  title: string;
  description?: string;
  event_type: 'workshop' | 'seminar' | 'conference' | 'social' | 'sports' | 'cultural' | 'hackathon';
  category: 'academic' | 'cultural' | 'professional' | 'sports' | 'social';
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  college_id: string;
  student_id: string;
  name: string;
  email: string;
  major?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  student_id: string;
  registered_at: string;
  status: 'registered' | 'cancelled' | 'waitlisted';
}

export interface Attendance {
  id: string;
  registration_id: string;
  checked_in_at?: string;
  checked_out_at?: string;
  status: 'present' | 'absent' | 'late';
  created_at: string;
}

export interface Feedback {
  id: string;
  registration_id: string;
  rating: number;
  comment?: string;
  submitted_at: string;
}

// API Request/Response types
export interface CreateEventRequest {
  title: string;
  description?: string;
  event_type: 'workshop' | 'seminar' | 'conference' | 'social' | 'sports' | 'cultural' | 'hackathon';
  category: 'academic' | 'cultural' | 'professional' | 'sports' | 'social';
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  college_id: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: 'draft' | 'active' | 'cancelled' | 'completed';
}

export interface RegisterStudentRequest {
  student_id: string;
}

export interface CheckInRequest {
  student_id: string;
  checked_in_at?: string;
}

export interface CheckOutRequest {
  student_id: string;
  checked_out_at?: string;
}

export interface SubmitFeedbackRequest {
  student_id: string;
  rating: number;
  comment?: string;
}

// Report types
export interface EventPopularityReport {
  event_id: string;
  title: string;
  registrations: number;
  capacity: number;
  attendance: number;
  attendance_rate: number;
  average_rating: number;
  total_feedback: number;
}

export interface StudentParticipationReport {
  student_id: string;
  name: string;
  major?: string;
  events_registered: number;
  events_attended: number;
  attendance_rate: number;
  average_rating_given: number;
}

export interface MonthlyTrendsReport {
  month: string;
  events_count: number;
  total_registrations: number;
  total_attendance: number;
  attendance_rate: number;
  average_rating: number;
}

export interface TopStudentsReport {
  student_id: string;
  name: string;
  events_attended: number;
  major?: string;
}

export interface EventTypeAnalysisReport {
  category: string;
  events_count: number;
  total_registrations: number;
  total_attendance: number;
  attendance_rate: number;
  average_rating: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
    timestamp: string;
    request_id: string;
  };
}

// Query parameters
export interface EventQueryParams {
  college_id?: string;
  status?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface ReportQueryParams {
  college_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  period?: 'week' | 'month' | 'semester' | 'year';
}

// Statistics types
export interface EventStats {
  total_events: number;
  active_events: number;
  total_registrations: number;
  total_attendance: number;
  average_attendance_rate: number;
  average_rating: number;
}

export interface StudentStats {
  total_students: number;
  active_students: number;
  average_events_per_student: number;
  top_participant: string;
}

// UI Component props
export interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onView?: (event: Event) => void;
}

export interface ReportCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Filter and search types
export interface EventFilters {
  status?: string[];
  category?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface StudentFilters {
  major?: string[];
  year?: number[];
  participationLevel?: 'low' | 'medium' | 'high';
  search?: string;
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  report_type: string;
  filters?: Record<string, any>;
  date_range?: {
    start: string;
    end: string;
  };
}
