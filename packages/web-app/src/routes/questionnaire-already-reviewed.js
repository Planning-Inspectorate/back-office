const express = require('express');
const {
  getQuestionnaireAlreadySubmitted,
} = require('../controllers/questionnaire-already-reviewed');

const router = express.Router();

router.get('/:appealId', getQuestionnaireAlreadySubmitted);

module.exports = router;
