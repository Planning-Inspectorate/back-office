const express = require('express');
const questionnairesList = require('../controllers/questionnaires-list');
const views = require('../config/views');

const router = express.Router();

router.get(`/${views.questionnairesList}`, questionnairesList);

module.exports = router;
