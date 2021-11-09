const express = require('express');
const {
  getAllQuestionnaires,
  getOneQuestionnaire,
  postQuestionnaire,
  setQuestionnaireOutcome,
  getQuestionnaireOutcome,
} = require('../controllers/questionnaire');

const router = express.Router();

router.get('/', getAllQuestionnaires);
router.get('/:appealId', getOneQuestionnaire);
router.post('/', postQuestionnaire);
router.post('/:appealId/outcome', setQuestionnaireOutcome);
router.get('/:appealId/outcome', getQuestionnaireOutcome);

module.exports = router;
