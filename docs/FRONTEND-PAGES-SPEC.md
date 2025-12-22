# Frontend Pages - Complete Feature Specification

**Project:** ServiceHub IT Helpdesk OSS  
**Document Version:** 1.0  
**Last Updated:** December 21, 2024

---

## 📋 Table of Contents

1. [Public Pages](#public-pages)
2. [Customer Pages](#customer-pages)
3. [Technician Pages](#technician-pages)
4. [Admin Pages](#admin-pages)
5. [Shared Components](#shared-components)

---

## 🌐 Public Pages

### 1. Login Page
**Route:** `/login`  
**Access:** Public (unauthenticated users only)  
**Purpose:** User authentication entry point

#### Features
- **Login Form**
  - Username input field
  - Password input field (masked)
  - "Remember me" checkbox (optional)
  - Submit button
  - Loading state during authentication
  
- **Validation**
  - Required field validation
  - Real-time error messages
  - Form-level error display
  
- **Navigation**
  - Link to Register page
  - "Forgot Password" link (optional for Week 3)
  
- **UI Elements**
  - ServiceHub branding/logo
  - Professional styling
  - Responsive design (mobile-friendly)
  - Error toast notifications
  - Success redirect to dashboard

#### User Flow
1. User enters username and password
2. Click "Sign In" button
3. System validates credentials
4. On success: Redirect to role-based dashboard
5. On failure: Show error message

---

### 2. Register Page
**Route:** `/register`  
**Access:** Public (unauthenticated users only)  
**Purpose:** New user account creation

#### Features
- **Registration Form**
  - Username input field
  - Email input field
  - Password input field (masked)
  - Confirm password field (masked)
  - Full name input field
  - Department input field (optional)
  - Submit button
  - Loading state during registration
  
- **Validation**
  - Username: 3-30 characters, unique
  - Email: Valid email format, unique
  - Password: Minimum 6 characters
  - Confirm password: Must match password
  - Real-time validation feedback
  
- **Navigation**
  - Link back to Login page
  - Terms of service acceptance (optional)
  
- **UI Elements**
  - Clear form layout
  - Field labels and placeholders
  - Validation error messages
  - Success message
  - Responsive design

#### User Flow
1. User fills in registration form
2. System validates input in real-time
3. User clicks "Register" button
4. System creates account (default role: customer)
5. Success message displayed
6. Redirect to login page

---

## 👤 Customer Pages

### 3. Customer Dashboard
**Route:** `/` or `/dashboard`  
**Access:** Protected (authenticated customers)  
**Purpose:** Overview of user's tickets and quick actions

#### Features
- **Statistics Cards**
  - My Total Tickets count
  - My Open Tickets count
  - My In-Progress Tickets count
  - My Resolved Tickets count
  - Visual color coding (green, yellow, blue, gray)
  
- **Quick Actions**
  - "Create New Ticket" button (prominent)
  - "View All My Tickets" link
  
- **Recent Activity Section**
  - Last 5 tickets created by user
  - Ticket number, title, status, priority
  - Created date/time
  - Click to view details
  
- **My Tickets Summary**
  - Mini table/list of user's tickets
  - Columns: Ticket #, Title, Status, Priority, Created Date
  - Pagination (5 per page)
  - Click to view full details
  
- **Navigation**
  - Top navigation bar
  - Sidebar menu (optional)
  - User profile section
  - Logout button

#### User Flow
1. User logs in
2. Lands on dashboard
3. Sees overview of their tickets
4. Can create new ticket or view existing tickets
5. Can navigate to other pages

---

### 4. Create Ticket Page
**Route:** `/tickets/new`  
**Access:** Protected (customers)  
**Purpose:** Submit new support request

#### Features
- **Ticket Creation Form**
  - Title input field (required, max 200 chars)
  - Description textarea (required, rich text optional)
  - Priority dropdown
    - Options: Low, Medium, High, Urgent
    - Default: Medium
  - Category dropdown
    - Options: Hardware, Software, Network, Access, Other
    - Default: Other
  - File attachment (optional - Week 3 feature)
  - Submit button
  - Cancel button
  
- **Form Validation**
  - Title: Required, 10-200 characters
  - Description: Required, minimum 20 characters
  - Real-time character count
  - Validation error messages
  
- **Preview Section (Optional)**
  - Live preview of ticket as being created
  - Shows how it will appear when submitted
  
- **Auto-Save (Optional - Week 3)**
  - Draft saved in localStorage
  - Restore draft on return
  
- **UI Elements**
  - Clear form layout
  - Field labels and help text
  - Character counters
  - Loading state on submit
  - Success/error notifications

#### User Flow
1. User clicks "Create New Ticket"
2. Fills in ticket details
3. Selects priority and category
4. Clicks "Submit"
5. System creates ticket (status: open, assigned: null)
6. Success message displayed
7. Redirect to ticket detail page or ticket list

---

### 5. My Tickets Page
**Route:** `/tickets` or `/my-tickets`  
**Access:** Protected (customers see only their tickets)  
**Purpose:** View all tickets created by the user

#### Features
- **Tickets List**
  - Table or card view
  - Columns/Fields:
    - Ticket Number (TKT-00001)
    - Title
    - Status badge (color-coded)
    - Priority badge (color-coded)
    - Category
    - Created Date
    - Last Updated
    - Assigned To (technician name or "Unassigned")
  
- **Filters**
  - Filter by Status (All, Open, In-Progress, Resolved, Closed)
  - Filter by Priority (All, Low, Medium, High, Urgent)
  - Filter by Category
  - Date range filter (optional)
  
- **Search**
  - Search by title or description
  - Real-time search (debounced)
  - Clear search button
  
- **Sort Options**
  - Sort by: Date Created, Priority, Status
  - Ascending/Descending toggle
  
- **Pagination**
  - 10, 20, or 50 tickets per page
  - Page numbers
  - Previous/Next buttons
  - Total count display
  
- **Actions per Ticket**
  - View Details button/link
  - Quick status indicator
  
- **Bulk Actions (Optional - Week 3)**
  - Select multiple tickets
  - Mark as read/unread

#### User Flow
1. User navigates to "My Tickets"
2. Sees list of all their tickets
3. Can filter, search, or sort
4. Clicks on ticket to view details
5. Can create new ticket from this page

---

### 6. Ticket Detail Page (Customer View)
**Route:** `/tickets/:id`  
**Access:** Protected (customers can only view their own tickets)  
**Purpose:** View complete ticket information and communication

#### Features
- **Ticket Header**
  - Ticket number (TKT-00001)
  - Title (large, prominent)
  - Status badge
  - Priority badge
  - Category tag
  - Created date and time
  - Created by (user name)
  
- **Ticket Details Section**
  - Full description (with formatting if rich text)
  - Assigned to: Technician name or "Unassigned"
  - Expected resolution time (optional)
  - Attachments (if any)
  - Last updated timestamp
  
- **Status Timeline (Optional)**
  - Visual timeline of status changes
  - Open → In Progress → Resolved → Closed
  - Timestamps for each transition
  
- **Comments Section**
  - All comments on the ticket
  - Comment author (name + role badge)
  - Comment text
  - Comment timestamp
  - Sorted chronologically (newest first or oldest first toggle)
  
- **Add Comment**
  - Comment textarea
  - Character count (max 1000 chars)
  - "Add Comment" button
  - Loading state
  - Real-time comment addition (no page refresh)
  
- **Actions**
  - Back to Tickets List button
  - Edit ticket (if status is still "open")
  - Close/Withdraw ticket option (optional)
  
- **Resolution Section** (if status is Resolved/Closed)
  - Resolution notes from technician
  - Resolved by (technician name)
  - Resolved date and time
  - Satisfaction rating (optional - Week 3)

#### User Flow
1. User clicks on ticket from list
2. Views complete ticket details
3. Reads existing comments
4. Can add new comment
5. Receives updates when technician responds
6. Can navigate back to ticket list

---

## 🔧 Technician Pages

### 7. Technician Dashboard
**Route:** `/dashboard`  
**Access:** Protected (technicians)  
**Purpose:** Overview of assigned work and workload

#### Features
- **Statistics Cards**
  - Total Tickets Assigned to Me
  - Open Tickets count
  - In-Progress Tickets count
  - Resolved Today count
  - Average resolution time (optional)
  
- **My Queue Section**
  - Tickets assigned to me
  - Quick view table
  - Columns: Ticket #, Title, Priority, Status, Created Date
  - Click to view/work on ticket
  - Sort by priority (urgent first)
  
- **Unassigned Tickets Section**
  - Tickets waiting for assignment
  - Can pick up/claim tickets
  - "Assign to Me" button
  - Count of unassigned tickets
  
- **Recent Activity**
  - Recently updated tickets
  - New comments on my tickets
  - Status changes
  
- **Quick Actions**
  - View all assigned tickets
  - View all open tickets
  - View tickets by priority

#### User Flow
1. Technician logs in
2. Sees dashboard with assigned tickets
3. Can pick up new tickets
4. Can work on existing assignments
5. Sees priority items first

---

### 8. Assigned Tickets Page (Technician)
**Route:** `/tickets/assigned` or `/my-work`  
**Access:** Protected (technicians)  
**Purpose:** Manage all tickets assigned to technician

#### Features
- **Tickets List**
  - All tickets assigned to logged-in technician
  - Table view with columns:
    - Ticket Number
    - Title
    - Priority (color-coded)
    - Status
    - Customer Name
    - Created Date
    - Last Updated
    - Time in Queue
  
- **Filters**
  - Filter by Status
  - Filter by Priority
  - Filter by Category
  - Show only overdue tickets
  
- **Sort Options**
  - Sort by priority (urgent first)
  - Sort by date created
  - Sort by last updated
  - Sort by time in queue
  
- **Actions per Ticket**
  - View Details
  - Quick status update
  - Add comment (quick action)
  - Mark as resolved (quick action)
  
- **Bulk Actions**
  - Select multiple tickets
  - Bulk status update
  - Bulk assignment (if admin)

#### User Flow
1. Technician navigates to assigned tickets
2. Views all their work
3. Prioritizes based on urgency
4. Updates ticket statuses
5. Works on tickets one by one

---

### 9. All Open Tickets Page (Technician)
**Route:** `/tickets/open`  
**Access:** Protected (technicians)  
**Purpose:** View all unresolved tickets in system

#### Features
- **Tickets List**
  - All open and in-progress tickets
  - Includes assigned and unassigned
  - Table view
  
- **Assignment Actions**
  - "Assign to Me" button for unassigned tickets
  - See who is assigned to each ticket
  
- **Filters**
  - Show only unassigned tickets
  - Show only urgent tickets
  - Filter by category
  
- **Workload Indicator**
  - Visual indicator of technician workload
  - Shows who has capacity
  - Helps balance assignments

#### User Flow
1. Technician views all open tickets
2. Identifies unassigned tickets
3. Claims tickets they can work on
4. System assigns ticket to them
5. Ticket appears in their queue

---

### 10. Ticket Detail Page (Technician View)
**Route:** `/tickets/:id`  
**Access:** Protected (technicians)  
**Purpose:** Work on ticket and update status

#### Features
- **All Customer View Features** (see #6)
  - Plus additional technician-specific features
  
- **Status Update Section**
  - Status dropdown
    - Options: Open, In-Progress, Resolved, Closed
  - Update button
  - Confirmation dialog for status changes
  - Automatic timestamp logging
  
- **Assignment Section** (if unassigned)
  - "Assign to Me" button
  - Assign to other technician dropdown (if admin)
  - Reassign option (if admin)
  
- **Resolution Section**
  - Resolution notes textarea (required when marking resolved)
  - Character count
  - Save resolution button
  - Auto-sets resolvedAt timestamp
  
- **Priority Update**
  - Change priority dropdown
  - Requires reason/note (optional)
  
- **Internal Notes Section** (Optional - Week 3)
  - Private notes visible only to technicians/admins
  - Not visible to customer
  - Useful for technical details
  
- **Time Tracking** (Optional - Week 3)
  - Log time spent on ticket
  - Start/Stop timer
  - Total time logged
  
- **Comment Actions**
  - Add comment (visible to customer)
  - Add internal note (not visible to customer)
  
- **Action Buttons**
  - Save Changes
  - Mark as Resolved (opens resolution dialog)
  - Close Ticket (if already resolved)
  - Reassign Ticket
  - Back to My Queue

#### User Flow
1. Technician opens assigned ticket
2. Reviews ticket details and history
3. Updates status to "In Progress"
4. Works on the issue
5. Adds comments/updates for customer
6. When done: Adds resolution notes
7. Marks ticket as "Resolved"
8. Customer sees resolution
9. If customer satisfied: Can close ticket

---

## 👨‍💼 Admin Pages

### 11. Admin Dashboard
**Route:** `/admin/dashboard`  
**Access:** Protected (admin only)  
**Purpose:** System-wide overview and management

#### Features
- **System Statistics Cards**
  - Total Tickets (all time)
  - Open Tickets (system-wide)
  - In-Progress Tickets
  - Resolved Today
  - Total Users
  - Active Technicians
  - Average Resolution Time
  - Customer Satisfaction (optional)
  
- **Charts & Analytics** (Optional - Week 3)
  - Tickets by status (pie chart)
  - Tickets over time (line chart)
  - Tickets by category (bar chart)
  - Tickets by priority distribution
  - Technician workload comparison
  
- **Recent Tickets Section**
  - Last 10 tickets created
  - Quick status view
  - Assigned technician
  - Customer name
  
- **Unassigned Tickets Alert**
  - Count of unassigned tickets
  - "Assign Now" link
  - Highlight urgent unassigned tickets
  
- **System Health Indicators** (Optional)
  - Average response time
  - Tickets overdue
  - Unassigned urgent tickets
  - Alert indicators
  
- **Quick Actions**
  - Create new ticket (on behalf of user)
  - Assign tickets
  - View all users
  - View system reports

#### User Flow
1. Admin logs in
2. Sees complete system overview
3. Identifies issues needing attention
4. Takes action on critical items
5. Navigates to specific management pages

---

### 12. All Tickets Page (Admin View)
**Route:** `/admin/tickets`  
**Access:** Protected (admin only)  
**Purpose:** Manage all tickets in the system

#### Features
- **Complete Tickets List**
  - All tickets from all users
  - Comprehensive table view
  - Columns:
    - Ticket Number
    - Title
    - Status
    - Priority
    - Category
    - Created By (customer)
    - Assigned To (technician)
    - Created Date
    - Last Updated
  
- **Advanced Filters**
  - Filter by status
  - Filter by priority
  - Filter by category
  - Filter by customer
  - Filter by assigned technician
  - Filter by date range
  - Show only unassigned
  - Show only overdue
  
- **Bulk Operations**
  - Select multiple tickets
  - Bulk assignment
  - Bulk status update
  - Bulk priority update
  - Bulk category change
  
- **Assignment Management**
  - Assign/reassign from list view
  - See technician workload
  - Balance workload across team
  - Auto-assign based on category (optional)
  
- **Export Options** (Optional - Week 3)
  - Export to CSV
  - Export filtered results
  - Custom date range export
  
- **Search**
  - Advanced search with multiple criteria
  - Search by ticket number
  - Search by customer name
  - Search by technician name

#### User Flow
1. Admin views all system tickets
2. Filters to find specific tickets
3. Assigns unassigned tickets
4. Rebalances workload
5. Monitors system performance

---

### 13. Assign Tickets Page (Admin)
**Route:** `/admin/assign-tickets`  
**Access:** Protected (admin only)  
**Purpose:** Efficiently assign tickets to technicians

#### Features
- **Unassigned Tickets Queue**
  - All unassigned tickets
  - Sorted by priority (urgent first)
  - Sorted by date created (oldest first)
  
- **Technician Panel**
  - List of all technicians
  - Current workload per technician
  - Number of assigned tickets
  - Number of open vs in-progress
  - Capacity indicator (green/yellow/red)
  
- **Assignment Interface**
  - Drag-and-drop assignment (optional)
  - Or: Select ticket → Select technician → Assign button
  - Bulk assignment mode
  - Auto-assign suggestions based on:
    - Technician specialization (optional)
    - Current workload
    - Ticket category
  
- **Assignment Rules** (Optional - Week 3)
  - Round-robin assignment
  - Skill-based routing
  - Workload balancing
  
- **Assignment History**
  - See recent assignments
  - Undo last assignment option
  - Assignment change log

#### User Flow
1. Admin navigates to assignment page
2. Sees unassigned tickets
3. Checks technician workloads
4. Assigns tickets to available technicians
5. System sends notification to technician
6. Ticket moves to technician's queue

---

### 14. User Management Page (Admin)
**Route:** `/admin/users`  
**Access:** Protected (admin only)  
**Purpose:** Manage system users and roles

#### Features
- **Users List**
  - All system users
  - Table view with columns:
    - Username
    - Email
    - Full Name
    - Department
    - Role (badge)
    - Status (Active/Inactive)
    - Last Login
    - Created Date
  
- **User Actions**
  - Edit user details
  - Change user role (customer ↔ technician ↔ admin)
  - Activate/Deactivate account
  - Reset password (optional)
  - Delete user (with confirmation)
  
- **Add New User**
  - Create user form
  - Same as registration but admin can set role
  - Can create technician or admin accounts
  
- **Filters**
  - Filter by role (customers, technicians, admins)
  - Filter by status (active, inactive)
  - Filter by department
  
- **Search**
  - Search by username, email, or name
  
- **User Statistics**
  - Total users count
  - Users by role breakdown
  - Active users today
  - New users this week

#### User Flow
1. Admin navigates to user management
2. Views all users
3. Can edit user details or roles
4. Can activate/deactivate accounts
5. Can create new users with specific roles

---

### 15. Reports Page (Admin)
**Route:** `/admin/reports`  
**Access:** Protected (admin only)  
**Purpose:** Generate and view system reports

#### Features
- **Report Types**
  - Tickets Summary Report
  - Technician Performance Report
  - Category Analysis Report
  - Customer Activity Report
  - Resolution Time Report
  
- **Report Filters**
  - Date range selector
  - Technician filter
  - Category filter
  - Status filter
  - Department filter
  
- **Report Display**
  - Summary statistics
  - Data tables
  - Charts and graphs (optional)
  - Trends and insights
  
- **Export Options**
  - Export to PDF (optional - Week 3)
  - Export to CSV
  - Print report
  - Email report (optional)
  
- **Saved Reports** (Optional - Week 3)
  - Save report configurations
  - Quick access to frequent reports
  - Schedule recurring reports

#### User Flow
1. Admin navigates to reports
2. Selects report type
3. Configures filters (date range, etc.)
4. Generates report
5. Reviews data and charts
6. Exports if needed

---

## 🧩 Shared Components

### Navigation Bar (All Protected Pages)
- Logo/Brand name (clickable → home)
- Navigation links (role-based)
- User profile dropdown
  - User name
  - Role indicator
  - My Profile link (optional)
  - Settings link (optional)
  - Logout button
- Notification icon (optional - Week 3)
- Search bar (global search - optional)

### Sidebar (Optional - can use top nav instead)
- Dashboard link
- Tickets link (role-based sub-items)
- Users link (admin only)
- Reports link (admin only)
- Settings link
- Collapse/Expand toggle

### Ticket Card Component
- Ticket number
- Title
- Status badge
- Priority badge
- Category tag
- Customer name
- Assigned technician
- Created date
- Last updated
- Click to view details

### Status Badge Component
- Color-coded by status
- Open: Green
- In-Progress: Yellow
- Resolved: Blue
- Closed: Gray
- Icon indicator

### Priority Badge Component
- Color-coded by priority
- Low: Gray
- Medium: Blue
- High: Orange
- Urgent: Red
- Icon indicator

### Comment Component
- User avatar (optional)
- User name
- User role badge
- Comment text
- Timestamp
- Edit/Delete (if own comment)

### Modal/Dialog Components
- Assign ticket modal
- Update status modal
- Resolution modal
- Confirmation dialogs
- Delete confirmation

### Loading States
- Skeleton loaders for lists
- Spinner for actions
- Progress bars (optional)
- Loading overlay

### Empty States
- No tickets message
- No results message
- Helpful illustrations
- Call-to-action buttons

### Error States
- Error message display
- Retry button
- Back to safety button

---

## 📱 Responsive Design Notes

### Mobile View (< 768px)
- Stack cards vertically
- Collapse navigation to hamburger menu
- Simplify tables to card view
- Touch-friendly buttons (min 44px)
- Bottom navigation bar (optional)

### Tablet View (768px - 1024px)
- 2-column layouts where appropriate
- Collapsible sidebar
- Optimized forms
- Touch and mouse support

### Desktop View (> 1024px)
- Full table views
- Sidebar navigation
- Multi-column dashboards
- Hover states
- Keyboard shortcuts (optional)

---

## 🎨 UI/UX Considerations

### Color Scheme
- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Gray scale for text and backgrounds

### Typography
- Headers: Bold, larger sizes
- Body: Regular weight
- Labels: Medium weight
- Links: Primary color, underline on hover

### Spacing
- Consistent padding and margins
- Card spacing: 1.5rem
- Section spacing: 2rem
- Form field spacing: 1rem

### Feedback
- Toast notifications for actions
- Inline validation messages
- Loading indicators
- Success confirmations
- Error messages

---

## ✅ Implementation Priority

### Week 1 (Must Have)
- Login page
- Register page
- Dashboard (basic)
- Create ticket page
- Tickets list page
- Ticket detail page (basic)

### Week 2 (Should Have)
- Comments functionality
- Assign tickets (admin)
- Update status (technician)
- Filters and search
- Role-specific dashboards

### Week 3 (Nice to Have)
- Charts and analytics
- Reports page
- User management
- Advanced filters
- Export functionality

---

**Document Status:** ✅ Complete  
**Total Pages:** 15 pages  
**Total Features:** 200+ features  
**Ready for:** Development Sprint 1
