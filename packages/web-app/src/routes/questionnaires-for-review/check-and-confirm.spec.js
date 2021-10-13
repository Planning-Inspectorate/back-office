const { get } = require('../../../test/routes/router-mock');
const checkAndConfirmController = require('../../controllers/questionnaires-for-review/check-and-confirm');

describe('routes/check-and-confirm', () => {
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
