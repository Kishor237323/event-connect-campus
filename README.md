# Campus Event Management Platform

A comprehensive event management system designed for colleges and universities to manage campus events, track student participation, and generate detailed analytics reports.

## 🎯 Project Overview

This platform consists of two main components:
- **Admin Portal (Web)**: For college staff to create, manage, and analyze events
- **Student App (Mobile)**: For students to browse, register, and check in to events

## 📊 Features

### Event Management
- Create and manage campus events
- Event categorization (Academic, Cultural, Professional, Sports, Social)
- Capacity management and waitlist functionality
- Event status tracking (Draft, Active, Cancelled, Completed)

### Student Registration & Attendance
- Student registration for events
- QR code-based check-in/check-out system
- Attendance tracking and analytics
- Feedback collection (1-5 star rating + comments)

### Comprehensive Reporting
- **Event Popularity Report**: Events ranked by registrations and attendance
- **Student Participation Report**: Individual student engagement analysis
- **Monthly Trends Report**: Event activity over time
- **Top Active Students**: Most engaged students
- **Event Type Analysis**: Performance by event category
- **Dashboard Statistics**: Real-time overview metrics

### Data Export
- CSV export for all reports
- Filtered data export by college, date range, event type
- Real-time data synchronization

## 🏗️ Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching

### Database
- **Dexie.js** (IndexedDB wrapper) for client-side storage
- Browser-compatible database solution
- Offline-first architecture
- Real-time data synchronization

### Data Flow
```
Admin Portal → React Components → Data Service Hooks → Reporting Service → Dexie Database
```

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-connect-campus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Database Initialization

The application automatically initializes the database and populates it with sample data on first load. This includes:
- 3 sample colleges
- 10 sample students
- 7 sample events
- Generated registrations, attendance, and feedback data

## 📊 Database Schema

### Core Entities

#### Colleges
- `id`: Unique identifier
- `name`: College name
- `domain`: College domain
- `created_at`, `updated_at`: Timestamps

#### Events
- `id`: Unique identifier
- `college_id`: Foreign key to colleges
- `title`: Event title
- `description`: Event description
- `event_type`: single, recurring, series
- `category`: academic, cultural, professional, sports, social
- `start_date`, `end_date`: Event timing
- `location`: Event location
- `capacity`: Maximum attendees
- `status`: draft, active, cancelled, completed

#### Students
- `id`: Unique identifier
- `college_id`: Foreign key to colleges
- `student_id`: Student ID number
- `name`: Student name
- `email`: Student email
- `major`: Student major
- `year`: Academic year (1-5)

#### Registrations
- `id`: Unique identifier
- `event_id`: Foreign key to events
- `student_id`: Foreign key to students
- `registered_at`: Registration timestamp
- `status`: registered, cancelled, waitlisted

#### Attendance
- `id`: Unique identifier
- `registration_id`: Foreign key to registrations
- `checked_in_at`, `checked_out_at`: Attendance timestamps
- `status`: present, absent, late

#### Feedback
- `id`: Unique identifier
- `registration_id`: Foreign key to registrations
- `rating`: 1-5 star rating
- `comment`: Optional feedback text
- `submitted_at`: Submission timestamp

## 📈 Reporting System

### Available Reports

1. **Event Popularity Report**
   - Events ranked by registration numbers
   - Attendance rates and capacity utilization
   - Average ratings and feedback counts

2. **Student Participation Report**
   - Individual student engagement metrics
   - Events registered vs. attended
   - Attendance rates and feedback given

3. **Monthly Trends Report**
   - Event activity over time
   - Registration and attendance trends
   - Monthly performance summaries

4. **Top Active Students**
   - Most engaged students
   - Event attendance rankings
   - Participation statistics

5. **Event Type Analysis**
   - Performance by event category
   - Category-wise attendance rates
   - Popular event types

### Report Features
- Real-time data updates
- Filtering by college, date range, event type
- Export to CSV format
- Responsive design for all screen sizes
- Loading states and error handling

## 🎨 UI Components

### Design System
- **Modern, clean interface** with gradient accents
- **Responsive design** for desktop and mobile
- **Dark/light theme support** (via shadcn/ui)
- **Accessible components** with proper ARIA labels

### Key Components
- **Dashboard Cards**: Statistics and metrics display
- **Event Cards**: Event information with actions
- **Report Tables**: Data visualization and sorting
- **Progress Bars**: Visual progress indicators
- **Charts**: Data visualization (ready for integration)

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001/api/v1
DATABASE_PATH=./campus_events.db
```

### Database Configuration
The application uses Dexie.js for IndexedDB storage, providing:
- Offline-first functionality
- Browser compatibility
- Automatic data synchronization
- Indexed queries for performance

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured admin portal
- **Tablet**: Adapted layout for touch interfaces
- **Mobile**: Streamlined interface for student app

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Static hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Container**: Docker with nginx

## 📊 Performance Considerations

### Database Optimization
- Indexed queries for fast data retrieval
- Pagination for large datasets
- Efficient data relationships

### Frontend Optimization
- Code splitting with React.lazy
- Memoized components with React.memo
- Optimized re-renders with useCallback/useMemo

### Scalability
- Designed for 50 colleges × 500 students × 20 events/semester
- Estimated 1M+ potential registrations
- Efficient data partitioning by college

## 🧪 Testing

### Test Coverage
- Unit tests for utility functions
- Integration tests for data services
- E2E tests for critical user flows

### Running Tests
```bash
npm run test
npm run test:coverage
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for git messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Dexie.js** for the IndexedDB wrapper
- **React Query** for data fetching and caching

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for campus communities**