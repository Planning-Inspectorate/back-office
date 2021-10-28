const express = require('express');
const checkAndConfirm = require('../controllers/questionnaire-check-and-confirm');
const checkAppealOutcome = require('../middleware/check-appeal-outcome');

const router = express.Router();

router.get('/:appealId', [checkAppealOutcome], checkAndConfirm.getCheckAndConfirm);
module.exports = router;
