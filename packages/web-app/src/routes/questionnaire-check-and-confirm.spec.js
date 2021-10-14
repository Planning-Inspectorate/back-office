const { get } = require('../../test/routes/router-mock');
const checkAndConfirmController = require('../controllers/questionnaire-check-and-confirm');

describe('routes/questionnaires-for-review/check-and-confirm', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./check-and-confirm');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/:appealId', checkAndConfirmController.getCheckAndConfirm);
  });
});
