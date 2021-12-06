const express = require('express');
const { postDocument } = require('../controllers/document');

const router = express.Router();

router.post('/:appealOrQuestionnaireId', postDocument);

module.exports = router;
