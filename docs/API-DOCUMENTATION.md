# API Routes - Complete Documentation

**Project:** ServiceHub IT Helpdesk OSS  
**API Version:** 1.0  
**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer Token  
**Last Updated:** December 21, 2024

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Tickets](#tickets)
4. [Comments](#comments)
5. [Dashboard & Statistics](#dashboard--statistics)
6. [Admin Operations](#admin-operations)
7. [Error Responses](#error-responses)
8. [Request/Response Examples](#requestresponse-examples)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register New User
**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Purpose:** Create a new user account

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars, unique)",
  "email": "string (required, valid email, unique)",
  "password": "string (required, min 6 chars)",
  "fullName": "string (optional)",
  "department": "string (optional)"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "ObjectId",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error or duplicate username/email
- `500 Internal Server Error` - Server error

**Notes:**
- Default role is "customer"
- Password is automatically hashed (bcrypt)
- User must login after registration

---

### Login
**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Purpose:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT token string",
    "expiresIn": 86400,
    "user": {
      "id": "ObjectId",
      "username": "string",
      "email": "string",
      "role": "customer | technician | admin",
      "fullName": "string",
      "department": "string"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account is inactive
- `500 Internal Server Error` - Server error

**Notes:**
- Token expires in 24 hours (configurable)
- Updates lastLogin timestamp
- Token should be stored and used for subsequent requests

---

### Logout
**Endpoint:** `POST /auth/logout`  
**Access:** Protected  
**Purpose:** Logout user (client-side token removal)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Notes:**
- Server logs the logout event
- Client must remove token from storage
- No server-side token blacklisting (stateless JWT)

---

### Get Current User Profile
**Endpoint:** `GET /auth/me`  
**Access:** Protected  
**Purpose:** Get authenticated user's profile information

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "user": {
      "id": "ObjectId",
      "username": "string",
      "email": "string",
      "role": "customer | technician | admin",
      "fullName": "string",
      "department": "string",
      "isActive": true,
      "createdAt": "ISO date",
      "lastLogin": "ISO date"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired token
- `403 Forbidden` - Account inactive

---

## 👥 Users

### Get All Users (Admin Only)
**Endpoint:** `GET /users`  
**Access:** Protected (Admin only)  
**Purpose:** Retrieve list of all system users

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (optional) - Filter by role: customer, technician, admin
- `status` (optional) - Filter by status: active, inactive
- `department` (optional) - Filter by department
- `search` (optional) - Search by username, email, or name
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `sort` (optional, default: -createdAt) - Sort field

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved",
  "data": {
    "users": [
      {
        "id": "ObjectId",
        "username": "string",
        "email": "string",
        "fullName": "string",
        "department": "string",
        "role": "string",
        "isActive": true,
        "createdAt": "ISO date",
        "lastLogin": "ISO date"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3,
      "limit": 20
    }
  }
}
```

---

### Get User by ID
**Endpoint:** `GET /users/:id`  
**Access:** Protected (Admin or self)  
**Purpose:** Get single user details

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "user": {
      "id": "ObjectId",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "department": "string",
      "role": "string",
      "isActive": true,
      "createdAt": "ISO date",
      "lastLogin": "ISO date"
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `403 Forbidden` - Not authorized to view this user

---

### Update User
**Endpoint:** `PATCH /users/:id`  
**Access:** Protected (Admin or self)  
**Purpose:** Update user information

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User ObjectId

**Request Body (all fields optional):**
```json
{
  "email": "string (valid email)",
  "fullName": "string",
  "department": "string",
  "role": "string (admin only)",
  "isActive": "boolean (admin only)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "ObjectId",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "department": "string",
      "role": "string",
      "isActive": true
    }
  }
}
```

**Notes:**
- Regular users can only update their own email, fullName, department
- Only admins can change role and isActive status
- Username cannot be changed

---

### Delete User
**Endpoint:** `DELETE /users/:id`  
**Access:** Protected (Admin only)  
**Purpose:** Soft delete user (set inactive)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Notes:**
- Soft delete (sets isActive to false)
- Cannot delete self
- User's tickets remain in system

---

### Get Technicians List
**Endpoint:** `GET /users/technicians`  
**Access:** Protected (Admin, Technician)  
**Purpose:** Get list of all technicians for assignment

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `active` (optional, default: true) - Only active technicians

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Technicians retrieved",
  "data": {
    "technicians": [
      {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string",
        "assignedTickets": 5,
        "workload": "low | medium | high"
      }
    ]
  }
}
```

**Notes:**
- Includes current ticket count per technician
- Workload calculated based on assigned tickets

---

## 🎫 Tickets

### Create Ticket
**Endpoint:** `POST /tickets`  
**Access:** Protected (All authenticated users)  
**Purpose:** Create a new support ticket

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (required, 10-200 chars)",
  "description": "string (required, min 20 chars)",
  "priority": "low | medium | high | urgent (optional, default: medium)",
  "category": "hardware | software | network | access | other (optional, default: other)"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticket": {
      "id": "ObjectId",
      "ticketNumber": "TKT-00001",
      "title": "string",
      "description": "string",
      "priority": "string",
      "status": "open",
      "category": "string",
      "createdBy": {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string"
      },
      "assignedTo": null,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated

**Notes:**
- Auto-generates sequential ticket number
- Status automatically set to "open"
- CreatedBy automatically set to authenticated user
- AssignedTo is null initially

---

### Get All Tickets
**Endpoint:** `GET /tickets`  
**Access:** Protected (Role-based filtering)  
**Purpose:** Retrieve tickets list with filtering

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status: open, in-progress, resolved, closed
- `priority` (optional) - Filter by priority: low, medium, high, urgent
- `category` (optional) - Filter by category
- `assignedTo` (optional) - Filter by assigned technician ID
- `createdBy` (optional) - Filter by creator user ID
- `search` (optional) - Search in title and description
- `sortBy` (optional, default: -createdAt) - Sort field
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Items per page

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Tickets retrieved",
  "data": {
    "tickets": [
      {
        "id": "ObjectId",
        "ticketNumber": "TKT-00001",
        "title": "string",
        "description": "string (truncated)",
        "priority": "string",
        "status": "string",
        "category": "string",
        "createdBy": {
          "id": "ObjectId",
          "username": "string",
          "fullName": "string"
        },
        "assignedTo": {
          "id": "ObjectId",
          "username": "string",
          "fullName": "string"
        },
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 8,
      "limit": 20
    }
  }
}
```

**Role-Based Behavior:**
- **Customer**: Only sees tickets they created
- **Technician**: Sees all tickets
- **Admin**: Sees all tickets

**Notes:**
- Description is truncated to 200 chars in list view
- Results are paginated
- Can combine multiple filters

---

### Get Single Ticket
**Endpoint:** `GET /tickets/:id`  
**Access:** Protected (Role-based)  
**Purpose:** Get complete ticket details

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Ticket ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket retrieved",
  "data": {
    "ticket": {
      "id": "ObjectId",
      "ticketNumber": "TKT-00001",
      "title": "string",
      "description": "string (full text)",
      "priority": "string",
      "status": "string",
      "category": "string",
      "createdBy": {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string",
        "email": "string",
        "department": "string"
      },
      "assignedTo": {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string"
      },
      "resolution": "string (if resolved)",
      "resolvedAt": "ISO date (if resolved)",
      "closedAt": "ISO date (if closed)",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - Ticket doesn't exist
- `403 Forbidden` - Not authorized to view this ticket

**Role-Based Access:**
- **Customer**: Can only view tickets they created
- **Technician**: Can view all tickets
- **Admin**: Can view all tickets

---

### Update Ticket
**Endpoint:** `PATCH /tickets/:id`  
**Access:** Protected (Role-based)  
**Purpose:** Update ticket information

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Ticket ObjectId

**Request Body (all fields optional):**
```json
{
  "title": "string (10-200 chars)",
  "description": "string (min 20 chars)",
  "priority": "low | medium | high | urgent",
  "category": "hardware | software | network | access | other",
  "status": "open | in-progress | resolved | closed (technician/admin only)",
  "assignedTo": "ObjectId (admin only)",
  "resolution": "string (technician/admin only, required when status=resolved)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": {
    "ticket": {
      // Full ticket object
    }
  }
}
```

**Permission Rules:**
- **Customer**: Can edit title, description, priority (only if status is "open")
- **Technician**: Can update status, add resolution, change priority/category
- **Admin**: Can update all fields including assignment

**Notes:**
- Status changes are logged
- When status changes to "resolved", resolvedAt timestamp is set
- When status changes to "closed", closedAt timestamp is set
- Resolution is required when marking as resolved

---

### Delete Ticket
**Endpoint:** `DELETE /tickets/:id`  
**Access:** Protected (Admin only)  
**Purpose:** Permanently delete a ticket

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Ticket ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

**Notes:**
- Hard delete (permanent)
- Also deletes all associated comments
- Cannot be undone
- Use with caution

---

### Assign Ticket
**Endpoint:** `PATCH /tickets/:id/assign`  
**Access:** Protected (Admin, Technician can self-assign)  
**Purpose:** Assign ticket to a technician

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Ticket ObjectId

**Request Body:**
```json
{
  "technicianId": "ObjectId (required)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": {
    "ticket": {
      "id": "ObjectId",
      "ticketNumber": "TKT-00001",
      "assignedTo": {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string"
      }
    }
  }
}
```

**Permission Rules:**
- **Admin**: Can assign to any technician
- **Technician**: Can only assign to self
- **Customer**: Cannot assign

**Notes:**
- Technicians can "pick up" unassigned tickets
- Reassignment is allowed
- Status may auto-update based on assignment

---

### Update Ticket Status
**Endpoint:** `PATCH /tickets/:id/status`  
**Access:** Protected (Technician, Admin)  
**Purpose:** Update ticket status

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Ticket ObjectId

**Request Body:**
```json
{
  "status": "open | in-progress | resolved | closed (required)",
  "resolution": "string (required if status=resolved)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "ticket": {
      "id": "ObjectId",
      "status": "string",
      "resolution": "string",
      "resolvedAt": "ISO date",
      "closedAt": "ISO date"
    }
  }
}
```

**Status Workflow:**
- `open` → `in-progress` (when technician starts work)
- `in-progress` → `resolved` (when issue is fixed, requires resolution text)
- `resolved` → `closed` (final state, can be done by customer or admin)
- Can also go: `open` → `resolved` (skip in-progress if quick fix)

**Notes:**
- Resolution notes are required when marking as resolved
- Timestamps are automatically set (resolvedAt, closedAt)
- Status change is logged in ticket history

---

### Get My Tickets
**Endpoint:** `GET /tickets/my-tickets`  
**Access:** Protected (Customer)  
**Purpose:** Get tickets created by authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- Same as "Get All Tickets" endpoint
- Results automatically filtered to authenticated user's tickets

**Success Response:** Same structure as "Get All Tickets"

**Notes:**
- Convenience endpoint for customers
- Same as GET /tickets with createdBy filter

---

### Get Assigned Tickets
**Endpoint:** `GET /tickets/assigned`  
**Access:** Protected (Technician, Admin)  
**Purpose:** Get tickets assigned to authenticated technician

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- Same as "Get All Tickets" endpoint
- Results automatically filtered to tickets assigned to authenticated user

**Success Response:** Same structure as "Get All Tickets"

**Notes:**
- Convenience endpoint for technicians
- Same as GET /tickets with assignedTo filter

---

### Get Unassigned Tickets
**Endpoint:** `GET /tickets/unassigned`  
**Access:** Protected (Technician, Admin)  
**Purpose:** Get tickets waiting for assignment

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `priority` (optional) - Filter by priority
- `category` (optional) - Filter by category
- `sortBy` (optional, default: -priority then -createdAt)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Unassigned tickets retrieved",
  "data": {
    "tickets": [
      // Ticket objects where assignedTo is null
    ],
    "count": 15
  }
}
```

**Notes:**
- Only returns tickets with assignedTo = null
- Sorted by priority (urgent first) then date created (oldest first)
- Useful for technicians to pick up work

---

## 💬 Comments

### Get Ticket Comments
**Endpoint:** `GET /tickets/:ticketId/comments`  
**Access:** Protected (Role-based ticket access)  
**Purpose:** Get all comments for a ticket

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `ticketId` - Ticket ObjectId

**Query Parameters:**
- `sortBy` (optional, default: -createdAt) - Sort order
  - `-createdAt` for newest first
  - `createdAt` for oldest first

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Comments retrieved",
  "data": {
    "comments": [
      {
        "id": "ObjectId",
        "ticket": "ObjectId",
        "user": {
          "id": "ObjectId",
          "username": "string",
          "fullName": "string",
          "role": "string"
        },
        "text": "string",
        "createdAt": "ISO date"
      }
    ],
    "count": 5
  }
}
```

**Error Responses:**
- `404 Not Found` - Ticket doesn't exist
- `403 Forbidden` - Not authorized to view this ticket's comments

**Notes:**
- Comments are visible to ticket creator, assigned technician, and admins
- Returned in chronological order (can be reversed with sortBy)
- Includes user information for each comment

---

### Add Comment
**Endpoint:** `POST /tickets/:ticketId/comments`  
**Access:** Protected (Ticket participants)  
**Purpose:** Add a comment to a ticket

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `ticketId` - Ticket ObjectId

**Request Body:**
```json
{
  "text": "string (required, max 1000 chars)"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": "ObjectId",
      "ticket": "ObjectId",
      "user": {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string",
        "role": "string"
      },
      "text": "string",
      "createdAt": "ISO date"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (empty or too long)
- `404 Not Found` - Ticket doesn't exist
- `403 Forbidden` - Not authorized to comment on this ticket

**Who Can Comment:**
- Ticket creator (customer)
- Assigned technician
- Any admin
- Other technicians (if ticket is unassigned or they're helping)

**Notes:**
- Comment author is automatically set to authenticated user
- Updates ticket's updatedAt timestamp
- May trigger notification to other participants (optional feature)

---

### Update Comment
**Endpoint:** `PATCH /comments/:id`  
**Access:** Protected (Comment author or admin)  
**Purpose:** Edit a comment

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Comment ObjectId

**Request Body:**
```json
{
  "text": "string (required, max 1000 chars)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "comment": {
      "id": "ObjectId",
      "text": "string",
      "updatedAt": "ISO date"
    }
  }
}
```

**Permission Rules:**
- User can edit their own comments
- Admin can edit any comment
- Cannot edit after 15 minutes (optional rule)

---

### Delete Comment
**Endpoint:** `DELETE /comments/:id`  
**Access:** Protected (Comment author or admin)  
**Purpose:** Delete a comment

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Comment ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Permission Rules:**
- User can delete their own comments
- Admin can delete any comment

---

## 📊 Dashboard & Statistics

### Get Dashboard Statistics
**Endpoint:** `GET /dashboard/stats`  
**Access:** Protected (All authenticated users)  
**Purpose:** Get statistics for dashboard display

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

**For Customer:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "stats": {
      "totalTickets": 15,
      "openTickets": 5,
      "inProgressTickets": 3,
      "resolvedTickets": 7,
      "closedTickets": 0
    },
    "recentTickets": [
      // Last 5 tickets created by user
    ]
  }
}
```

**For Technician:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "stats": {
      "assignedToMe": 12,
      "openTickets": 4,
      "inProgressTickets": 6,
      "resolvedToday": 2,
      "unassignedTickets": 8
    },
    "myQueue": [
      // Tickets assigned to technician
    ]
  }
}
```

**For Admin:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "stats": {
      "totalTickets": 250,
      "openTickets": 45,
      "inProgressTickets": 38,
      "resolvedToday": 12,
      "totalUsers": 87,
      "activeTechnicians": 8,
      "unassignedTickets": 15,
      "avgResolutionTime": "4.5 hours"
    },
    "recentActivity": [
      // Last 10 ticket updates
    ]
  }
}
```

**Notes:**
- Statistics are role-specific
- Data is calculated in real-time
- Can be cached for performance (optional)

---

### Get Ticket Statistics by Category
**Endpoint:** `GET /dashboard/stats/by-category`  
**Access:** Protected (Admin, Technician)  
**Purpose:** Get ticket distribution by category

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `dateFrom` (optional) - Start date for filtering
- `dateTo` (optional) - End date for filtering

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category statistics retrieved",
  "data": {
    "categories": [
      {
        "category": "hardware",
        "count": 45,
        "percentage": 18
      },
      {
        "category": "software",
        "count": 89,
        "percentage": 35.6
      },
      {
        "category": "network",
        "count": 67,
        "percentage": 26.8
      },
      {
        "category": "access",
        "count": 34,
        "percentage": 13.6
      },
      {
        "category": "other",
        "count": 15,
        "percentage": 6
      }
    ],
    "total": 250
  }
}
```

