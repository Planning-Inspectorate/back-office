const express = require('express');
const { postAppealSubmission } = require('../controllers/appeal-submission');

const router = express.Router();

router.post('/', postAppealSubmission);

module.exports = router;
