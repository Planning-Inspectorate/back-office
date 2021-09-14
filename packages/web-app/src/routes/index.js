const express = require('express');
const appealsList = require('./appeals-list');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const home = require('./home');

const router = express.Router();

router.use('/', appealsList);
router.use('/', home);
router.use('/', reviewAppealSubmission);
router.use('/', validAppealDetails);

module.exports = router;
