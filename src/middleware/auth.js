// src/middleware/auth.js
// This middleware runs BEFORE protected route handlers.
// It checks that the request includes a valid JWT token.
// If the token is missing or invalid, it stops the request and returns a 401 error.
// If the token is valid, it attaches the decoded user info to req.user and calls next().

const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // Tokens are sent in the Authorization header as: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No Authorization header provided. Include: Authorization: Bearer <token>'
    });
  }

  // Split "Bearer eyJ..." into ["Bearer", "eyJ..."]
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header must be in format: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    // jwt.verify() both decodes the token AND checks the signature against JWT_SECRET.
    // If the token was tampered with or signed with a different secret, this throws.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (user id, email) to the request object
    // so downstream route handlers can access it via req.user
    req.user = decoded;

    next(); // Move on to the actual route handler
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'TokenExpired',
        message: 'Your token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      error: 'InvalidToken',
      message: 'Token is invalid or malformed.'
    });
  }
}

module.exports = { authenticate };
