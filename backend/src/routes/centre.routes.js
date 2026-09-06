const express = require('express');
const router = express.Router();
const centreController = require('../controllers/centre.controller');

router.get('/nearby', centreController.getNearbyCentres);
router.get('/', centreController.getCentres);
router.get('/:id', centreController.getCentreById);

module.exports = router;
