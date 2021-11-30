const express = require('express');
const appealsList = require('./appeals-list');
const questionnairesList = require('./questionnaires-list');
const reviewAppealSubmission = require('./review-appeal-submission');
const appealDetails = require('./appeal-details');
const validAppealDetails = require('./valid-appeal-details');
const invalidAppealDetails = require('./invalid-appeal-details');
const missingOrWrongAppealDetails = require('./missing-or-wrong');
const checkAndConfirmDetails = require('./check-and-confirm');
const reviewComplete = require('./review-complete');
const checkAndConfirm = require('./check-and-confirm');
const questionnaireCheckAndConfirm = require('./questionnaire-check-and-confirm');
const home = require('./home');
const documentsServiceProxy = require('./document-service-proxy');
const appealAlreadyReviewed = require('./appeal-already-reviewed');
const questionnaireAlreadyReviewed = require('./questionnaire-already-reviewed');
const views = require('../config/views');
const handleAppealAlreadyReviewed = require('../lib/handle-appeal-already-reviewed');
const getCaseData = require('../lib/get-case-data');
const reviewQuestionnaireSubmission = require('./review-questionnaire-submission');
const reviewQuestionnaireComplete = require('./review-questionnaire-complete');
const appealSearch = require('./appeal-search');
const appealSearchResults = require('./appeal-search-results');

const router = express.Router();

router.use('/', appealsList);
router.use('/', questionnairesList);
router.use('/', home);
router.use(`/${views.appealsList}`, appealsList);
router.use(
  `/${views.reviewAppealSubmission}/:appealId`,
  getCaseData,
  handleAppealAlreadyReviewed,
  reviewAppealSubmission
);
router.use(`/${views.appealDetails}`, appealDetails);
router.use(`/${views.validAppealDetails}`, handleAppealAlreadyReviewed, validAppealDetails);
router.use(`/${views.invalidAppealDetails}`, handleAppealAlreadyReviewed, invalidAppealDetails);
router.use(`/${views.missingOrWrong}`, handleAppealAlreadyReviewed, missingOrWrongAppealDetails);
router.use(`/${views.document}`, documentsServiceProxy);
router.use(`/${views.appealAlreadyReviewed}`, appealAlreadyReviewed);
router.use(`/${views.checkAndConfirm}`, checkAndConfirmDetails);
router.use(`/${views.reviewComplete}`, reviewComplete);
router.use(
  `/${views.reviewQuestionnaireSubmission}/:appealId`,
  getCaseData,
  reviewQuestionnaireSubmission
);
router.use(`/${views.reviewQuestionnaireComplete}`, reviewQuestionnaireComplete);
router.use(`/${views.questionnairesForReview}/${views.checkAndConfirm}`, checkAndConfirm);
router.use(`/questionnaire-check-and-confirm`, questionnaireCheckAndConfirm);
router.use(`/questionnaire-already-reviewed`, questionnaireAlreadyReviewed);
router.use(`/${views.search}`, appealSearch);
router.use(`/${views.search}`, appealSearchResults);

module.exports = router;
