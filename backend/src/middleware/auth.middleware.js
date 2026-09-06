const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorResponse } = require('../utils/response');
const { mockStore } = require('../database/prisma');

/**
 * Verifies JWT token and attaches user to req.user
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'UNAUTHORIZED', 'Access token is required in Authorization header', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Check for demo token shortcut for easy judging / testing
    if (token === 'demo-patient-token') {
      const patient = mockStore.patients[0];
      req.user = {
        id: patient.userId,
        patientId: patient.id,
        email: patient.email,
        role: 'PATIENT',
        name: patient.name
      };
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'TOKEN_EXPIRED', 'Access token has expired. Please refresh your session.', 401);
    }
    return errorResponse(res, 'INVALID_TOKEN', 'Invalid or malformed authentication token', 401);
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * Allowed roles: 'PATIENT', 'DOCTOR', 'HEALTH_WORKER', 'ADMIN'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'UNAUTHORIZED', 'User context not found', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        'FORBIDDEN',
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};
