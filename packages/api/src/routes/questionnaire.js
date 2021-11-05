const express = require('express');
const {
  getAllQuestionnaires,
  getOneQuestionnaire,
  postQuestionnaire,
} = require('../controllers/questionnaire');

const router = express.Router();

router.get('/', getAllQuestionnaires);
router.get('/:appealId', getOneQuestionnaire);
router.post('/', postQuestionnaire);

module.exports = router;