**Notes:**
- Useful for charts/graphs
- Can be filtered by date range
- Percentages calculated automatically

---

### Get Ticket Statistics by Priority
**Endpoint:** `GET /dashboard/stats/by-priority`  
**Access:** Protected (Admin, Technician)  
**Purpose:** Get ticket distribution by priority

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Priority statistics retrieved",
  "data": {
    "priorities": [
      {
        "priority": "low",
        "count": 120,
        "percentage": 48
      },
      {
        "priority": "medium",
        "count": 80,
        "percentage": 32
      },
      {
        "priority": "high",
        "count": 40,
        "percentage": 16
      },
      {
        "priority": "urgent",
        "count": 10,
        "percentage": 4
      }
    ],
    "total": 250
  }
}
```

---

### Get Technician Workload
**Endpoint:** `GET /dashboard/workload`  
**Access:** Protected (Admin)  
**Purpose:** Get current workload per technician

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Workload data retrieved",
  "data": {
    "technicians": [
      {
        "id": "ObjectId",
        "username": "string",
        "fullName": "string",
        "assignedTickets": 12,
        "openTickets": 4,
        "inProgressTickets": 6,
        "resolvedToday": 2,
        "workload": "medium",
        "capacity": 60
      }
    ]
  }
}
```

**Workload Calculation:**
- Low: 0-5 tickets
- Medium: 6-12 tickets
- High: 13+ tickets

