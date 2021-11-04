const express = require('express');
const appeal = require('./appeal');
const questionnaire = require('./questionnaire');
const apiDocs = require('./api-docs');

const router = express.Router();

router.use('/api/v1/appeal', appeal);
router.use('/api/v1/questionnaire', questionnaire);
router.use('/api-docs', apiDocs);

module.exports = router;
