const getCheckAndConfirm = require('./check-and-confirm');
const views = require('../config/views');

describe('controllers/check-and-confirm', () => {
  describe('getAppealsList', () => {
    it('should render the view with data correctly', async () => {
      const req = {};
      const res = {
        render: jest.fn(),
      };

      await getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm);
    });
  });
});
