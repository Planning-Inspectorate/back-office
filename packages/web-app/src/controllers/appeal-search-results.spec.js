const { getAppealSearchResults } = require('./appeal-search-results');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { searchAppeals } = require('../lib/api-wrapper');

jest.mock('../lib/api-wrapper', () => ({
  searchAppeals: jest.fn(),
}));

describe('controllers/appeal-search-results', () => {
  const searchString = 'BS4';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getAppealSearchResults', () => {
    it('should render the view with correct data when data is returned', async () => {
      searchAppeals.mockReturnValue([
        {
          appealId: 'dc075313-26dd-4977-9b8d-b14f820144fc',
        },
      ]);

      req.params = {
        searchString,
      };

      await getAppealSearchResults(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.searchResults, {
        searchResults: [
          {
            appealId: 'dc075313-26dd-4977-9b8d-b14f820144fc',
          },
        ],
        searchString,
        pageTitle: 'Search results',
      });
    });

    it('should render the view with correct data when there is an error', async () => {
      searchAppeals.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      req.params = {
        searchString,
      };

      await getAppealSearchResults(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.searchResults, {
        searchResults: [],
        searchString,
        pageTitle: 'Search results',
      });
    });
  });
});
