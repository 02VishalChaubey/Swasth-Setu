const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');
const { validate, emergencyRequestSchema } = require('../validators');

router.post('/request', validate(emergencyRequestSchema), emergencyController.requestEmergency);
router.get('/helplines', emergencyController.getHelplines);

module.exports = router;
