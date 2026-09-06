const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/patients', authenticate, workerController.getAssignedPatients);
router.post('/vitals', authenticate, workerController.recordVitalsByWorker);
router.post('/followups', authenticate, workerController.scheduleFollowUp);
router.get('/tasks', authenticate, workerController.getWorkerTasks);

module.exports = router;
