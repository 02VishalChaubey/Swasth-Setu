const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacy.controller');

router.get('/nearby', pharmacyController.getNearbyPharmacies);
router.get('/search', pharmacyController.searchMedicine);

module.exports = router;
