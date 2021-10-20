const {
  getQuestionnaireAlreadySubmitted,
} = require('../controllers/questionnaire-already-reviewed');
const { mockGet } = require('../../test/utils/mocks');

jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/questionnaire-already-reviewed', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./questionnaire-already-reviewed');
    expect(mockGet).toBeCalledWith('/:appealId', getQuestionnaireAlreadySubmitted);
  });
});
