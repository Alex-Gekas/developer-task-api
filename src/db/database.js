// src/db/database.js
// This file sets up the SQLite database connection and creates our tables
// if they don't already exist. It runs once when the server starts.

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Read the DB path from environment variables (set in .env)
const dbPath = process.env.DB_PATH || './data/tasks.db';

// Make sure the folder that will hold the database file exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open (or create) the SQLite database file
const db = new Database(dbPath);

// Enable WAL mode for better performance with concurrent reads
db.pragma('journal_mode = WAL');

// --- Create the "users" table ---
// This stores registered user accounts.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,         -- UUID, e.g. "a1b2c3d4-..."
    email      TEXT UNIQUE NOT NULL,     -- Must be unique across all users
    password   TEXT NOT NULL,            -- Stored as a bcrypt hash, never plain text
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// --- Create the "tasks" table ---
// Each task belongs to one user (via user_id).
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,           -- Which user owns this task
    title       TEXT NOT NULL,
    description TEXT,                    -- Optional longer notes
    status      TEXT NOT NULL DEFAULT 'pending',  -- pending | in_progress | completed
    priority    TEXT NOT NULL DEFAULT 'medium',   -- low | medium | high
    due_date    TEXT,                    -- ISO 8601 date string, e.g. "2024-12-31"
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),

    -- Ensure user_id refers to a real user; delete tasks if user is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
