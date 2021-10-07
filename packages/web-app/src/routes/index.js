const express = require('express');
const appealsList = require('./appeals-list');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const invalidAppealDetails = require('./invalid-appeal-details');
const missingOrWrongAppealDetails = require('./missing-or-wrong');
const home = require('./home');
const documentsServiceProxyRouter = require('./document-service-proxy');
const appealAlreadyReviewed = require('./appeal-already-reviewed');
const views = require('../config/views');
const handleAppealAlreadyReviewed = require('../lib/handle-appeal-already-reviewed');
const getCaseData = require('../lib/get-case-data');

const router = express.Router();

router.use('/', home);
router.use(`/${views.appealsList}`, appealsList);
router.use(
  `/${views.reviewAppealSubmission}/:appealId`,
  getCaseData,
  handleAppealAlreadyReviewed,
  reviewAppealSubmission
);
router.use(`/${views.validAppealDetails}`, handleAppealAlreadyReviewed, validAppealDetails);
router.use(`/${views.invalidAppealDetails}`, handleAppealAlreadyReviewed, invalidAppealDetails);
router.use(`/${views.missingOrWrong}`, handleAppealAlreadyReviewed, missingOrWrongAppealDetails);
router.use('/document', documentsServiceProxyRouter);
router.use(`/${views.appealAlreadyReviewed}`, appealAlreadyReviewed);

module.exports = router;
