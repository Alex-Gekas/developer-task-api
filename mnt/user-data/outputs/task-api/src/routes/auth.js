// src/routes/auth.js
// Defines the URL paths for authentication endpoints
// and connects them to the controller functions that handle the logic.

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// POST /api/auth/signup  — Create a new user account
router.post('/signup', signup);

// POST /api/auth/login   — Log in and receive a JWT token
router.post('/login', login);

module.exports = router;
