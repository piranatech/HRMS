# SIRH Backend

A modern Human Resources Management System backend built with Node.js, Express, and PostgreSQL.

## Features

- 👥 Employee Management
- 📅 Leave Management with multiple leave types
- 🏖️ Automatic leave balance calculation
- 📊 Holiday management
- 🔐 Role-based access control
- 📈 Reporting and analytics

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Schema

The system uses the following main tables:

- `employees` - Employee information
- `leave_types` - Different types of leave (Annual, Sick, etc.)
- `leave_balances` - Employee leave balances per year
- `leave_requests` - Leave request records
- `holidays` - Public and company holidays
- `leave_request_history` - Audit trail for leave requests

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sirh-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
createdb sirh_db
```

4. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sirh_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=3000
```

5. Initialize the database:
```bash
psql -d sirh_db -f config/schema.sql
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Leave Management
- GET `/api/leaves` - Get all leave requests
- POST `/api/leaves` - Create a leave request
- GET `/api/leaves/:id` - Get leave request details
- PUT `/api/leaves/:id` - Update leave request
- DELETE `/api/leaves/:id` - Cancel leave request
- GET `/api/leaves/balance` - Get current user's leave balance
- GET `/api/leaves/types` - Get available leave types

### Employees
- GET `/api/employees` - Get all employees
- POST `/api/employees` - Create new employee
- GET `/api/employees/:id` - Get employee details
- PUT `/api/employees/:id` - Update employee
- DELETE `/api/employees/:id` - Delete employee

### Holidays
- GET `/api/holidays` - Get all holidays
- POST `/api/holidays` - Add new holiday
- PUT `/api/holidays/:id` - Update holiday
- DELETE `/api/holidays/:id` - Delete holiday

## Database Functions

### `calculate_working_days(start_date, end_date)`
Calculates the number of working days between two dates, excluding weekends and holidays.

### `process_leave_request(employee_id, leave_type_id, start_date, end_date, reason)`
Validates and processes a leave request, checking leave balance and inserting the request.

## Development

### Running Tests
```bash
npm test
```

### Code Style
We use ESLint for code style. Run the linter:
```bash
npm run lint
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 