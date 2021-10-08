const getCheckAndConfirm = require('./appeals-list');
const views = require('../config/views');

describe('controllers/check-and-confirm', () => {
  describe('getAppealsList', () => {
    it('should render the view with data correctly', () => {
      const req = {};
      const res = {
        render: jest.fn(),
      };

      getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm);
    });
  });
});
