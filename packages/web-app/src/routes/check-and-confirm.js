const express = require('express');

const router = express.Router();

const checkAndConfirmController = require('../controllers/check-and-confirm');

router.get('/:appealId', checkAndConfirmController.getCheckAndConfirm);

module.exports = router;
