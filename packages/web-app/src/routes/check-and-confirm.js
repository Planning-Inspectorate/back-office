const express = require('express');

const router = express.Router();

const checkAndConfirmController = require('../controllers/check-and-confirm');
const ensureAppealMatchesSessionMiddleware = require('../middleware/ensure-appeal-matches-session');

router.get(
  '/:appealId',
  [ensureAppealMatchesSessionMiddleware],
  checkAndConfirmController.getCheckAndConfirm
);

module.exports = router;
