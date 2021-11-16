const express = require('express');
const checkAndConfirm = require('../controllers/questionnaire-check-and-confirm');

const router = express.Router();

router.get('/:appealId', checkAndConfirm.getCheckAndConfirm);
router.post('/:appealId', checkAndConfirm.setCheckAndConfirm);

module.exports = router;
