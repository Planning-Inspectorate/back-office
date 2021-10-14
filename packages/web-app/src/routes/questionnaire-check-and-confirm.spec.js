const { get } = require('../../test/routes/router-mock');
const checkAndConfirmController = require('../controllers/questionnaire-check-and-confirm');
const checkAppealOutcome = require('../middleware/check-appeal-outcome');

describe('routes/questionnaire-check-and-confirm', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./questionnaire-check-and-confirm');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:appealId',
      [checkAppealOutcome],
      checkAndConfirmController.getCheckAndConfirm
    );
  });
});
