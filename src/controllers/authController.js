// src/controllers/authController.js
// Handles user signup and login. Controllers contain the actual business logic
// and are kept separate from route definitions to keep the code organized.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// --- SIGNUP ---
// POST /api/auth/signup
// Creates a new user account. Passwords are hashed before storage.
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'name, email, and password are all required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Password must be at least 8 characters long.'
      });
    }

    // Check if an account with this email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email already exists.'
      });
    }

    // Hash the password using bcrypt (saltRounds=10 is the recommended default)
    // Hashing is a one-way process — the original password is never stored
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = uuidv4();

    // Insert the new user into the database
    db.prepare(`
      INSERT INTO users (id, email, password, name)
      VALUES (?, ?, ?, ?)
    `).run(userId, email, hashedPassword, name);

    // Return a JWT so the user is immediately logged in after signup
    const token = generateToken({ id: userId, email });

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: userId, name, email }
    });
  } catch (err) {
    next(err); // Pass unexpected errors to the global error handler
  }
}

// --- LOGIN ---
// POST /api/auth/login
// Verifies credentials and returns a JWT if they are correct.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'email and password are required.'
      });
    }

    // Look up the user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      // Use the same message whether the email or password is wrong
      // to avoid revealing which one failed (security best practice)
      return res.status(401).json({
        error: 'InvalidCredentials',
        message: 'Invalid email or password.'
      });
    }

    // bcrypt.compare() hashes the incoming password and checks it against the stored hash
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'InvalidCredentials',
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

// --- Helper ---
// Creates and signs a JWT containing the user's id and email.
// The token expires based on JWT_EXPIRES_IN in .env (e.g. "7d")
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

module.exports = { signup, login };
