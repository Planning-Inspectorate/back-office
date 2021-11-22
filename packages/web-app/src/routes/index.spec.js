const appealsList = require('./appeals-list');
const questionnairesList = require('./questionnaires-list');
const home = require('./home');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const invalidAppealDetails = require('./invalid-appeal-details');
const missingOrWrongDetails = require('./missing-or-wrong');
const { mockUse } = require('../../test/utils/mocks');
const documentsServiceProxyRouter = require('./document-service-proxy');
const appealAlreadyReviewed = require('./appeal-already-reviewed');
const views = require('../config/views');
const handleAppealAlreadyReviewed = require('../lib/handle-appeal-already-reviewed');
const getCaseData = require('../lib/get-case-data');
const checkAndConfirmDetails = require('./check-and-confirm');
const reviewComplete = require('./review-complete');
const reviewQuestionnaireSubmission = require('./review-questionnaire-submission');
const questionnaireCheckAndConfirm = require('./questionnaire-check-and-confirm');
const questionnaireAlreadyReviewed = require('./questionnaire-already-reviewed');
const appealDetails = require('./appeal-details');
const appealSearch = require('./appeal-search');
const appealSearchResults = require('./appeal-search-results');

describe('routes/index', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledTimes(20);
    expect(mockUse).toBeCalledWith('/', appealsList);
    expect(mockUse).toBeCalledWith('/', questionnairesList);
    expect(mockUse).toBeCalledWith('/', home);
    expect(mockUse).toBeCalledWith(`/${views.appealsList}`, appealsList);
    expect(mockUse).toBeCalledWith(
      `/${views.reviewAppealSubmission}/:appealId`,
      getCaseData,
      handleAppealAlreadyReviewed,
      reviewAppealSubmission
    );
    expect(mockUse).toBeCalledWith(
      `/${views.validAppealDetails}`,
      handleAppealAlreadyReviewed,
      validAppealDetails
    );
    expect(mockUse).toBeCalledWith(
      `/${views.invalidAppealDetails}`,
      handleAppealAlreadyReviewed,
      invalidAppealDetails
    );
    expect(mockUse).toBeCalledWith(
      `/${views.missingOrWrong}`,
      handleAppealAlreadyReviewed,
      missingOrWrongDetails
    );
    expect(mockUse).toBeCalledWith('/document', documentsServiceProxyRouter);
    expect(mockUse).toBeCalledWith(`/${views.appealAlreadyReviewed}`, appealAlreadyReviewed);
    expect(mockUse).toBeCalledWith(`/${views.checkAndConfirm}`, checkAndConfirmDetails);
    expect(mockUse).toBeCalledWith(`/${views.reviewComplete}`, reviewComplete);
    expect(mockUse).toBeCalledWith(
      `/${views.reviewQuestionnaireSubmission}/:appealId`,
      getCaseData,
      reviewQuestionnaireSubmission
    );
    expect(mockUse).toBeCalledWith(
      `/questionnaire-check-and-confirm`,
      questionnaireCheckAndConfirm
    );
    expect(mockUse).toBeCalledWith(`/questionnaire-already-reviewed`, questionnaireAlreadyReviewed);
    expect(mockUse).toBeCalledWith(`/${views.appealDetails}/:appealId`, getCaseData, appealDetails);
    expect(mockUse).toBeCalledWith(`/${views.search}`, appealSearch);
    expect(mockUse).toBeCalledWith(`/${views.search}`, appealSearchResults);
  });
});
