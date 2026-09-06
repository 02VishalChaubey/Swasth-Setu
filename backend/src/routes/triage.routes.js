const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triage.controller');
const { validate, triageEvaluateSchema } = require('../validators');

router.post('/', validate(triageEvaluateSchema), triageController.evaluateTriage);
router.post('/evaluate', validate(triageEvaluateSchema), triageController.evaluateTriage);
router.post('/queue', triageController.enqueueTriagePatient);
router.get('/queue', triageController.getTriageQueue);
router.get('/:id', triageController.getTriageById);

module.exports = router;
