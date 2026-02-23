// src/controllers/taskController.js
// Handles all task operations: list, create, update, delete.
// Every function here requires the user to be authenticated (req.user is set by auth middleware).

const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Valid values for status and priority fields
const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// --- LIST TASKS ---
// GET /api/tasks
// Returns all tasks belonging to the authenticated user.
// Supports optional query params: ?status=pending  ?priority=high
function listTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const { status, priority } = req.query;

    // Build the query dynamically based on which filters were provided
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: 'ValidationError',
          message: `status must be one of: ${VALID_STATUSES.join(', ')}`
        });
      }
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          error: 'ValidationError',
          message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`
        });
      }
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = db.prepare(query).all(...params);

    return res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (err) {
    next(err);
  }
}

// --- GET SINGLE TASK ---
// GET /api/tasks/:id
function getTask(req, res, next) {
  try {
    const task = db.prepare(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'Task not found.'
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
}

// --- CREATE TASK ---
// POST /api/tasks
function createTask(req, res, next) {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'title is required.'
      });
    }

    // Validate optional fields if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`
      });
    }

    const taskId = uuidv4();

    db.prepare(`
      INSERT INTO tasks (id, user_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      req.user.id,
      title.trim(),
      description || null,
      status || 'pending',
      priority || 'medium',
      due_date || null
    );

    // Fetch the newly created task to return it in the response
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    return res.status(201).json({
      message: 'Task created.',
      task
    });
  } catch (err) {
    next(err);
  }
}

// --- UPDATE TASK ---
// PATCH /api/tasks/:id
// Only updates the fields that are provided in the request body.
function updateTask(req, res, next) {
  try {
    const { title, description, status, priority, due_date } = req.body;

    // Make sure the task exists AND belongs to this user
    const existing = db.prepare(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'Task not found.'
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`
      });
    }

    // Merge incoming values with existing values (PATCH semantics — partial updates)
    const updatedTitle       = title       !== undefined ? title.trim()   : existing.title;
    const updatedDescription = description !== undefined ? description    : existing.description;
    const updatedStatus      = status      !== undefined ? status         : existing.status;
    const updatedPriority    = priority    !== undefined ? priority       : existing.priority;
    const updatedDueDate     = due_date    !== undefined ? due_date       : existing.due_date;

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?,
          updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      updatedTitle,
      updatedDescription,
      updatedStatus,
      updatedPriority,
      updatedDueDate,
      req.params.id,
      req.user.id
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    return res.status(200).json({
      message: 'Task updated.',
      task
    });
  } catch (err) {
    next(err);
  }
}

// --- DELETE TASK ---
// DELETE /api/tasks/:id
function deleteTask(req, res, next) {
  try {
    const result = db.prepare(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?'
    ).run(req.params.id, req.user.id);

    // result.changes tells us how many rows were deleted
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'Task not found.'
      });
    }

    return res.status(200).json({ message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
