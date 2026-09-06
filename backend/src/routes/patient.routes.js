const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');

// GET /api/patient/dashboard (Public fallback or authenticated)
router.get('/dashboard', patientController.getDashboard);
router.get('/profile', authenticate, patientController.getProfile);

module.exports = router;
