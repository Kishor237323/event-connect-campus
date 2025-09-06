// Reporting service with database queries for Campus Event Management Platform
import { db } from './database';
import {
  EventPopularityReport,
  StudentParticipationReport,
  MonthlyTrendsReport,
  TopStudentsReport,
  EventTypeAnalysisReport,
  ReportQueryParams
} from '@/types';

// Event Popularity Report
export async function getEventPopularityReport(params: ReportQueryParams = {}): Promise<EventPopularityReport[]> {
  const {
    college_id,
    start_date = '2024-01-01',
    end_date = '2024-12-31',
    sort_by = 'registrations',
    order = 'desc',
    limit = 20
  } = params;

  try {
    // Get events with filters
    let eventsQuery = db.events
      .where('start_date')
      .between(start_date, end_date, true, true);

    if (college_id) {
      eventsQuery = eventsQuery.and(event => event.college_id === college_id);
    }

    const events = await eventsQuery.toArray();

    // Get registrations for these events
    const eventIds = events.map(e => e.id);
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    // Get attendance for these registrations
    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    // Get feedback for these registrations
    const feedback = await db.feedback
      .where('registration_id')
      .anyOf(registrationIds)
      .toArray();

    // Group data by event
    const eventData = new Map<string, {
      event: any;
      registrations: any[];
      attendance: any[];
      feedback: any[];
    }>();

    events.forEach(event => {
      eventData.set(event.id, {
        event,
        registrations: [],
        attendance: [],
        feedback: []
      });
    });

    registrations.forEach(reg => {
      const data = eventData.get(reg.event_id);
      if (data) data.registrations.push(reg);
    });

    attendance.forEach(att => {
      const reg = registrations.find(r => r.id === att.registration_id);
      if (reg) {
        const data = eventData.get(reg.event_id);
        if (data) data.attendance.push(att);
      }
    });

    feedback.forEach(fb => {
      const reg = registrations.find(r => r.id === fb.registration_id);
      if (reg) {
        const data = eventData.get(reg.event_id);
        if (data) data.feedback.push(fb);
      }
    });

    // Calculate metrics
    const results: EventPopularityReport[] = Array.from(eventData.values()).map(({ event, registrations, attendance, feedback }) => {
      const attendanceRate = registrations.length > 0 ? (attendance.length / registrations.length) * 100 : 0;
      const averageRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

      return {
        event_id: event.id,
        title: event.title,
        registrations: registrations.length,
        capacity: event.capacity,
        attendance: attendance.length,
        attendance_rate: Math.round(attendanceRate * 100) / 100,
        average_rating: Math.round(averageRating * 100) / 100,
        total_feedback: feedback.length
      };
    });

    // Sort results
    results.sort((a, b) => {
      const aValue = a[sort_by as keyof EventPopularityReport] as number;
      const bValue = b[sort_by as keyof EventPopularityReport] as number;
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return results.slice(0, limit);
  } catch (error) {
    console.error('Error generating event popularity report:', error);
    return [];
  }
}

// Student Participation Report
export async function getStudentParticipationReport(params: ReportQueryParams = {}): Promise<StudentParticipationReport[]> {
  const {
    college_id,
    start_date = '2024-01-01',
    end_date = '2024-12-31',
    sort_by = 'events_attended',
    order = 'desc',
    limit = 50
  } = params;

  try {
    // Get students
    let studentsQuery = db.students;
    if (college_id) {
      studentsQuery = studentsQuery.where('college_id').equals(college_id);
    }
    const students = await studentsQuery.toArray();

    // Get events in date range
    const events = await db.events
      .where('start_date')
      .between(start_date, end_date, true, true)
      .toArray();

    const eventIds = events.map(e => e.id);

    // Get registrations
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    // Get attendance
    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    // Get feedback
    const feedback = await db.feedback
      .where('registration_id')
      .anyOf(registrationIds)
      .toArray();

    // Group by student
    const studentData = new Map<string, {
      student: any;
      registrations: any[];
      attendance: any[];
      feedback: any[];
    }>();

    students.forEach(student => {
      studentData.set(student.id, {
        student,
        registrations: [],
        attendance: [],
        feedback: []
      });
    });

    registrations.forEach(reg => {
      const data = studentData.get(reg.student_id);
      if (data) data.registrations.push(reg);
    });

    attendance.forEach(att => {
      const reg = registrations.find(r => r.id === att.registration_id);
      if (reg) {
        const data = studentData.get(reg.student_id);
        if (data) data.attendance.push(att);
      }
    });

    feedback.forEach(fb => {
      const reg = registrations.find(r => r.id === fb.registration_id);
      if (reg) {
        const data = studentData.get(reg.student_id);
        if (data) data.feedback.push(fb);
      }
    });

    // Calculate metrics
    const results: StudentParticipationReport[] = Array.from(studentData.values())
      .map(({ student, registrations, attendance, feedback }) => {
        const eventsRegistered = new Set(registrations.map(r => r.event_id)).size;
        const eventsAttended = new Set(attendance.map(a => {
          const reg = registrations.find(r => r.id === a.registration_id);
          return reg?.event_id;
        }).filter(Boolean)).size;

        const attendanceRate = eventsRegistered > 0 ? (eventsAttended / eventsRegistered) * 100 : 0;
        const averageRatingGiven = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

        return {
          student_id: student.id,
          name: student.name,
          major: student.major,
          events_registered: eventsRegistered,
          events_attended: eventsAttended,
          attendance_rate: Math.round(attendanceRate * 100) / 100,
          average_rating_given: Math.round(averageRatingGiven * 100) / 100
        };
      })
      .filter(student => student.events_registered > 0);

    // Sort results
    results.sort((a, b) => {
      const aValue = a[sort_by as keyof StudentParticipationReport] as number;
      const bValue = b[sort_by as keyof StudentParticipationReport] as number;
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return results.slice(0, limit);
  } catch (error) {
    console.error('Error generating student participation report:', error);
    return [];
  }
}

// Monthly Trends Report
export async function getMonthlyTrendsReport(params: ReportQueryParams = {}): Promise<{
  monthly_data: MonthlyTrendsReport[];
  summary: any;
}> {
  const {
    college_id,
    start_date = '2024-01-01',
    end_date = '2024-12-31'
  } = params;

  try {
    // Get events in date range
    let eventsQuery = db.events
      .where('start_date')
      .between(start_date, end_date, true, true);

    if (college_id) {
      eventsQuery = eventsQuery.and(event => event.college_id === college_id);
    }

    const events = await eventsQuery.toArray();

    // Get all registrations and attendance
    const eventIds = events.map(e => e.id);
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    const feedback = await db.feedback
      .where('registration_id')
      .anyOf(registrationIds)
      .toArray();

    // Group by month
    const monthlyData = new Map<string, {
      events: any[];
      registrations: any[];
      attendance: any[];
      feedback: any[];
    }>();

    events.forEach(event => {
      const month = event.start_date.substring(0, 7); // YYYY-MM
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { events: [], registrations: [], attendance: [], feedback: [] });
      }
      monthlyData.get(month)!.events.push(event);
    });

    registrations.forEach(reg => {
      const event = events.find(e => e.id === reg.event_id);
      if (event) {
        const month = event.start_date.substring(0, 7);
        const data = monthlyData.get(month);
        if (data) data.registrations.push(reg);
      }
    });

    attendance.forEach(att => {
      const reg = registrations.find(r => r.id === att.registration_id);
      if (reg) {
        const event = events.find(e => e.id === reg.event_id);
        if (event) {
          const month = event.start_date.substring(0, 7);
          const data = monthlyData.get(month);
          if (data) data.attendance.push(att);
        }
      }
    });

    feedback.forEach(fb => {
      const reg = registrations.find(r => r.id === fb.registration_id);
      if (reg) {
        const event = events.find(e => e.id === reg.event_id);
        if (event) {
          const month = event.start_date.substring(0, 7);
          const data = monthlyData.get(month);
          if (data) data.feedback.push(fb);
        }
      }
    });

    // Calculate monthly metrics
    const monthly_data: MonthlyTrendsReport[] = Array.from(monthlyData.entries())
      .map(([month, data]) => {
        const attendanceRate = data.registrations.length > 0 ? (data.attendance.length / data.registrations.length) * 100 : 0;
        const averageRating = data.feedback.length > 0 ? data.feedback.reduce((sum, f) => sum + f.rating, 0) / data.feedback.length : 0;

        return {
          month,
          events_count: data.events.length,
          total_registrations: data.registrations.length,
          total_attendance: data.attendance.length,
          attendance_rate: Math.round(attendanceRate * 100) / 100,
          average_rating: Math.round(averageRating * 100) / 100
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate summary
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;
    const totalAttendance = attendance.length;
    const overallAttendanceRate = totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0;
    const overallAverageRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

    const summary = {
      total_events: totalEvents,
      total_registrations: totalRegistrations,
      total_attendance: totalAttendance,
      overall_attendance_rate: Math.round(overallAttendanceRate * 100) / 100,
      overall_average_rating: Math.round(overallAverageRating * 100) / 100
    };

    return { monthly_data, summary };
  } catch (error) {
    console.error('Error generating monthly trends report:', error);
    return { monthly_data: [], summary: {} };
  }
}

// Top Active Students Report
export async function getTopStudentsReport(params: ReportQueryParams = {}): Promise<TopStudentsReport[]> {
  const {
    college_id,
    start_date = '2024-01-01',
    end_date = '2024-12-31',
    limit = 10
  } = params;

  try {
    // Get students
    let studentsQuery = db.students;
    if (college_id) {
      studentsQuery = studentsQuery.where('college_id').equals(college_id);
    }
    const students = await studentsQuery.toArray();

    // Get events in date range
    const events = await db.events
      .where('start_date')
      .between(start_date, end_date, true, true)
      .toArray();

    const eventIds = events.map(e => e.id);

    // Get registrations and attendance
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    // Group by student
    const studentAttendance = new Map<string, Set<string>>();

    students.forEach(student => {
      studentAttendance.set(student.id, new Set());
    });

    attendance.forEach(att => {
      const reg = registrations.find(r => r.id === att.registration_id);
      if (reg) {
        const studentData = studentAttendance.get(reg.student_id);
        if (studentData) {
          studentData.add(reg.event_id);
        }
      }
    });

    // Calculate results
    const results: TopStudentsReport[] = Array.from(studentAttendance.entries())
      .map(([studentId, eventIds]) => {
        const student = students.find(s => s.id === studentId);
        return {
          student_id: studentId,
          name: student?.name || 'Unknown',
          major: student?.major,
          events_attended: eventIds.size
        };
      })
      .filter(student => student.events_attended > 0)
      .sort((a, b) => b.events_attended - a.events_attended)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error('Error generating top students report:', error);
    return [];
  }
}

// Event Type Analysis Report
export async function getEventTypeAnalysisReport(params: ReportQueryParams = {}): Promise<EventTypeAnalysisReport[]> {
  const {
    college_id,
    start_date = '2024-01-01',
    end_date = '2024-12-31'
  } = params;

  try {
    // Get events in date range
    let eventsQuery = db.events
      .where('start_date')
      .between(start_date, end_date, true, true);

    if (college_id) {
      eventsQuery = eventsQuery.and(event => event.college_id === college_id);
    }

    const events = await eventsQuery.toArray();

    // Get registrations and attendance
    const eventIds = events.map(e => e.id);
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    const feedback = await db.feedback
      .where('registration_id')
      .anyOf(registrationIds)
      .toArray();

    // Group by category
    const categoryData = new Map<string, {
      events: any[];
      registrations: any[];
      attendance: any[];
      feedback: any[];
    }>();

    events.forEach(event => {
      if (!categoryData.has(event.category)) {
        categoryData.set(event.category, { events: [], registrations: [], attendance: [], feedback: [] });
      }
      categoryData.get(event.category)!.events.push(event);
    });

    registrations.forEach(reg => {
      const event = events.find(e => e.id === reg.event_id);
      if (event) {
        const data = categoryData.get(event.category);
        if (data) data.registrations.push(reg);
      }
    });

    attendance.forEach(att => {
      const reg = registrations.find(r => r.id === att.registration_id);
      if (reg) {
        const event = events.find(e => e.id === reg.event_id);
        if (event) {
          const data = categoryData.get(event.category);
          if (data) data.attendance.push(att);
        }
      }
    });

    feedback.forEach(fb => {
      const reg = registrations.find(r => r.id === fb.registration_id);
      if (reg) {
        const event = events.find(e => e.id === reg.event_id);
        if (event) {
          const data = categoryData.get(event.category);
          if (data) data.feedback.push(fb);
        }
      }
    });

    // Calculate metrics
    const results: EventTypeAnalysisReport[] = Array.from(categoryData.entries())
      .map(([category, data]) => {
        const attendanceRate = data.registrations.length > 0 ? (data.attendance.length / data.registrations.length) * 100 : 0;
        const averageRating = data.feedback.length > 0 ? data.feedback.reduce((sum, f) => sum + f.rating, 0) / data.feedback.length : 0;

        return {
          category,
          events_count: data.events.length,
          total_registrations: data.registrations.length,
          total_attendance: data.attendance.length,
          attendance_rate: Math.round(attendanceRate * 100) / 100,
          average_rating: Math.round(averageRating * 100) / 100
        };
      })
      .sort((a, b) => b.events_count - a.events_count);

    return results;
  } catch (error) {
    console.error('Error generating event type analysis report:', error);
    return [];
  }
}

// Get dashboard statistics
export async function getDashboardStats(college_id?: string): Promise<{
  total_events: number;
  active_events: number;
  total_registrations: number;
  total_attendance: number;
  average_attendance_rate: number;
  average_rating: number;
}> {
  try {
    // Get events
    let eventsQuery = db.events;
    if (college_id) {
      eventsQuery = eventsQuery.where('college_id').equals(college_id);
    }
    const events = await eventsQuery.toArray();

    // Get registrations
    const eventIds = events.map(e => e.id);
    const registrations = await db.registrations
      .where('event_id')
      .anyOf(eventIds)
      .and(reg => reg.status === 'registered')
      .toArray();

    // Get attendance
    const registrationIds = registrations.map(r => r.id);
    const attendance = await db.attendance
      .where('registration_id')
      .anyOf(registrationIds)
      .and(att => att.status === 'present')
      .toArray();

    // Get feedback
    const feedback = await db.feedback
      .where('registration_id')
      .anyOf(registrationIds)
      .toArray();

    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'active').length;
    const totalRegistrations = registrations.length;
    const totalAttendance = attendance.length;
    const averageAttendanceRate = totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0;
    const averageRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0;

    return {
      total_events: totalEvents,
      active_events: activeEvents,
      total_registrations: totalRegistrations,
      total_attendance: totalAttendance,
      average_attendance_rate: Math.round(averageAttendanceRate * 100) / 100,
      average_rating: Math.round(averageRating * 100) / 100
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      total_events: 0,
      active_events: 0,
      total_registrations: 0,
      total_attendance: 0,
      average_attendance_rate: 0,
      average_rating: 0
    };
  }
}

// Export functions for CSV generation
export async function exportEventPopularityCSV(params: ReportQueryParams = {}): Promise<string> {
  const data = await getEventPopularityReport(params);
  
  const headers = ['Event Title', 'Registrations', 'Capacity', 'Attendance', 'Attendance Rate (%)', 'Average Rating', 'Total Feedback'];
  const rows = data.map(event => [
    event.title,
    event.registrations,
    event.capacity,
    event.attendance,
    event.attendance_rate,
    event.average_rating,
    event.total_feedback
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

export async function exportStudentParticipationCSV(params: ReportQueryParams = {}): Promise<string> {
  const data = await getStudentParticipationReport(params);
  
  const headers = ['Student Name', 'Major', 'Events Registered', 'Events Attended', 'Attendance Rate (%)', 'Average Rating Given'];
  const rows = data.map(student => [
    student.name,
    student.major || '',
    student.events_registered,
    student.events_attended,
    student.attendance_rate,
    student.average_rating_given
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}