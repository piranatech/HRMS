# SIRH Frontend

A modern Human Resources Management System (SIRH) built with React, Vite, and Tailwind CSS.

## Features

- 🔐 Secure authentication system
- 👥 Employee management
- 📅 Leave request management
- 📄 Document management
- 📊 Reports and analytics
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time updates
- 🛡️ Protected routes
- 🌐 API integration

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Headless UI
- React Hot Toast
- Class Variance Authority
- clsx
- tailwind-merge

## Project Structure

```
sirh-frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts)
│   ├── components/      # Reusable components
│   │   ├── common/     # Common UI components
│   │   ├── layout/     # Layout components
│   │   └── employees/  # Employee-specific components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Public assets
└── [config files]      # Configuration files
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PowerShell (for Windows)

## Installation

1. Clone the repository:
```powershell
git clone <repository-url>
cd sirh
```

2. Install dependencies:
```powershell
cd sirh-frontend
npm install
```

3. Create a `.env` file in the `sirh-frontend` directory:
```powershell
New-Item .env -ItemType File
```

4. Add the following environment variables to `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

## Development

To start the development server:

```powershell
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```powershell
npm run build
```

To preview the production build:

```powershell
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Component Library

The application uses a custom component library built with Tailwind CSS and Headless UI:

- Button
- Input
- Select
- Modal
- Table
- Badge

## Routing

The application uses React Router for navigation:

- `/` - Dashboard
- `/login` - Login page
- `/employees` - Employee management
- `/leave` - Leave management
- `/documents` - Document management
- `/leave-requests` - Leave requests
- `/reports` - Reports and analytics
- `/profile` - User profile
- `/settings` - Application settings

## API Integration

The application communicates with a backend API:

- Base URL: `http://localhost:3001/api`
- Authentication: JWT-based
- Endpoints:
  - `/auth/login` - User authentication
  - `/employees` - Employee management
  - `/leave` - Leave management
  - `/documents` - Document management
  - `/dashboard` - Dashboard data

## Contributing

1. Create a new branch:
```powershell
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```powershell
git add .
git commit -m "Add your feature"
```

3. Push to the branch:
```powershell
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Troubleshooting

### Common Issues

1. **Port already in use**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173
# Kill the process
taskkill /PID <PID> /F
```

2. **Node modules issues**
```powershell
# Clear npm cache
npm cache clean --force
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

3. **Environment variables not loading**
- Ensure `.env` file is in the correct location
- Restart the development server
- Check for typos in variable names

## License

This project is licensed under the MIT License - see the LICENSE file for details.
