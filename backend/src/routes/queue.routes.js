const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');

router.get('/my-status', queueController.getMyQueueStatus);
router.get('/:centreId', queueController.getCentreQueue);
router.post('/join', queueController.joinQueue);
router.patch('/:id/status', queueController.updateQueueStatus);

module.exports = router;
