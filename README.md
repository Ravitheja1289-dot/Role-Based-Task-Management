# Role-Based Task Management API

A production-ready RESTful API built with Node.js, Express, and MongoDB featuring JWT authentication and role-based access control.

## 🎯 Features

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

## 📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
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
POST /api/auth/login
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
GET /api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

**Note:** All task endpoints require authentication. Include the JWT token in the Authorization header.

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "todo",           // Optional: "todo", "in-progress", "done"
  "priority": "high",         // Optional: "low", "medium", "high"
  "dueDate": "2026-01-15",   // Optional
  "assignedTo": "user_id"     // Optional: defaults to creator
}
```

#### Get All Tasks (with Pagination)
```http
GET /api/tasks?page=1&limit=10&status=todo&priority=high&sortBy=-createdAt
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: todo, in-progress, done)
- `priority` (optional: low, medium, high)
- `sortBy` (optional: createdAt, -createdAt, title, etc.)

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
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdBy": {
        "_id": "creator_id",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2026-01-07T10:30:00.000Z",
      "updatedAt": "2026-01-07T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

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
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics (Admin Only)
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "byStatus": [
      { "_id": "todo", "count": 15 },
      { "_id": "in-progress", "count": 8 },
      { "_id": "done", "count": 12 }
    ],
    "byPriority": [
      { "_id": "low", "count": 10 },
      { "_id": "medium", "count": 15 },
      { "_id": "high", "count": 10 }
    ]
  }
}
```

## 🔐 Role-Based Access Control

### User Roles

1. **User (Regular User)**
   - Can see only their assigned tasks
   - Can create tasks
   - Can update their own tasks
   - Can delete tasks they created

2. **Admin**
   - Can see all tasks
   - Can create tasks for any user
   - Can update any task
   - Can delete any task
   - Can access task statistics

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
- **Database**: Reduces load on MongoDB

### Middleware Order Matters
```javascript
router.use(protect);           // 1. Authenticate user
router.use(authorize('admin')); // 2. Check role
router.get('/endpoint', handler); // 3. Execute handler
```

### Service Layer Pattern
Separates business logic from controllers:
- Controllers handle HTTP requests/responses
- Services contain reusable business logic
- Makes code testable and maintainable

## 🔄 Request Flow

```
Client Request
    ↓
Express App
    ↓
CORS & Body Parser Middleware
    ↓
Route Handler
    ↓
Auth Middleware (verify JWT)
    ↓
Role Middleware (check permissions)
    ↓
Controller (handle request)
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
