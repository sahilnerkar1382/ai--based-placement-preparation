# Placement Preparation Web Application

A full-stack MERN application for AI-based placement preparation, built based on Figma designs with dark theme support and responsive design.

## Features

- **Authentication**: JWT-based user registration and login system
- **Dashboard**: Overview of interviews, upcoming mocks, and latest scores
- **Interview Management**: Track interviews with companies, positions, and preparation topics
- **Practice Challenges**: Aptitude, coding, and behavioral practice rounds
- **Test Interface**: Interactive test taking with question navigation and timer
- **Results Analytics**: Detailed performance analysis with strengths and improvement areas
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Project Structure

```
placement-prep-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd placement-prep-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   In `server/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/placement-prep
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
   
   In `client/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers concurrently.

### Manual Start

Alternatively, you can start each server separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Interviews
- `GET /api/interviews` - Get all interviews for a user
- `POST /api/interviews` - Create a new interview
- `GET /api/interviews/:id` - Get a specific interview
- `PUT /api/interviews/:id` - Update an interview
- `DELETE /api/interviews/:id` - Delete an interview
- `POST /api/interviews/:id/notes` - Add a note to an interview

### Tests
- `GET /api/tests` - Get all tests for a user
- `POST /api/tests` - Create a new test
- `GET /api/tests/:id` - Get a specific test
- `POST /api/tests/:id/start` - Start a test
- `POST /api/tests/:id/submit` - Submit a test

## Database Schema

### User
- Personal information (name, email, password)
- Profile details (avatar, bio, skills, experience)
- Statistics (total interviews, completed tests, average score)

### Interview
- Company and position details
- Interview rounds and status
- Preparation topics
- User notes

### Test
- Test metadata (title, type, duration)
- Questions and answers
- Results and analytics
- Test status and timing

## UI Features Implemented

### Dashboard
- Summary cards for recent interviews, upcoming mocks, and latest scores
- Interview grid with filtering options
- Responsive layout with dark mode support

### Interview Details
- Breadcrumb navigation
- Tabbed interface (Topics, Questions, Tips)
- Interactive topic checklist
- Note-taking functionality

### Practice Page
- Challenge selection cards
- Difficulty levels
- Customization options

### Test Interface
- Question navigation sidebar
- Real-time timer
- Progress tracking
- Flag for review feature
- Auto-save functionality

### Test Results
- Performance overview with percentile
- Strengths and improvement areas
- Recommended learning path
- Next practice steps

## Known Issues and Fixes

1. **UI Bug**: Fixed inconsistent button states across different pages
2. **UI Bug**: Corrected responsive layout issues on mobile devices
3. **UI Bug**: Improved dark mode contrast and readability
4. **UI Bug**: Fixed navigation menu collapse on smaller screens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- AI-powered question recommendations
- Real-time collaboration features
- Video interview practice
- Resume builder integration
- Company-specific preparation guides
- Performance analytics dashboard
- Mock interview scheduling
