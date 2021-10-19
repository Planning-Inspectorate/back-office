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
const reviewQuestionnaire = require('./review-questionnaire');

describe('routes/index', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledTimes(17);
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
    expect(mockUse).toBeCalledWith('/', reviewAppealSubmission);
    expect(mockUse).toBeCalledWith('/', validAppealDetails);
    expect(mockUse).toBeCalledWith('/', invalidAppealDetails);
    expect(mockUse).toBeCalledWith('/', missingOrWrongDetails);
    expect(mockUse).toBeCalledWith('/', reviewQuestionnaire);
    expect(mockUse).toBeCalledWith('/document', documentsServiceProxyRouter);
    expect(mockUse).toBeCalledWith(`/${views.appealAlreadyReviewed}`, appealAlreadyReviewed);
    expect(mockUse).toBeCalledWith(`/${views.checkAndConfirm}`, checkAndConfirmDetails);
  });
});
