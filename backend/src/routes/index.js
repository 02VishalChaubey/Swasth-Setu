const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const centreRoutes = require('./centre.routes');
const appointmentRoutes = require('./appointment.routes');
const queueRoutes = require('./queue.routes');
const triageRoutes = require('./triage.routes');
const referralRoutes = require('./referral.routes');
const recordRoutes = require('./record.routes');
const vitalsRoutes = require('./vitals.routes');
const pharmacyRoutes = require('./pharmacy.routes');
const emergencyRoutes = require('./emergency.routes');
const doctorRoutes = require('./doctor.routes');
const workerRoutes = require('./worker.routes');
const adminRoutes = require('./admin.routes');

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Swasthya Rekha Main Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount microservice route groups
router.use('/auth', authRoutes);
router.use('/patient', patientRoutes);
router.use('/centres', centreRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctors', appointmentRoutes); // Supports /api/doctors
router.use('/queue', queueRoutes);
router.use('/triage', triageRoutes);
router.use('/referrals', referralRoutes);
router.use('/records', recordRoutes);
router.use('/vitals', vitalsRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/doctor', doctorRoutes);
router.use('/worker', workerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
