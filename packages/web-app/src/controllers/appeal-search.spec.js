const { getAppealSearch, postAppealSearch } = require('./appeal-search');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/appeal-search', () => {
  const searchString = 'BS4';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getAppealSearch', () => {
    it('should render the view with correct data', () => {
      getAppealSearch(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.search, {
        pageTitle: 'Dashboard',
      });
    });
  });

  describe('postSearch', () => {
    it('should redirect with the correct param', () => {
      req.body = {
        searchString,
      };

      postAppealSearch(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${views.search}/${searchString}`);
    });
  });
});
