/**
 * 404 handler for unmatched routes. Must be registered after all real
 * routes and before errorHandler.
 */
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

/**
 * Centralized error handler. Must be registered last (Express identifies
 * error-handling middleware by its 4-argument signature).
 * Normalizes common Mongoose errors into clean client-facing messages
 * and never leaks a stack trace in production.
 */
const errorHandler = (err, req, res, next) => {
  // Priority: a status a controller already set > a status the error itself
  // carries (e.g. body-parser's malformed-JSON SyntaxError sets err.status
  // before any route handler runs) > 500 default.
  let statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : (err.statusCode || err.status || 500);
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value violates a unique constraint';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
