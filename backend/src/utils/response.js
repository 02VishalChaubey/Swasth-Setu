/**
 * Unified Response Formatter for Swasth Setu API
 */
const successResponse = (res, data = null, message = 'Request successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const errorResponse = (res, code = 'INTERNAL_ERROR', message = 'An error occurred', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details) {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse
};
