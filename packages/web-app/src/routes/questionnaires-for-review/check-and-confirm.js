const express = require('express');
const checkAndConfirm = require('../../controllers/questionnaires-for-review/check-and-confirm');

const router = express.Router();

router.get('/:appealId', checkAndConfirm.getCheckAndConfirm);
module.exports = router;
