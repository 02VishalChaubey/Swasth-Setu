const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * 404 Handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 'NOT_FOUND', `Endpoint ${req.method} ${req.originalUrl} not found on this server`, 404);
};

/**
 * Centralized Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Exception Caught in Middleware', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    return errorResponse(res, 'DUPLICATE_ENTRY', 'A record with this unique value already exists', 409, {
      fields: err.meta?.target
    });
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    return errorResponse(res, 'RECORD_NOT_FOUND', 'The requested record was not found in the database', 404);
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    return errorResponse(res, 'VALIDATION_ERROR', 'Validation failed for request parameters', 400, err.errors);
  }

  return errorResponse(res, 'INTERNAL_SERVER_ERROR', err.message || 'Internal server error occurred', 500);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
