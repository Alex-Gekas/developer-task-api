## Getting Started

## What This Guide Covers

This guide walks through the basic workflow of using the Task API:

- Creating a user account
- Logging in to receive an authentication token
- Making your first authenticated request to create a task

By the end of this guide, you have a working user account and a saved task in the database.

## Prerequisites

Before you begin, make sure:

- You have completed the steps in Setup
- The server is running (``npm run dev``)
- You have a REST client such as Postman, Hoppscotch, or curl
- You know the base URL (for example: `http://localhost:3000` if you have installed it locally or `https://your-server-address:3000`

## Step 1 - Create a user account

Send a POST request to `/api/auth/signup` to create your account.

**Request body:**

```json
{
  "name": "user",
  "email": "user@example.com",
  "password": "password123"
}
```

The API hashes your password and creates a new user record. If the request is successful, you receive an **HTTP 201 Created** response with a JWT and your user details:

**Response:**

```json
{
    "message": "Account created successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMTI0N2I5LWUyYzEtNDVhNS05MGFkLTU0OWQwZjE1MGU5NCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc3MjU3NDAzMiwiZXhwIjoxNzczMTc4ODMyfQ.mXHVTiU7fQ8pmOrjLG4zKuO2XqtpTLymabF1qmY8baM",
    "user": {
        "id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "name": "User",
        "email": "user@example.com"
    }
}
```

Keep your token – you need it to make requests in the following steps.

## Step 2 – Log in and receive a token

Send a POST request to `POST /api/auth/login` to generate and receive a token:

**Request body:**

```
{
  "email": "user@example.com",
  "password": "password123"
}
```
The server verifies the password. If valid, a JWT token is generated and appears in the response.

**HTTP 200 OK** and a JSON response containing a `token` field

**Response:**
```json
{
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMTI0N2I5LWUyYzEtNDVhNS05MGFkLTU0OWQwZjE1MGU5NCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc3MjU3NDU0MiwiZXhwIjoxNzczMTc5MzQyfQ.qBUIBD9Qirey3xzbFBunx9oqhL22zxncXxe5k1ghWoY",
    "user": {
        "id": "0b1247b9-e2c1-45a5-90ad-549d0f150e94",
        "name": "user",
        "email": "user@example.com"
    }
}
```

Save this token. It is required for all protected routes.

## Step 3 – Create your first task

Send a POST request to `POST /api/tasks`

Add this header:

```
Authorization: Bearer <your_token_here>
```

**Request body:**

```
{
  "title": "My first task"
}
```

### What happens next

- The authentication middleware verifies the token.
- The request is passed to the task controller.
- A new task record is inserted into the database.
- The created task is returned in the response.

**Response:**

**HTTP 201 Created**

```json
{
    "message": "Task created.",
    "task": {
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
}
```

## Step 4 - Verify the task Was created

Send a GET request to `GET /api/tasks` with the same Authorization header you used in the previous step.

You should see a list of tasks associated with your user ID:

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

If the request succeeds, the API returns your task list. This confirms that authentication and task creation are working correctly.

## Where to Go Next

Now that you have created and retrieved a task, you can explore:

- Updating a task
- Marking a task as complete
- Deleting a task

See the [API Reference](api-reference.md) for full endpoint details, request formats, and response examples.
