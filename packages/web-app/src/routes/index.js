const express = require('express');
const appealsList = require('./appeals-list');
const questionnairesList = require('./questionnaires-list');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const home = require('./home');
const documentsServiceProxyRouter = require('./document-service-proxy');

const router = express.Router();

router.use('/', appealsList);
router.use('/', questionnairesList);
router.use('/', home);
router.use('/', reviewAppealSubmission);
router.use('/', validAppealDetails);
router.use('/document', documentsServiceProxyRouter);

module.exports = router;
