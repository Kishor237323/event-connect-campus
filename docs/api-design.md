# Campus Event Management Platform - API Design

## Base URL
```
https://api.campus-events.com/v1
```

## Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Event Management

#### Create Event
```http
POST /events
Content-Type: application/json

{
  "title": "Tech Symposium 2024",
  "description": "Annual technology conference",
  "event_type": "single",
  "category": "academic",
  "start_date": "2024-03-15T14:00:00Z",
  "end_date": "2024-03-15T18:00:00Z",
  "location": "Engineering Hall, Room 101",
  "capacity": 200
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Tech Symposium 2024",
  "status": "draft",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Get Events
```http
GET /events?college_id=uuid&status=active&category=academic&page=1&limit=20
```

#### Update Event
```http
PUT /events/{event_id}
```

#### Delete Event
```http
DELETE /events/{event_id}
```

### 2. Student Registration

#### Register for Event
```http
POST /events/{event_id}/register
Content-Type: application/json

{
  "student_id": "uuid"
}
```

#### Cancel Registration
```http
DELETE /events/{event_id}/register/{student_id}
```

#### Get Event Registrations
```http
GET /events/{event_id}/registrations?status=registered&page=1&limit=50
```

### 3. Attendance Management

#### Check In Student
```http
POST /events/{event_id}/attendance/checkin
Content-Type: application/json

{
  "student_id": "uuid",
  "checked_in_at": "2024-03-15T14:05:00Z"
}
```

#### Check Out Student
```http
POST /events/{event_id}/attendance/checkout
Content-Type: application/json

{
  "student_id": "uuid",
  "checked_out_at": "2024-03-15T17:55:00Z"
}
```

#### Get Event Attendance
```http
GET /events/{event_id}/attendance?status=present&page=1&limit=50
```

### 4. Feedback Collection

#### Submit Feedback
```http
POST /events/{event_id}/feedback
Content-Type: application/json

{
  "student_id": "uuid",
  "rating": 5,
  "comment": "Excellent event! Great speakers and content."
}
```

#### Get Event Feedback
```http
GET /events/{event_id}/feedback?page=1&limit=50
```

### 5. Reporting Endpoints

#### Event Popularity Report
```http
GET /reports/event-popularity?college_id=uuid&start_date=2024-01-01&end_date=2024-12-31&sort_by=registrations&limit=20
```

**Response:**
```json
{
  "events": [
    {
      "event_id": "uuid",
      "title": "Tech Symposium 2024",
      "registrations": 180,
      "capacity": 200,
      "attendance": 162,
      "attendance_rate": 90.0,
      "average_rating": 4.8,
      "total_feedback": 145
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 46,
    "pages": 3
  }
}
```

#### Student Participation Report
```http
GET /reports/student-participation?college_id=uuid&start_date=2024-01-01&end_date=2024-12-31&sort_by=events_attended&limit=50
```

**Response:**
```json
{
  "students": [
    {
      "student_id": "uuid",
      "name": "Carol Davis",
      "major": "Business",
      "events_registered": 18,
      "events_attended": 15,
      "attendance_rate": 83.3,
      "average_rating_given": 4.2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "pages": 10
  }
}
```

#### Monthly Trends Report
```http
GET /reports/monthly-trends?college_id=uuid&year=2024
```

**Response:**
```json
{
  "monthly_data": [
    {
      "month": "2024-01",
      "events_count": 8,
      "total_registrations": 1200,
      "total_attendance": 1050,
      "attendance_rate": 87.5,
      "average_rating": 4.6
    }
  ],
  "summary": {
    "total_events": 46,
    "total_registrations": 6900,
    "total_attendance": 6000,
    "overall_attendance_rate": 87.0,
    "overall_average_rating": 4.7
  }
}
```

#### Top Active Students
```http
GET /reports/top-students?college_id=uuid&limit=10&period=semester
```

#### Event Type Analysis
```http
GET /reports/event-type-analysis?college_id=uuid&start_date=2024-01-01&end_date=2024-12-31
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "capacity",
        "message": "Capacity must be a positive integer"
      }
    ],
    "timestamp": "2024-01-15T10:00:00Z",
    "request_id": "req_123456"
  }
}
```

### Error Codes
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Duplicate registration or resource conflict
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting
- 1000 requests per hour per API key
- 100 requests per minute for reporting endpoints
- 10 requests per minute for bulk operations

## Pagination
All list endpoints support pagination:
```
GET /endpoint?page=1&limit=20&sort_by=created_at&order=desc
```

## Filtering and Sorting
Most endpoints support filtering and sorting:
```
GET /events?status=active&category=academic&sort_by=start_date&order=asc
```

## Webhooks
Event-driven notifications for:
- New event registrations
- Attendance check-ins
- Feedback submissions
- Event status changes

## Data Export
```http
GET /reports/export?type=csv&report=event-popularity&college_id=uuid
```
