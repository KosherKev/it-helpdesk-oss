# ServiceHub - IT Helpdesk OSS

> 🎫 A lightweight IT Helpdesk Operations Support System for managing support tickets

**Status:** ✅ Scaffolding Complete - Ready for Development  
**Duration:** 3 Weeks  
**Team Size:** 5 Members

---

## ✨ Project Overview

ServiceHub is an IT Helpdesk ticket management system designed to be completed in 3 weeks by a 5-person university team. It demonstrates core Operations Support System (OSS) concepts through practical helpdesk functionality.

### Key Features
- 🔐 JWT Authentication
- 🎫 Ticket Management (Create, View, Update, Assign)
- 💬 Comments System
- 📊 Role-based Dashboards
- 👥 User Roles (Customer, Technician, Admin)
- 🔍 Search & Filter

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Git

### Installation

```bash
# 1. Navigate to project
cd it-helpdesk-oss

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies (new terminal)
cd ../frontend
npm install

# 4. Start MongoDB (new terminal)
mongod

# 5. Start backend (port 5000)
cd backend
npm run dev

# 6. Start frontend (port 5173)
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
it-helpdesk-oss/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app
│   │   └── server.js       # Server entry point
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   ├── stores/        # Zustand stores
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── docs/                   # Documentation
│   ├── PROJECT-PLAN.md
│   ├── TEAM-ASSIGNMENT.md
│   └── 3-WEEK-TIMELINE.md
│
└── README.md              # This file
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **Logging:** Winston
- **Validation:** Joi

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Zustand
- **HTTP:** Axios
- **Notifications:** React Hot Toast

---

## ✅ What's Been Scaffolded

### Backend (Complete) ✅
- Express server configuration
- MongoDB connection
- User authentication (register/login/logout)
- JWT middleware
- Error handling middleware
- User, Ticket, Comment models
- API routes structure
- Response utilities
- Winston logger

### Frontend (Complete) ✅
- React + Vite setup
- Tailwind CSS configuration
- React Router v6 routing
- Zustand auth store with persistence
- Axios API service with interceptors
- Login & Register pages
- Protected routes
- Dashboard (placeholder)
- Ticket pages (placeholders)

---

## 🔧 Configuration

### Backend Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /api/health` - Server health check

---

## 🎯 Next Steps (Sprint 1 - Days 1-7)

### Backend Tasks
- [ ] Create ticket CRUD endpoints
- [ ] Implement ticket assignment logic
- [ ] Add status update functionality
- [ ] Create comment endpoints

### Frontend Tasks
- [ ] Build Create Ticket form
- [ ] Build Tickets List page
- [ ] Build Ticket Detail page
- [ ] Implement real-time updates

### Integration
- [ ] Connect frontend to backend APIs
- [ ] Test complete ticket flow
- [ ] Bug fixes

---

## 📚 Documentation

- [Project Plan](docs/PROJECT-PLAN.md) - Complete project overview
- [Team Assignment](docs/TEAM-ASSIGNMENT.md) - 5-person task distribution
- [3-Week Timeline](docs/3-WEEK-TIMELINE.md) - Day-by-day checklist

---

## 👥 Team Roles

| Member | Role | Focus Area |
|--------|------|------------|
| Member 1 | Team Lead | Architecture, Database, Integration |
| Member 2 | Backend Dev | APIs, Business Logic |
| Member 3 | Frontend Dev | React Components, Pages |
| Member 4 | UI/UX | Design, Styling, UX Flow |
| Member 5 | Integration | Testing, Docs, Deployment |

---

## 🧪 Testing the Setup

### Test Backend
```bash
cd backend
npm run dev

# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Test Frontend
```bash
cd frontend
npm run dev

# Visit http://localhost:5173
# Try registering and logging in
```

---

## 🐛 Common Issues

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod

# Or using Homebrew (macOS)
brew services start mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Project Status

**Planning:** ✅ Complete (1,950+ lines of documentation)  
**Backend Scaffolding:** ✅ Complete (Authentication functional)  
**Frontend Scaffolding:** ✅ Complete (Login/Dashboard working)  
**Sprint 1:** 🚧 Ready to Start  

---

## 🎬 Quick Demo Script

1. **Start Services:**
   - MongoDB running
   - Backend on port 5000
   - Frontend on port 5173

2. **Register User:**
   - Navigate to http://localhost:5173/register
   - Create account
   - Redirected to login

3. **Login:**
   - Enter credentials
   - Redirected to dashboard

4. **Explore:**
   - View dashboard
   - Check protected routes

---

## 💡 Development Tips

1. **Daily Commits** - Commit working code every day
2. **Branch Strategy** - Use feature branches
3. **Code Reviews** - Review before merging to main
4. **Test Locally** - Test before pushing
5. **Document Changes** - Update docs as you go

---

## 📈 3-Week Milestones

- **Week 1:** Foundation (Auth + Basic Ticket CRUD)
- **Week 2:** Features (Dashboard + Comments + Assignment)
- **Week 3:** Polish (Testing + Documentation + Presentation)

---

## 🎓 Learning Outcomes

✅ Full-stack web development  
✅ RESTful API design  
✅ JWT authentication  
✅ State management with Zustand  
✅ React best practices  
✅ MongoDB modeling  
✅ Team collaboration  
✅ Agile methodology  

---

## 🤝 Contributing

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/ticket-creation

# Make changes and commit
git add .
git commit -m "feat: add ticket creation form"

# Push and create PR
git push origin feature/ticket-creation
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Add tests

---

## 📞 Support & Resources

- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## ✨ Status Summary

**✅ Scaffolding Complete!**

You now have:
- Fully configured backend with auth
- Fully configured frontend with routing
- Complete documentation (11 files, 1,950+ lines)
- Clear 3-week plan with daily tasks
- 5-person team distribution

**Ready to build! 🚀**

---

**Created:** December 21, 2024  
**Last Updated:** December 21, 2024  
**Status:** ✅ Ready for Development

**Built with ❤️ by ServiceHub Team**
