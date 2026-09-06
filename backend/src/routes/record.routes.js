const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record.controller');

router.get('/', recordController.getRecords);
router.get('/:id', recordController.getRecordById);
router.post('/', recordController.createRecord);
router.post('/upload', recordController.uploadRecordDocument);

module.exports = router;
