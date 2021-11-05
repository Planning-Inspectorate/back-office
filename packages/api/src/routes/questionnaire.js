const express = require('express');
const {
  getAllQuestionnaires,
  getOneQuestionnaire,
  postQuestionnaire,
  setQuestionnaireOutcome,
} = require('../controllers/questionnaire');

const router = express.Router();

router.get('/', getAllQuestionnaires);
router.get('/:appealId', getOneQuestionnaire);
router.post('/', postQuestionnaire);
router.post('/:appeaId/outcome', setQuestionnaireOutcome);

module.exports = router;
