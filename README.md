# Task API

A production-style REST API for managing tasks with JWT authentication, built with Node.js, Express, and SQLite.

## Features
- User signup and login with hashed passwords
- JWT-based authentication on all task endpoints
- Full task CRUD: create, read, update, delete
- Filter tasks by status or priority
- Centralized error handling

## Project Structure

```
task-api/
├── src/
│   ├── server.js                  # App entry point
│   ├── db/
│   │   └── database.js            # SQLite connection & table setup
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── errorHandler.js        # Global error handler
│   ├── controllers/
│   │   ├── authController.js      # Signup & login logic
│   │   └── taskController.js      # Task CRUD logic
│   └── routes/
│       ├── auth.js                # Auth route definitions
│       └── tasks.js               # Task route definitions
├── .env.example                   # Environment variable template
├── .gitignore
└── package.json
```

## Quick Start

**1. Install dependencies**
```bash
npm install
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

**3. Start the server**
```bash
npm run dev     # with auto-reload (requires nodemon)
npm start       # standard start
```

The server starts at `http://localhost:3000`.

## Endpoints

| Method | Path                  | Auth Required | Description         |
|--------|-----------------------|---------------|---------------------|
| GET    | /health               | No            | Health check        |
| POST   | /api/auth/signup      | No            | Register new user   |
| POST   | /api/auth/login       | No            | Login, receive JWT  |
| GET    | /api/tasks            | Yes           | List your tasks     |
| POST   | /api/tasks            | Yes           | Create a task       |
| GET    | /api/tasks/:id        | Yes           | Get one task        |
| PATCH  | /api/tasks/:id        | Yes           | Update a task       |
| DELETE | /api/tasks/:id        | Yes           | Delete a task       |

## Authentication

After login, include the token in all task requests:

```
Authorization: Bearer <your_token_here>
```

## Task Fields

| Field         | Type   | Values                              | Required |
|---------------|--------|-------------------------------------|----------|
| title         | string | Any text                            | Yes      |
| description   | string | Any text                            | No       |
| status        | string | `pending`, `in_progress`, `completed` | No     |
| priority      | string | `low`, `medium`, `high`             | No       |
| due_date      | string | ISO date, e.g. `2024-12-31`         | No       |
