## API Reference

This section documents all available endpoints in the Task API.

All requests to `/api/tasks` endpoints require a JSON Web Token (JWT).  
Before sending requests, create an account and obtain a token.

For instructions, see the [Authentication Guide](authentication-guide.md).

The `/api/auth` and `/health` endpoints are public and don't require authentication.

## Base URL

```
http://your-server-address:3000
```

### Authentication endpoints

```
POST /api/auth/signup
```

Creates a new user account and returns a JWT token.

**Authentication required:** No

**Request body:**

| Field    | Type   | Required | Description                               |
|----------|--------|----------|-------------------------------------------|
| name     | string | Yes      | Display name                              |
| email    | string | Yes      | Must be unique. Used as login identifier |
| password | string | Yes      | Minimum 8 characters                      |

**Example request:**

```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "password123"
}
```

**Example response—201 Created:**

```json
{
    "message": "Account created successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "name": "User",
        "email": "user@example.com"
    }
}
```

**Error responses:**

| Status code | Error           | Cause                      |
|-------------|-----------------|----------------------------|
| 400         | ValidationError | Missing or invalid fields  |
| 409         | Conflict        | Email already registered   |

```
POST /api/auth/login
```

Authenticates a user and returns a JWT token.

**Authentication required:** No

**Request body:**

| Field    | Type   | Required | Description               |
|----------|--------|----------|---------------------------|
| email    | string | Yes      | Registered email address  |
| password | string | Yes      | Account password          |

**Example request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example response—200 OK:**

```json
{
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "name": "User",
        "email": "user@example.com"
    }
}
```

**Error responses:**

| Status code | Error              | Cause                     |
|-------------|--------------------|---------------------------|
| 400         | ValidationError    | Missing email or password |
| 401         | InvalidCredentials | Wrong email or password   |

```
GET /health
```

Returns the server status. Use this endpoint to verify the server is running.

**Authentication required:** No

**Example response—200 OK:**

```json
{
    "status": "ok",
    "timestamp": "2026-03-03T22:19:40.000Z"
}
```

### Task endpoints

All task endpoints require a valid JWT token in the Authorization header:

**Authorization header:**

Authorization: `Bearer <your_token>`

```
GET /api/tasks
```

Returns all tasks belonging to the authenticated user, ordered by creation date with the newest first.

**Authentication required:** Yes

**Query parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| status    | string | No       | Filter by status. Accepted values: `pending`, `in_progress`, `completed` |
| priority  | string | No       | Filter by priority. Accepted values: `low`, `medium`, `high` |

**Example request:**

```
GET /api/tasks?status=pending&priority=high
```

**Example response—200 OK:**


```json
{
    "count": 1,
    "tasks": [
        {
            "id": "dc189961-2875-4220-823e-bee426e62242",
            "user_id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
            "title": "My first task",
            "description": null,
            "status": "pending",
            "priority": "medium",
            "due_date": null,
            "created_at": "2026-03-03 22:19:40",
            "updated_at": "2026-03-03 22:19:40"
        }
    ]
}
```

**Error responses:**

| Status code | Error           | Cause                                 |
|-------------|-----------------|---------------------------------------|
| 400         | ValidationError | Invalid status or priority filter value |
| 401         | Unauthorized    | Missing or invalid token              |

```
POST /api/tasks
```
Creates a new task for the authenticated user.

**Authentication required:** Yes

**Request body:**

| Field       | Type   | Required | Description |
|-------------|--------|----------|-------------|
| title       | string | Yes      | Task title |
| description | string | No       | Additional notes about the task |
| status      | string | No       | Defaults to `pending`. Accepted values: `pending`, `in_progress`, `completed` |
| priority    | string | No       | Defaults to `medium`. Accepted values: `low`, `medium`, `high` |
| due_date    | string | No       | ISO 8601 date string, for example `2024-12-31` |

**Example request:**

