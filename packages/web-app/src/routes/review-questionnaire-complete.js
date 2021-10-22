const express = require('express');
const { getReviewQuestionnaireComplete } = require('../controllers/review-questionnaire-complete');

const router = express.Router();

router.get('/:appealId', getReviewQuestionnaireComplete);

module.exports = router;
