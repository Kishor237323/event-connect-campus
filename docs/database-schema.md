# Campus Event Management Platform - Database Schema

## Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Colleges    │    │     Events      │    │    Students     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ college_id (FK) │    │ college_id (FK) │
│ domain          │    │ title           │    │ student_id      │
│ created_at      │    │ description     │    │ name            │
│ updated_at      │    │ event_type      │    │ email           │
└─────────────────┘    │ category        │    │ major           │
         │              │ start_date      │    │ year            │
         │              │ end_date        │    │ created_at      │
         │              │ location        │    │ updated_at      │
         │              │ capacity        │    └─────────────────┘
         │              │ status          │             │
         │              │ created_by      │             │
         │              │ created_at      │             │
         │              │ updated_at      │             │
         │              └─────────────────┘             │
         │                       │                      │
         │                       │                      │
         │              ┌─────────────────┐             │
         │              │  Registrations  │             │
         │              ├─────────────────┤             │
         │              │ id (PK)         │             │
         │              │ event_id (FK)   │◄────────────┘
         │              │ student_id (FK) │
         │              │ registered_at   │
         │              │ status          │
         │              └─────────────────┘
         │                       │
         │                       │
         │              ┌─────────────────┐
         │              │   Attendance    │
         │              ├─────────────────┤
         │              │ id (PK)         │
         │              │ registration_id │
         │              │ checked_in_at   │
         │              │ checked_out_at  │
         │              │ status          │
         │              └─────────────────┘
         │                       │
         │                       │
         │              ┌─────────────────┐
         │              │    Feedback     │
         │              ├─────────────────┤
         │              │ id (PK)         │
         │              │ registration_id │
         │              │ rating          │
         │              │ comment         │
         │              │ submitted_at    │
         │              └─────────────────┘
```

## Table Definitions

### 1. Colleges
```sql
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Events
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'single', 'recurring', 'series'
    category VARCHAR(50) NOT NULL, -- 'academic', 'cultural', 'professional', 'sports', 'social'
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'cancelled', 'completed'
    created_by UUID NOT NULL, -- admin user ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Students
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id),
    student_id VARCHAR(50) NOT NULL, -- student ID number
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    major VARCHAR(100),
    year INTEGER, -- 1, 2, 3, 4, 5 (graduate)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, student_id),
    UNIQUE(college_id, email)
);
```

### 4. Registrations
```sql
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id),
    student_id UUID NOT NULL REFERENCES students(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'registered', -- 'registered', 'cancelled', 'waitlisted'
    UNIQUE(event_id, student_id)
);
```

### 5. Attendance
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES registrations(id),
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'present', -- 'present', 'absent', 'late'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Feedback
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES registrations(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(registration_id)
);
```

## Indexes for Performance

```sql
-- Event queries
CREATE INDEX idx_events_college_id ON events(college_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);

-- Registration queries
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_student_id ON registrations(student_id);
CREATE INDEX idx_registrations_status ON registrations(status);

-- Student queries
CREATE INDEX idx_students_college_id ON students(college_id);
CREATE INDEX idx_students_email ON students(email);

-- Attendance queries
CREATE INDEX idx_attendance_registration_id ON attendance(registration_id);
CREATE INDEX idx_attendance_checked_in_at ON attendance(checked_in_at);

-- Feedback queries
CREATE INDEX idx_feedback_registration_id ON feedback(registration_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
```

## Scale Considerations

- **Partitioning**: Events table partitioned by college_id for better performance
- **Archiving**: Old events moved to archive tables after 2 years
- **Caching**: Frequently accessed reports cached in Redis
- **Read Replicas**: Separate read replicas for reporting queries

## Data Volume Estimates

- 50 colleges × 500 students × 20 events/semester = 1,000,000 potential registrations
- With 87% attendance rate: ~870,000 attendance records
- With 60% feedback rate: ~600,000 feedback records
- Total estimated size: ~2-3 GB for 1 year of data