**Notes:**
- Helps admin balance assignments
- Shows real-time technician availability
- Capacity percentage: (assigned / max capacity) * 100

---

## 👨‍💼 Admin Operations

### Bulk Assign Tickets
**Endpoint:** `POST /admin/tickets/bulk-assign`  
**Access:** Protected (Admin only)  
**Purpose:** Assign multiple tickets at once

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ticketIds": ["ObjectId", "ObjectId", "ObjectId"],
  "technicianId": "ObjectId"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Tickets assigned successfully",
  "data": {
    "assigned": 3,
    "failed": 0
  }
}
```

---

### Bulk Update Status
**Endpoint:** `PATCH /admin/tickets/bulk-status`  
**Access:** Protected (Admin only)  
**Purpose:** Update status of multiple tickets

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ticketIds": ["ObjectId", "ObjectId"],
  "status": "open | in-progress | resolved | closed",
  "resolution": "string (required if status=resolved)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Tickets updated successfully",
  "data": {
    "updated": 2,
    "failed": 0
  }
}
```

---

### Generate Report
**Endpoint:** `POST /admin/reports/generate`  
**Access:** Protected (Admin only)  
**Purpose:** Generate system report

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reportType": "tickets | technician | category | resolution-time",
  "dateFrom": "ISO date (optional)",
  "dateTo": "ISO date (optional)",
  "technicianId": "ObjectId (optional, for technician report)",
  "format": "json | csv (optional, default: json)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "report": {
      "type": "tickets",
      "period": {
        "from": "ISO date",
        "to": "ISO date"
      },
      "summary": {
        "totalTickets": 250,
        "resolved": 180,
        "avgResolutionTime": "4.5 hours"
      },
      "details": [
        // Detailed data based on report type
      ]
    }
  }
}
```

**Notes:**
- CSV format returns download URL or file data
- Reports can be saved/cached
- Large reports may be paginated

---

## ❌ Error Responses

### Standard Error Format
All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    // Optional: Field-specific validation errors
  }
}
```

