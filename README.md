# V-Music - Full Stack Music Application 🎵

A beautiful music streaming and playlist management application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Music Search**: Search for tracks using Spotify API
- **Trending Songs**: View top 20 trending songs on homepage
- **Favorites**: Like and save your favorite tracks
- **Playlists**: Create, update, and delete custom playlists
- **Audio Playback**: Preview tracks directly in the app
- **Responsive Design**: Beautiful UI that works on all devices

## 📁 Project Structure

```
v-music/
├── frontend/                # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Signup.js         # Signup page
│   │   │   ├── Home.js           # Main app page
│   │   │   ├── Auth.css          # Auth pages styles
│   │   │   └── Home.css          # Home page styles
│   │   ├── App.js                # Main React component
│   │   └── App.css               # Global styles
│   └── package.json
│
├── backend/                 # Node.js Backend API
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── models/
│   │   └── User.js          # User model
│   ├── routes/
│   │   ├── auth.js          # Auth routes
│   │   └── user.js          # User routes
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   └── package.json
│
├── package.json             # Root package.json (run both servers)
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Quick Start (Run Both Servers)

1. Install root dependencies:
```bash
npm install
```

2. Install all dependencies (frontend + backend):
```bash
npm run install-all
```

3. Run both servers:
```bash
npm run dev
```

### Manual Setup

#### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5001
MONGODB_URL=mongodb+srv://bhawana2024_db_user:bhawanamusicproject@musicproject.dnd0zv7.mongodb.net/?appName=MusicProject
JWT_SECRET=v-music-super-secret-jwt-key-2024
```

4. Start the server:
```bash
npm run dev
```

The API will be running at `http://localhost:5001`

#### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The app will be running at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### User Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/favorites` | Get all favorites |
| POST | `/api/user/favorites` | Add to favorites |
| DELETE | `/api/user/favorites/:trackId` | Remove from favorites |
| GET | `/api/user/playlists` | Get all playlists |
| POST | `/api/user/playlists` | Create playlist |
| PUT | `/api/user/playlists/:id` | Update playlist |
| DELETE | `/api/user/playlists/:id` | Delete playlist |
| POST | `/api/user/playlists/:id/tracks` | Add track to playlist |
| DELETE | `/api/user/playlists/:id/tracks/:trackId` | Remove track |

## 🎨 Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Axios
- CSS (Glassmorphism Design)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5001) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |

## 🚀 NPM Scripts

### Root Directory
| Script | Description |
|--------|-------------|
| `npm run dev` | Run both frontend and backend |
| `npm run frontend` | Run only frontend |
| `npm run backend` | Run only backend |
| `npm run install-all` | Install all dependencies |

### Frontend
| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |

### Backend
| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (hot reload) |

## 📝 License

MIT License - feel free to use this project for learning and personal use.

---

Made with ❤️ by Bhawana
# melody_project
# melody_project
# melody_sem3
