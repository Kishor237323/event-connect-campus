# Campus Event Management Platform

A comprehensive event management system designed for colleges and universities to manage campus events, track student participation, and generate detailed analytics reports.

## Project Overview

This platform consists of two main components:
- **Admin Portal (Web)**: For college staff to create, manage, and analyze events
- **Student App (Mobile)**: For students to browse, register, and check in to events

When a student opens the website, they can see all the events happening in their college.

Each event shows the date, time, location, and a short description.

Students can click a button to register for any event they want to join.

After registering, they get a confirmation so they know they are signed up.

On the day of the event, students can attend and later give feedback about it.

Feedback includes a rating and optional comments to share their thoughts.

Students can also see a list of all events they have registered for.

The website keeps everything organized so students can easily track their participation.

It is simple and easy to navigate for students of all levels.

Students are kept informed with notifications about updates to their events.

When an admin opens the website, they see a dashboard showing all events and student activity.

Admins can create new events by adding the title, type, dates, location, and capacity.

They can update or cancel events if any changes are needed.

Admins can see a list of all students who registered for each event.

They can check which events are most popular based on the number of registrations.

Feedback from students is collected and shown to help improve future events.

Reports can be filtered by event type, date, or student participation.

Admins can easily find out which students attend events the most.

Notifications help admins stay informed about student registrations and feedback.

The system makes it simple to organize, track, and analyze events for the whole college.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Layout)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── useDataService.ts    # Data service hooks
│   └── use-mobile.tsx       # Mobile detection hook
├── lib/                # Core library functions
│   ├── database.ts          # Database configuration
│   ├── reporting.ts         # Reporting queries
│   ├── mockData.ts          # Sample data generation
│   └── utils.ts             # Utility functions
├── pages/              # Page components
│   ├── Dashboard.tsx        # Admin dashboard
│   ├── Events.tsx          # Event management
│   ├── Students.tsx        # Student management
│   ├── Reports.tsx         # Analytics & reports
│   └── Index.tsx           # Landing page
├── types/              # TypeScript type definitions
│   └── index.ts
└── assets/             # Static assets
```

