const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, appointmentBookingSchema } = require('../validators');

// Doctor availability & listing
router.get('/doctors', appointmentController.getDoctors);
router.get('/doctors/:id', appointmentController.getDoctorById);
router.get('/doctors/:id/availability', appointmentController.getDoctorAvailability);

// Appointment bookings
router.post('/', validate(appointmentBookingSchema), appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
