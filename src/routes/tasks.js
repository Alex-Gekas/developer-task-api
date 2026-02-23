// src/routes/tasks.js
// Defines the URL paths for task endpoints.
// All routes here are protected — they require a valid JWT token.
// The authenticate middleware handles that check before any controller runs.

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Apply the authenticate middleware to ALL routes in this file.
// Any request without a valid token will be rejected before reaching the controller.
router.use(authenticate);

// GET    /api/tasks       — List all tasks for the logged-in user
// POST   /api/tasks       — Create a new task
router.route('/')
  .get(listTasks)
  .post(createTask);

// GET    /api/tasks/:id   — Get a single task
// PATCH  /api/tasks/:id   — Update a task (partial update)
// DELETE /api/tasks/:id   — Delete a task
router.route('/:id')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
