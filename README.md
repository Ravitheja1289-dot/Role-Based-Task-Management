# Role-Based Task Management API

A production-ready RESTful API built with Node.js, Express, and MongoDB featuring JWT authentication and role-based access control.

## � Live Demo

**API Base URL**: `https://role-based-task-management.onrender.com`

**Web Interface**: [https://role-based-task-management.onrender.com](https://role-based-task-management.onrender.com)

> **Note**: The first request may take 30-60 seconds as the free tier server spins up after inactivity.

## �🎯 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based access control (Admin/User)

- **Task Management**
  - Full CRUD operations
  - Pagination support
  - Filtering by status and priority
  - Soft delete functionality
  - Task assignment system

- **Clean Architecture**
  - Separation of concerns (Routes → Controllers → Services → Models)
  - Centralized error handling
  - Middleware-based authentication
  - Mongoose ODM for MongoDB

## 📁 Project Structure

```
src/
 ├── config/
 │    └── db.js                 # MongoDB connection
 ├── models/
 │    ├── User.js               # User schema with bcrypt
 │    └── Task.js               # Task schema with soft delete
 ├── routes/
 │    ├── auth.routes.js        # Auth endpoints
 │    └── task.routes.js        # Task endpoints
 ├── controllers/
 │    ├── auth.controller.js    # Auth business logic
 │    └── task.controller.js    # Task business logic
 ├── services/
 │    └── task.service.js       # Task service layer
 ├── middleware/
 │    ├── auth.middleware.js    # JWT verification
 │    └── role.middleware.js    # Role-based access
 ├── utils/
 │    └── errorHandler.js       # Centralized error handling
 ├── app.js                     # Express app configuration
 └── server.js                  # Server initialization
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Role-Based Task Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB Atlas connection string.

5. **Run the server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## � Testing with Postman

### Quick Start Guide

1. **Import Postman Collection**
   - The `postman_collection.json` file is included in the repository
   - Open Postman → Click "Import" → Select `postman_collection.json`

2. **Set Base URL Variable**
   - After importing, create an environment in Postman
   - Add variable: `base_url` = `https://role-based-task-management.onrender.com`
   - Or use: `http://localhost:5000` for local testing

3. **Authentication Workflow**

   **Step 1: Register a User**
   ```
   POST {{base_url}}/api/auth/register
   ```
   Body (JSON):
   ```json
   {
     "username": "admin",
     "email": "admin@example.com",
     "password": "password123",
     "role": "admin"
   }
   ```

   **Step 2: Login**
   ```
   POST {{base_url}}/api/auth/login
   ```
   Body (JSON):
   ```json
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```
   
   **Response** (copy the token):
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { ... }
   }
   ```

   **Step 3: Set Authorization Header**
   - Go to the Authorization tab in Postman
   - Type: "Bearer Token"
   - Token: Paste the token from login response
   - Or manually add header: `Authorization: Bearer <your-token>`

4. **Test Task Endpoints**

   **Create a Task**
   ```
   POST {{base_url}}/api/tasks
   Authorization: Bearer <your-token>
   ```
   Body (JSON):
   ```json
   {
     "title": "My First Task",
     "description": "Testing the API",
     "priority": "high",
     "status": "pending"
   }
   ```

   **Get All Tasks**
   ```
   GET {{base_url}}/api/tasks
   Authorization: Bearer <your-token>
   ```

   **Update Task**
   ```
   PUT {{base_url}}/api/tasks/<task-id>
   Authorization: Bearer <your-token>
   ```
   Body (JSON):
   ```json
   {
     "status": "completed",
     "priority": "medium"
   }
   ```

   **Delete Task**
   ```
   DELETE {{base_url}}/api/tasks/<task-id>
   Authorization: Bearer <your-token>
   ```

### Postman Collection Structure

The included collection has folders for:
- **Auth** - Register, Login, Get Current User
- **Tasks** - CRUD operations
- **Admin** - Admin-only endpoints (if implemented)

### Tips for Testing

1. **Save Token as Environment Variable**
   - In Postman, after login, go to Tests tab
   - Add: `pm.environment.set("auth_token", pm.response.json().token);`
   - Use `{{auth_token}}` in Authorization header

2. **Test Different Roles**
   - Register multiple users with different roles (user, admin)
   - Test access control by switching tokens

3. **Test Filters and Pagination**
   ```
   GET {{base_url}}/api/tasks?status=pending&priority=high&page=1&limit=10
   ```

4. **Expected Response Codes**
   - 200: Success (GET, PUT)
   - 201: Created (POST)
   - 204: No Content (DELETE)
   - 400: Bad Request (validation error)
   - 401: Unauthorized (missing/invalid token)
   - 403: Forbidden (insufficient permissions)
   - 404: Not Found

## �📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST https://role-based-task-management.onrender.com/api/auth/register
Content-Type: application/json

{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // Optional: "user" or "admin" (default: "user")
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST https://role-based-task-management.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET https://role-based-task-management.onrender.com/api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

**Note:** All task endpoints require authentication. Include the JWT token in the Authorization header.

#### Create Task
```http
POST https://role-based-task-management.onrender.com/api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",        // Optional: "pending", "in-progress", "completed"
  "priority": "high",         // Optional: "low", "medium", "high"
  "dueDate": "2026-01-15"     // Optional
}
```

#### Get All Tasks (with Filtering)
```http
GET https://role-based-task-management.onrender.com/api/tasks?status=pending&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `status` (optional: pending, in-progress, completed)
- `priority` (optional: low, medium, high)
- `search` (optional: search in title and description
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "todo",
      "priority": "high",
      "assignedTo": {
        "_id": "upending",
      "priority": "high",
      "createdBy": "65a1b2c3d4e5f6g7h8i9j0k1",
      "createdAt": "2026-01-07T10:30:00.000Z",
      "updatedAt": "2026-01-07T10:30:00.000Z"
    }
  ]
