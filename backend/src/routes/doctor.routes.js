const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/profile', authenticate, doctorController.getDoctorProfile);
router.patch('/profile', authenticate, authorizeRoles('DOCTOR', 'ADMIN'), doctorController.updateDoctorProfile);
router.get('/appointments', authenticate, doctorController.getDoctorAppointments);
router.patch('/appointments/:id', authenticate, authorizeRoles('DOCTOR', 'ADMIN'), doctorController.updateAppointmentByDoctor);

module.exports = router;