```json
{
    "title": "My first task",
    "description": "This is a description",
    "status": "pending",
    "priority": "medium",
    "due_date": "2026-12-31"
}
```

**Example response—201 Created:**

```json
{
    "message": "Task created.",
    "task": {
        "id": "dc189961-2875-4220-823e-bee426e62242",
        "user_id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "title": "My first task",
        "description": "This is a description",
        "status": "pending",
        "priority": "medium",
        "due_date": "2026-12-31",
        "created_at": "2026-03-03 22:19:40",
        "updated_at": "2026-03-03 22:19:40"
    }
}
```

**Error responses:**

| Status code | Error           | Cause                                  |
|-------------|-----------------|----------------------------------------|
| 400         | ValidationError | Missing title or invalid field values |
| 401         | Unauthorized    | Missing or invalid token              |

```
GET /api/tasks/:id
```

Returns a single task by ID. The task must belong to the authenticated user.

**Authentication required:** Yes

**Path parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| id        | string | Yes      | UUID of the task   |

**Example request:**

```
GET /api/tasks/dc189961-2875-4220-823e-bee426e62242
```
**Example response—200 OK:**

```json
{
    "task": {
        "id": "dc189961-2875-4220-823e-bee426e62242",
        "user_id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "title": "My first task",
        "description": "This is a description",
        "status": "pending",
        "priority": "medium",
        "due_date": "2026-12-31",
        "created_at": "2026-03-03 22:19:40",
        "updated_at": "2026-03-03 22:19:40"
    }
}
```

**Error responses:**

| Status code | Error        | Cause                                      |
|-------------|--------------|---------------------------------------------|
| 401         | Unauthorized | Missing or invalid token                   |
| 404         | NotFound     | Task not found or belongs to another user  |

```
PATCH /api/tasks/:id
```

Partially updates a task. Only the fields included in the request body are updated. Omitted fields keep their current values.

**Authentication required:** Yes

**Path parameters:**

| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| id        | string | Yes      | UUID of the task |

**Request body:**

| Field       | Type   | Required | Description |
|-------------|--------|----------|-------------|
| title       | string | No       | Updated task title |
| description | string | No       | Updated task notes |
| status      | string | No       | Accepted values: `pending`, `in_progress`, `completed` |
| priority    | string | No       | Accepted values: `low`, `medium`, `high` |
| due_date    | string | No       | ISO 8601 date string, for example `2024-12-31` |

**Example request:**


```json
{
    "status": "in_progress",
    "priority": "high"
}
```

**Example response—200 OK:**

```json
{
    "message": "Task updated.",
    "task": {
        "id": "dc189961-2875-4220-823e-bee426e62242",
        "user_id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "title": "My first task",
        "description": "This is a description",
        "status": "in_progress",
        "priority": "high",
        "due_date": "2026-12-31",
        "created_at": "2026-03-03 22:19:40",
        "updated_at": "2026-03-03 22:25:00"
    }
}
```

**Error responses:**

| Status code | Error           | Cause                                      |
|-------------|-----------------|---------------------------------------------|
| 400         | ValidationError | Invalid field values                       |
| 401         | Unauthorized    | Missing or invalid token                   |
| 404         | NotFound        | Task not found or belongs to another user  |

```
DELETE /api/tasks/:id
```

Permanently deletes a task. The task must belong to the authenticated user. This action cannot be undone.

**Authentication required:** Yes

**Path parameters:**

| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| id        | string | Yes      | UUID of the task |

**Example request:**

```
DELETE /api/tasks/dc189961-2875-4220-823e-bee426e62242
```

**Example response—200 OK:**

```json
{
    "message": "Task deleted."
}
```

**Error responses:**

  | Status code | Error        | Cause                                      |
|-------------|--------------|---------------------------------------------|
| 401         | Unauthorized | Missing or invalid token                   |
| 404         | NotFound     | Task not found or belongs to another user  |