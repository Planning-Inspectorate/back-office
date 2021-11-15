const express = require('express');
const checkAndConfirm = require('../controllers/questionnaire-check-and-confirm');
const checkAppealOutcome = require('../middleware/check-appeal-outcome');

const router = express.Router();

router.get('/:appealId', [checkAppealOutcome], checkAndConfirm.getCheckAndConfirm);
router.post('/:appealId', [checkAppealOutcome], checkAndConfirm.setCheckAndConfirm);

module.exports = router;
