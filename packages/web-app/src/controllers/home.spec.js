const getHome = require('./home');
const views = require('../config/views');

describe('controllers/home', () => {
  describe('getHome', () => {
    it('should render the view correctly', () => {
      const req = {};
      const res = {
        redirect: jest.fn(),
      };

      getHome(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${views.appealsList}`);
    });
  });
});
