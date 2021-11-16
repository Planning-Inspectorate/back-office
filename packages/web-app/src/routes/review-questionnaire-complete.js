const express = require('express');
const { getReviewQuestionnaireComplete } = require('../controllers/review-questionnaire-complete');

const router = express.Router();

router.get('/', getReviewQuestionnaireComplete);

module.exports = router;