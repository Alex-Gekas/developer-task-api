// src/server.js
// The entry point of the application.
// This file creates the Express app, wires up middleware and routes,
// and starts listening for incoming requests.

// Load environment variables from the .env file into process.env
require('dotenv').config();

const express = require('express');

// Initializing the database module runs the CREATE TABLE statements,
// so we do it early before any routes need it.
require('./db/database');

const authRoutes    = require('./routes/auth');
const taskRoutes    = require('./routes/tasks');
const { errorHandler } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// --- Global Middleware ---

// Parse incoming JSON request bodies (makes req.body available)
app.use(express.json());

// --- Routes ---

// Health check — useful for verifying the server is up
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount task routes under /api/tasks
app.use('/api/tasks', taskRoutes);

// --- 404 Handler ---
// If no route above matched, return a clean 404 response
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.method} ${req.path} does not exist.`
  });
});

// --- Global Error Handler ---
// Must be registered last, after all routes.
// Catches any error passed via next(err) in controllers.
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`
  ✅  Task API running
  🌍  http://localhost:${PORT}
  🗄️   Database: ${process.env.DB_PATH || './data/tasks.db'}
  `);
});

module.exports = app; // exported for potential testing use
