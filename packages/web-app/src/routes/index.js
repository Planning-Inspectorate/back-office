const express = require('express');
const appealsList = require('./appeals-list');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const invalidAppealDetails = require('./invalid-appeal-details');
const missingOrWrongAppealDetails = require('./missing-or-wrong');
const home = require('./home');
const documentsServiceProxyRouter = require('./document-service-proxy');

const router = express.Router();

router.use('/', appealsList);
router.use('/', home);
router.use('/', reviewAppealSubmission);
router.use('/', validAppealDetails);
router.use('/', invalidAppealDetails);
router.use('/', missingOrWrongAppealDetails);
router.use('/document', documentsServiceProxyRouter);

module.exports = router;
