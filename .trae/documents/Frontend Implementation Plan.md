I have analyzed the frontend and found that while the basic routing and layout structure is in place, **most of the critical functionality is either missing or relies on hardcoded mock data**.

Here is the plan to fully implement the frontend features to match the backend and the specification.

# Frontend Implementation Plan

## Phase 1: Core Ticket Functionality (Highest Priority)
**Goal:** Enable users to view, comment on, and manage tickets.
1.  **Create Service Layer:**
    *   Create `src/services/ticketService.js` for all ticket-related API calls.
    *   Create `src/services/commentService.js` for comment operations.
2.  **Implement Ticket Detail Page (`src/pages/TicketDetail.jsx`):**
    *   **Header:** Show Ticket ID, Status (with color badges), Priority, and Dates.
    *   **Details:** Show Description, Category, Assigned Technician, and Creator.
    *   **Comments Section:**
        *   List existing comments with timestamps and user details.
        *   "Add Comment" form.
    *   **Actions (Role-based):**
        *   **Technician/Admin:** Change Status, Change Priority, Assign/Reassign.
        *   **Customer:** Close Ticket (if allowed), Add Comment.

## Phase 2: User Management (Admin)
**Goal:** Replace mock data with real user management capabilities.
1.  **Create Service Layer:**
    *   Create `src/services/userService.js` for user API calls.
2.  **Update User Management Page (`src/pages/UserManagement.jsx`):**
    *   **Fetch Data:** Use `userService.getAllUsers()` to populate the table.
    *   **Features:**
        *   Add "Edit User" modal (Role, Department, Active Status).
        *   Add "Deactivate User" button.
        *   Implement Search/Filter by Role.

## Phase 3: Dashboards & Analytics
**Goal:** Connect dashboards to the real live statistics endpoints.
1.  **Create Service Layer:**
    *   Create `src/services/dashboardService.js`.
2.  **Update Technician Dashboard (`src/pages/TechnicianDashboard.jsx`):**
    *   Replace mock stats with data from `/dashboard/workload` and ticket counts.
    *   Show real "My Assigned Tickets" list.
3.  **Update Admin Dashboard (`src/pages/AdminDashboard.jsx`):**
    *   Use `/dashboard/stats` for the overview cards.
    *   Implement "Unassigned Tickets" alert using real data.
4.  **Update Reports Page (`src/pages/Reports.jsx`):**
    *   Integrate `/admin/reports/generate` endpoint.
    *   Add Date Range Picker (Start Date, End Date).
    *   Add Report Type selector (General, Performance).

## Phase 4: Refinement
*   **Navigation:** Ensure all links in the Sidebar/Layouts point to the correct routes.
*   **Error Handling:** Ensure API errors are gracefully handled (toasts).
