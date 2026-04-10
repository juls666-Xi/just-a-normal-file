# Mental Math Quiz

A full-stack Mental Math Quiz Web Application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Quiz System**: Generate random math questions (Addition, Subtraction, Multiplication, Division, Mixed)
- **Dynamic Difficulty**: Easy (1-digit), Medium (2-digit), Hard (3+ digits, decimals)
- **Game Mechanics**: 
  - Countdown timer per question (5-10 seconds)
  - Auto-next question after answer or timeout
  - Score tracking with streak system
  - Instant feedback (correct/incorrect)
- **User Authentication**: JWT-based auth with username/password
- **Leaderboard**: Global leaderboard sorted by score, accuracy, or time
- **Results Screen**: Final score, accuracy, total time, correct vs incorrect answers
- **Dark Mode**: Toggle between light and dark themes
- **Sound Effects**: Audio feedback for correct/wrong answers

## Tech Stack

### Frontend
- React 19 with TypeScript
- React Router DOM for navigation
- Tailwind CSS for styling
- shadcn/ui components
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Project Structure

```
/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── context/           # React contexts (Auth, Theme)
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── ...
├── server/                 # Backend Node.js/Express app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── ...
└── dist/                  # Built frontend files
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd mental-math-quiz
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

4. Set up environment variables:
```bash
# In server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentalmathquiz
JWT_SECRET=your-super-secret-key
```

### Running the Application

1. Start MongoDB (if using local):
```bash
mongod
```

2. Start the backend server:
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

3. Start the frontend (in a new terminal):
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Questions
- `GET /api/questions?mode=&difficulty=&count=` - Generate questions
- `POST /api/questions/validate` - Validate answer

### Scores
- `POST /api/scores` - Save score (protected)
- `GET /api/scores/history` - Get user's game history (protected)
- `GET /api/scores/best` - Get user's best scores (protected)
- `GET /api/scores/stats` - Get user's statistics (protected)

### Leaderboard
- `GET /api/leaderboard?sortBy=&limit=&period=` - Get global leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user's rank

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render or Railway
3. Set start command: `npm start`
4. Add environment variables (MONGODB_URI, JWT_SECRET)

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentalmathquiz
JWT_SECRET=your-super-secret-key
```

## License

MIT
