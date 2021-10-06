const express = require('express');
const getAppealsList = require('../controllers/appeals-list');
const checkAndConfirm = require('../controllers/check-and-confirm');
const views = require('../config/views');

const router = express.Router();

router.get(`/${views.appealsList}`, getAppealsList);
router.use(
  `/${views.questionnairesForReview}/${views.checkAndConfirm}`,
  checkAndConfirm.getCheckAndConfirm
);

module.exports = router;
