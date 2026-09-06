const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitals.controller');
const { validate, vitalsRecordingSchema } = require('../validators');

router.post('/', validate(vitalsRecordingSchema), vitalsController.recordVitals);
router.get('/', vitalsController.getVitalsHistory);
router.get('/latest', vitalsController.getLatestVitals);

module.exports = router;
