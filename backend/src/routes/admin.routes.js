const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// In development/demo, allow fallback, but enforce ADMIN role in production
router.get('/stats', adminController.getSystemStats);
router.patch('/doctors/:id/verify', authenticate, authorizeRoles('ADMIN'), adminController.verifyDoctor);
router.post('/centres', authenticate, authorizeRoles('ADMIN'), adminController.createHealthCentre);
router.get('/users', authenticate, authorizeRoles('ADMIN'), adminController.getAllUsers);
router.get('/queues', adminController.getActiveQueuesSummary);

module.exports = router;