### HTTP Status Codes

**400 Bad Request**
- Invalid request data
- Validation errors
- Missing required fields

**401 Unauthorized**
- Missing authentication token
- Invalid token
- Expired token

**403 Forbidden**
- Valid token but insufficient permissions
- Inactive account
- Role not authorized for this action

**404 Not Found**
- Resource doesn't exist
- Invalid ID

**409 Conflict**
- Duplicate resource (e.g., username/email already exists)

**500 Internal Server Error**
- Server error
- Database error
- Unhandled exception

### Validation Error Example
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "title": "Title must be at least 10 characters",
    "description": "Description is required",
    "priority": "Invalid priority value"
  }
}
```

---

## 📝 Request/Response Examples

### Example 1: Complete Ticket Creation Flow

**1. Register User:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "fullName": "John Doe",
  "department": "Marketing"
}
```

**2. Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepass123"
}
```

Response includes token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**3. Create Ticket:**
```http
POST /api/tickets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Laptop screen flickering",
  "description": "My laptop screen has been flickering intermittently for the past two days. It happens mostly when I'm using multiple applications.",
  "priority": "high",
  "category": "hardware"
}
```

**4. Check Ticket Status:**
```http
GET /api/tickets/TKT-00001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**5. Add Comment:**
```http
POST /api/tickets/TKT-00001/comments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "text": "I've also noticed it happens more frequently when the laptop is charging."
}
```

