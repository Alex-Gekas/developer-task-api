<!--Troubleshooting Guide
One section per problem. Each section contains:

Symptom — the error message or behavior the user sees
Cause — why it happens
Fix — what to do
Problems to cover:

Cannot find module on startup — missing files or wrong folder structure
npm install fails with node-gyp error — native module compilation issue on Windows
401 No Authorization header — forgot to include the token
401 TokenExpired — token has expired, need to log in again
401 InvalidToken — malformed header, wrong format, or tampered token
409 Conflict on signup — email already registered
404 Task not found — wrong task ID or task belongs to a different user
400 ValidationError — missing required fields or invalid enum values
Server starts but data doesn't persist between restarts — DB_PATH not set correctly
Port already in use — another process is on port 3000
-->


## Troubleshooting

This section describes common errors that can occur when installing the Task API or testing endpoints from a REST client. Many of these errors result from missing a step during installation. Review the **Getting Started** guide before troubleshooting.

### npm install fails on Windows

**Symptom**: Error messages that reference the node-gyp or missing Visual Studio.

**Cause:** `better-sqlite3` is a native Node.js addon that requires C++ build tools to compile on Windows.

**There are two ways to resolve this issue:**:

- **Option A - Install the required Windows build tools**
Use this option if you want your system to compile native Node.js modules correctly. This will ensure data integrity and performance.
- **Option B – Replace `better-sqlite3` with `sql.js`** 
Use this option to avoid native compilation by using a pure JavaScript SQLite implementation.

However, your environment will still lack native build tools, which may cause problems with other packages later. Use this option only for development or portfolio projects.

### **Server won't start – Cannot find module**

**Symptom** `Error: Cannot find module` when running `npm run dev`

**Cause:** Two possible causes:

- Files are not in the correct folder structure – src/ subfolders missing
- Dependencies not installed –  node_modules folder missing or incomplete

**Fix:**

- Verify the folder structure matches the one in [System Architecture](system-architecture.md)
- Run `npm install` if node_modules is missing
- Check that all files are in their correct subdirectories

### 401 errors

**Symptom** Requests to task endpoints return a 401 response.

**Possible causes:**

**Missing Authorization header**

- Cause – no Authorization header included in the request
- Fix –  add `Authorization: Bearer: <your_token>` to every task request

**Wrong header format**

- Cause – header syntax is in the wrong format, for example `Token &lt;your_token>` instead of `Bearer &lt;your_token>`
- Fix – make sure the header follows the exact format: `Authorization: Bearer &lt;your_token>`

**Expired token**

- Cause – the token was issued more than seven days ago
- Fix – log in again to generate a new token. There is no refresh mechanism in this API

### 409 Conflict on signup

**Symptom** `POST /api/auth/signup` returns a 409 Conflict response.

**Cause** The email address is already registered in the database.

**Fix** Two options:

- Log in using the existing account at `POST /api/auth/login`
- Sign up using a different email address

### 404 on task endpoints

**Symptom** A task request returns a 404 NotFound response even though the task exists.

**Two causes and fixes:**

**Wrong task ID**

- Cause – the task ID in the request path is incorrect or malformed
- Fix –  copy the exact task ID from the response when the task was created, or retrieve it using `GET /api/tasks`

**Wrong user**

- Cause – the task exists but belongs to a different user account. Tasks are private and scoped to the authenticated user
- Fix  – confirm you are using the token for the correct user account

### 400 validation errors

**Symptom:** A request returns a 400 ValidationError response.

**Three causes and fixes:**

**Missing title on task creation**

- Cause – `POST /api/tasks` was sent without a title field
- Fix – include a title field in the request body. It is the only required field when creating a task

**Invalid status value**

- Cause – the status field contains a value not accepted by the API
- Fix – use one of the accepted values: `pending`, `in_progress`, `completed`

**Invalid priority value**

- Cause – the priority field contains a value not accepted by the API
-  Fix – use one of the accepted values: `low`, `medium`, `high`

### **Data not persisting between restarts**

**Symptom:** Tasks and user accounts created in a previous session are gone after restarting the server.

**Cause:** If DB_PATH is not set in .env, the server uses the default path ./data/tasks.db. This works in most cases. If the server is started from a different directory, it cannot find the database. As a result, the server creates a new empty database. Previously created users and tasks appear to be gone.

**Fix**

- Open your `.env` file and confirm `DB_PATH=./data/tasks.db` is set
- Confirm the `data/` folder exists in your project root
- Restart the server and verify the `tasks.db` file appears in the `data/` folder after startup