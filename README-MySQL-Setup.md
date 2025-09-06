# MySQL Database Setup for Campus Event Management Platform

## Prerequisites

1. **MySQL Server** (version 8.0 or higher)
2. **Node.js** (version 18 or higher)
3. **npm** or **yarn**

## Installation Steps

### 1. Install MySQL Server

#### Windows:
- Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run the installer and follow the setup wizard
- Remember the root password you set during installation

#### macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database and User (Optional)

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE campus_events;

-- Create user (optional, you can use root)
CREATE USER 'campus_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your MySQL credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=campus_events
```

### 4. Initialize Database

```bash
# Run database initialization script
npm run init-db
```

This will:
- Create the database schema
- Insert sample data
- Set up all required tables

### 5. Start Backend Server

```bash
# Start the API server
npm run dev
```

The backend will be available at `http://localhost:3001`

### 6. Setup Frontend

```bash
# Navigate to project root
cd ..

# Copy environment file
cp env.example .env

# Install dependencies (if not already done)
npm install

# Start frontend development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campus_events
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Database Schema

The database includes the following tables:

- **colleges** - College information
- **events** - Event details
- **students** - Student information
- **registrations** - Event registrations
- **attendance** - Attendance tracking
- **feedback** - Event feedback

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/publish` - Publish event
- `PATCH /api/events/:id/cancel` - Cancel event

### Colleges
- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get college by ID

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/event-popularity` - Get event popularity report
- `GET /api/reports/student-participation` - Get student participation report

## Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Check if MySQL service is running
   - Verify credentials in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in backend .env file
   - Update VITE_API_URL in frontend .env file

3. **CORS Issues**
   - Check FRONTEND_URL in backend .env file
   - Ensure frontend URL matches exactly

### Testing Database Connection

```bash
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Test API connection
curl http://localhost:3001/health
```

## Production Deployment

For production deployment:

1. Use a production MySQL server
2. Set up proper environment variables
3. Use PM2 or similar process manager
4. Set up reverse proxy (nginx)
5. Enable SSL/HTTPS
6. Configure proper CORS settings

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MySQL server is running and accessible
4. Check network connectivity between frontend and backend