---

### Example 2: Technician Workflow

**1. Login as Technician:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "tech_sarah",
  "password": "techpass456"
}
```

**2. View Unassigned Tickets:**
```http
GET /api/tickets/unassigned?priority=high,urgent
Authorization: Bearer <tech_token>
```

**3. Assign Ticket to Self:**
```http
PATCH /api/tickets/TKT-00001/assign
Authorization: Bearer <tech_token>
Content-Type: application/json

{
  "technicianId": "<sarah_id>"
}
```

**4. Update Status:**
```http
PATCH /api/tickets/TKT-00001/status
Authorization: Bearer <tech_token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

**5. Add Work Notes:**
```http
POST /api/tickets/TKT-00001/comments
Authorization: Bearer <tech_token>
Content-Type: application/json

{
  "text": "I've diagnosed the issue. The screen cable appears to be loose. I'll need to open the laptop to secure it."
}
```

**6. Resolve Ticket:**
```http
PATCH /api/tickets/TKT-00001/status
Authorization: Bearer <tech_token>
Content-Type: application/json

{
  "status": "resolved",
  "resolution": "Secured the loose screen cable. Tested for 30 minutes with no flickering. Recommend monitoring for next few days."
}
```

---

### Example 3: Admin Dashboard Data

**Get System Statistics:**
```http
GET /api/dashboard/stats
Authorization: Bearer <admin_token>
```

