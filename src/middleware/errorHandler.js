// src/middleware/errorHandler.js
// A centralized error handler. In Express, any middleware with 4 parameters
// (err, req, res, next) is treated as an error handler. It catches errors
// passed via next(err) from any route handler in the app.

function errorHandler(err, req, res, next) {
  // Log the full error on the server side for debugging
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Determine the status code — use the error's code if set, otherwise 500
  const status = err.status || 500;

  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message
  });
}

module.exports = { errorHandler };
