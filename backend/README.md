
# Umuco Backend API

Backend API for the Umuco cultural learning platform, built with Node.js, Express, TypeScript, MongoDB, and Cloudinary.

## Features

- Authentication system with JWT
- User management
- Course management
- Student enrollment system
- Forum functionality
- File uploads with Cloudinary
- API documentation with Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies

```bash
npm install
```

4. Run the development server

```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/umuco
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Documentation

Access the API documentation by navigating to `http://localhost:5000/api-docs` when the server is running.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course (mentor/admin only)
- `PUT /api/courses/:id` - Update a course (mentor/admin only)
- `POST /api/courses/:id/thumbnail` - Upload course thumbnail (mentor/admin only)
- `DELETE /api/courses/:id` - Delete a course (mentor/admin only)
- `POST /api/courses/:id/reviews` - Create course review

### Enrollments

- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments` - Get user enrollments
- `GET /api/enrollments/:id` - Get enrollment details
- `PUT /api/enrollments/:id/progress` - Update lesson progress
- `GET /api/enrollments/stats/instructor` - Get instructor statistics

### Forum

- `GET /api/forum` - Get all forum posts
- `GET /api/forum/:id` - Get forum post by ID
- `POST /api/forum` - Create a new forum post
- `PUT /api/forum/:id` - Update a forum post
- `DELETE /api/forum/:id` - Delete a forum post
- `POST /api/forum/:id/comments` - Add comment to post
- `POST /api/forum/:id/like` - Like/unlike a post

## Docker

Build the Docker image:

```bash
docker build -t umuco-backend .
```

Run the Docker container:

```bash
docker run -p 5000:5000 umuco-backend
```

Or use Docker Compose:

```bash
docker-compose up
```

## Health Check

You can check if the API is running properly by visiting `/api/health`.