#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete Task (Soft Delete)
```http
DELEhttps://role-based-task-management.onrender.com/api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT https://role-based-task-management.onrender.com/api/tasks/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "byStatus": [
      { "_id": "
```http
DELETE https://role-based-task-management.onrender.com/api/tasks/:id
Authorization: Bearer <token>  - Can access task statistics

## 🧪 Testing with Postman

1. **Register a new user** with role "admin"
2. **Login** to get JWT token
3. **Copy the token** from the response
4. **Set Authorization header** for protected routes:
   - Type: Bearer Token
   - Token: `<paste-your-token>`

### Sample Request Flow

1. Register admin user
2. Register regular user
3. Login as admin
4. Create tasks
5. Login as regular user
6. Get tasks (will see only assigned tasks)
7. Login as admin
8. Get tasks (will see all tasks)

## 💡 Key Design Decisions

### Why JWT over Sessions?
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple servers
- **Mobile-friendly**: Easy to use with mobile apps
- **Cross-domain**: Can be used across different domains

### Pagination Strategy
- **Performance**: Limits data transfer
- **User Experience**: Faster response times
- **Databview all tasks
   - Can create tasks
   - Can update their own tasks
   - Can delete their own tasks

2. **Admin**
   - Can view all tasks
   - Can create tasks
   - Can update any task
   - Can delete any task
   - Full system access

### Testing Access Control

Create two accounts with different roles and test the endpoints to see role-based restrictions in action.
    ↓
Service Layer (business logic)
    ↓
Model/Database
    ↓
Response to Client
```

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

## 🔧 Improvements for Production

1. **Input Validation**: Add Joi or Zod for request validation
2. **Rate Limiting**: Implement express-rate-limit
3. **Logging**: Use Winston or Morgan
4. **API Documentation**: Add Swagger/OpenAPI
5. **Testing**: Unit and integration tests
6. **Helmet**: Security headers
7. **Compression**: Gzip compression
8. **Monitoring**: APM tools like New Relic

## 🐛 Error Handling

All errors are centralized through the error handler middleware:

```javascript
// Mongoose validation errors
// Duplicate key errors
// Cast errors (invalid ObjectId)
// JWT errors
// Custom errors
```

## 📝 License

ISC

## 👨‍💻 Author

Built as a showcase project demonstrating production-ready backend development practices.

---

## 🎯 Interview Talking Points

When presenting this project:

1. **Architecture**: "I used a layered architecture similar to MVC but with an additional service layer"
2. **Security**: "Passwords are hashed with bcrypt, and JWTs expire after 7 days"
3. **Scalability**: "The pagination system can handle large datasets efficiently"
4. **Trade-offs**: "I chose JWT over sessions for horizontal scalability"
5. **Next Steps**: "I'd add input validation with Zod and comprehensive testing"
🌐 Using the Web Interface

The application includes a fully functional web interface accessible at:
**https://role-based-task-management.onrender.com**

### Features:
- **User Authentication**: Register and login with role selection
- **Task Dashboard**: View all your tasks in a card-based layout
- **Task Management**: Create, edit, and delete tasks
- **Filtering**: Filter by status and priority
- **Search**: Real-time search across tasks
- **Responsive Design**: Works on desktop, tablet, and mobile

### Quick Start:
1. Open the URL in your browser
2. Register a new account (choose Admin or User role)
3. Login with your credentials
4. Start creating and managing tasks!

## 