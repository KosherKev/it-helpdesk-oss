# IT Helpdesk OSS - 3-Week Project Plan

**Project Name:** ServiceHub - IT Helpdesk Operations Support System  
**Duration:** 3 Weeks  
**Team Size:** 5 Members  
**Target:** University Project Demonstration

---

## 🎯 Project Overview

A simplified **IT Helpdesk Ticket Management System** that demonstrates core OSS concepts without complex infrastructure requirements.

### What It Is
- Web-based ticket management system
- Users can create support tickets
- Technicians can manage and resolve tickets
- Admins can oversee operations
- Dashboard with key metrics

### Why It's Perfect for 3 Weeks
✅ No complex hardware/network setup  
✅ Uses familiar CRUD operations  
✅ Clear deliverables per week  
✅ Each team member has defined tasks  
✅ Easy to demonstrate  
✅ Actually useful in real scenarios  

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (React + Tailwind)           │
│  - Login/Register                               │
│  - Dashboard (role-based)                       │
│  - Ticket Management                            │
│  - User Management                              │
└─────────────────┬───────────────────────────────┘
                  │ REST API (JSON)
                  ↓
┌─────────────────────────────────────────────────┐
│         Backend (Node.js + Express)             │
│  - JWT Authentication                           │
│  - Ticket CRUD Operations                       │
│  - User Management                              │
│  - Role-based Access Control                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│              MongoDB Database                   │
│  - Users Collection                             │
│  - Tickets Collection                           │
│  - Comments Collection                          │
└─────────────────────────────────────────────────┘
```

---

## 📋 Core Features (Must-Have)

### 1. Authentication & User Management
- User registration and login
- JWT token-based authentication
- Three user roles:
  - **Customer**: Create and view own tickets
  - **Technician**: View and manage assigned tickets
  - **Admin**: Full system access

### 2. Ticket Management
- **Create Ticket** (Customer)
  - Title, description, priority, category
  - Automatic status: "Open"
  
- **View Tickets**
  - List view with filters (status, priority, assigned)
  - Detail view with full information
  - Role-based visibility
  
- **Assign Ticket** (Admin/Technician)
  - Assign to technician
  - Update priority
  
- **Update Status** (Technician)
  - In Progress → Resolved → Closed
  - Add resolution notes
  
- **Comments** (All users)
  - Add comments to tickets
  - View comment history

### 3. Dashboard
- **Statistics Cards**
  - Total tickets
  - Open tickets
  - In progress
  - Resolved today
  
- **Role-Based Views**
  - Customer: My tickets
  - Technician: Assigned to me
  - Admin: All tickets overview
  
- **Recent Activity**
  - Latest tickets
  - Recent updates

---

## 🎨 Optional Features (Nice-to-Have)

### Week 3 Additions (if time permits)
1. **Search & Filter**
   - Search tickets by title/description
   - Filter by status, priority, category
   
2. **Simple Charts**
   - Tickets by status (pie chart)
   - Tickets over time (line chart)
   
3. **Email Notifications**
   - Simple email on ticket creation
   - Status update notifications
   
4. **File Attachments**
   - Upload screenshots/files to tickets
   
5. **Categories**
   - Hardware, Software, Network, Access, Other

---

## 🗂️ Data Models

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  role: "customer" | "technician" | "admin",
  fullName: String,
  department: String,
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Ticket
```javascript
{
  _id: ObjectId,
  ticketNumber: String,           // Auto-generated: "TKT-0001"
  title: String,
  description: String,
  priority: "low" | "medium" | "high" | "urgent",
  status: "open" | "in-progress" | "resolved" | "closed",
  category: "hardware" | "software" | "network" | "access" | "other",
  
  createdBy: ObjectId (User),     // Customer who created
  assignedTo: ObjectId (User),    // Technician assigned (null if unassigned)
  
  resolution: String,             // Resolution notes
  resolvedAt: Date,
  closedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  _id: ObjectId,
  ticket: ObjectId (Ticket),
  user: ObjectId (User),
  text: String,
  createdAt: Date
}
```

---

## 📊 Pages & UI Flow

### Public Pages
1. **Login Page** - Simple login form
2. **Register Page** - User registration

### Customer Dashboard
1. **My Tickets** - List of tickets I created
2. **Create Ticket** - Form to submit new ticket
3. **Ticket Details** - View single ticket with comments

### Technician Dashboard
1. **Assigned Tickets** - Tickets assigned to me
2. **All Open Tickets** - Pick up unassigned tickets
3. **Ticket Details** - View and update ticket
4. **Update Status** - Change ticket status

### Admin Dashboard
1. **All Tickets** - System-wide ticket view
2. **Assign Tickets** - Assign to technicians
3. **User Management** - View/manage users
4. **Statistics** - Overall system metrics

---

## 🎯 Success Criteria

### Must Demonstrate
✅ User can register and login  
✅ Customer can create tickets  
✅ Admin can assign tickets to technicians  
✅ Technician can update ticket status  
✅ Dashboard shows live statistics  
✅ Comments/communication on tickets  
✅ Role-based access control works  

### Nice to Have
✅ Search and filter functionality  
✅ Basic charts/visualization  
✅ Professional UI/UX  
✅ Responsive design  

---

## 📈 OSS Concepts Demonstrated

This project showcases key Operations Support System principles:

1. **Incident Management**
   - Tickets represent incidents/requests
   - Lifecycle tracking (open → resolved)
   
2. **Resource Allocation**
   - Assigning tickets to available technicians
   - Workload distribution
   
3. **Service Level Tracking**
   - Priority levels
   - Resolution times
   - Status monitoring
   
4. **User Management**
   - Role-based access
   - Multi-level permissions
   
5. **Operations Dashboard**
   - Real-time metrics
   - Performance tracking
   
6. **Audit Trail**
   - Comment history
   - Status changes tracked

---

## 🚀 Deployment

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Production (Optional)
- Deploy to Vercel/Netlify (Frontend)
- Deploy to Render/Railway (Backend)
- MongoDB Atlas (Database)

---

## 📝 Deliverables

### Code
- ✅ GitHub repository with clean commits
- ✅ README with setup instructions
- ✅ Well-organized code structure
- ✅ Comments on complex logic

### Documentation
- ✅ User manual with screenshots
- ✅ API documentation
- ✅ Database schema
- ✅ Architecture diagram

### Presentation
- ✅ PowerPoint slides (10-15 slides)
- ✅ Live demo (5-7 minutes)
- ✅ Video recording (optional backup)
- ✅ Team roles explanation

---

## 🎓 Learning Outcomes

Students will learn:
- Full-stack web development
- RESTful API design
- Database modeling
- Authentication & authorization
- Role-based access control
- Project management
- Team collaboration
- Git workflow
- Agile methodology (sprints)

---

## 💡 Why This Beats Complex Projects

### Compared to Network Monitoring OSS:
❌ Network monitoring: Needs SNMP, simulators, complex setup  
✅ Helpdesk: Just web forms and database  

❌ Network monitoring: Hardware dependencies  
✅ Helpdesk: Works anywhere with internet  

❌ Network monitoring: Hard to demo without equipment  
✅ Helpdesk: Easy live demo on laptop  

❌ Network monitoring: 3 weeks not enough  
✅ Helpdesk: Perfect for 3 weeks  

### Same OSS Concepts, Easier Implementation
- Both track operational issues
- Both have dashboards and metrics
- Both demonstrate service management
- Helpdesk is just more practical for classroom!

---

**Project Status:** ✅ Ready for Team Assignment  
**Next Step:** Review 5-person task distribution in TEAM-ASSIGNMENT.md