**Get Category Breakdown:**
```http
GET /api/dashboard/stats/by-category?dateFrom=2024-12-01&dateTo=2024-12-31
Authorization: Bearer <admin_token>
```

**Get Technician Workload:**
```http
GET /api/dashboard/workload
Authorization: Bearer <admin_token>
```

**Bulk Assign Tickets:**
```http
POST /api/admin/tickets/bulk-assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "ticketIds": ["673a1b2c3d4e5f6g7h8i9j0k", "673a1b2c3d4e5f6g7h8i9j0l"],
  "technicianId": "673a1b2c3d4e5f6g7h8i9j0m"
}
```

---

## 🔒 Security Best Practices

### Token Management
- Store JWT in httpOnly cookie or secure localStorage
- Include token in Authorization header for all protected requests
- Token expires after 24 hours (configurable)
- Implement token refresh mechanism (optional)

### Rate Limiting
- Login endpoint: 5 attempts per 15 minutes
- Registration: 3 attempts per hour
- API endpoints: 100 requests per 15 minutes per user

### Input Validation
- All inputs are validated on server-side
- SQL injection protection via Mongoose
- XSS protection via input sanitization
- CSRF tokens for state-changing operations (optional)

---

## 📊 Pagination

All list endpoints support pagination with these query parameters:

- `page` (default: 1) - Current page number
- `limit` (default: 20, max: 100) - Items per page
- `sortBy` (default varies) - Sort field (prefix with - for descending)

**Pagination Response:**
```json
{
  "pagination": {
    "total": 150,
    "page": 2,
    "pages": 8,
    "limit": 20,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 🔍 Search & Filtering

### Search Query Parameter
Most list endpoints support `search` parameter:
- Searches in relevant fields (title, description, name, etc.)
- Case-insensitive
- Partial match
- Debounced on frontend

### Multiple Filters
Filters can be combined:
```
GET /api/tickets?status=open,in-progress&priority=high,urgent&category=hardware
```

### Date Range Filters
```
GET /api/tickets?dateFrom=2024-12-01&dateTo=2024-12-31
```

---

## 📈 Performance Considerations

### Caching
- Dashboard statistics can be cached (5-minute TTL)
- User profiles cached after first load
- Technician list cached and invalidated on changes

### Database Indexes
- Tickets: ticketNumber, status, priority, createdBy, assignedTo
- Users: username, email, role
- Comments: ticket

### Response Optimization
- List endpoints return truncated descriptions
- Paginated results prevent large data transfers
- Lazy loading for comments

---

**API Documentation Status:** ✅ Complete  
**Total Endpoints:** 40+ endpoints  
**Authentication:** JWT Bearer Token  
**Rate Limiting:** Configured  
**Ready for:** Frontend Integration
