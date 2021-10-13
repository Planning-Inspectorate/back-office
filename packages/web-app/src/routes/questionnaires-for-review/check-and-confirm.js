const express = require('express');
const checkAndConfirm = require('../../controllers/questionnaires-for-review/check-and-confirm');

const router = express.Router();

router.get('/', checkAndConfirm.getCheckAndConfirm);
module.exports = router;
