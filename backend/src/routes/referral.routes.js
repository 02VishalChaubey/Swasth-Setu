const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { validate, referralCreateSchema } = require('../validators');

router.post('/', validate(referralCreateSchema), referralController.createReferral);
router.get('/', referralController.getReferrals);
router.get('/:id', referralController.getReferralById);
router.patch('/:id/status', referralController.updateReferralStatus);

module.exports = router;
