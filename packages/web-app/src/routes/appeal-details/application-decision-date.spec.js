const {
  getApplicationDecisionDate,
  postApplicationDecisionDate,
} = require('../../controllers/appeal-details/application-decision-date');
const { mockGet, mockPost } = require('../../../test/utils/mocks');
const {
  rules: decisionDateValidationRules,
} = require('../../validation/appeal-details/decision-date');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');
const combineDateInputsMiddleware = require('../../middleware/combine-date-inputs');
const govukErrorListOnlyFirst = require('../../lib/govuk-error-list-only-first');

jest.mock('../../validation/appeal-details/decision-date');
jest.mock('../../lib/express-validation-errors-to-govuk-error-list');

describe('routes/appeal-details/application-decision-date', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./application-decision-date');

    expect(mockGet).toBeCalledWith('/', getApplicationDecisionDate);
    expect(mockPost).toBeCalledWith(
      '/',
      [
        combineDateInputsMiddleware,
        decisionDateValidationRules(),
        expressValidationErrorsToGovUkErrorList,
        govukErrorListOnlyFirst,
      ],
      postApplicationDecisionDate
    );
  });
});
