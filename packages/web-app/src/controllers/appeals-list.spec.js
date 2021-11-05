const getAppealsList = require('./appeals-list');
const { getAllAppeals } = require('../lib/api-wrapper');
const views = require('../config/views');

jest.mock('../lib/api-wrapper', () => ({
  getAllAppeals: jest.fn(),
}));

describe('controllers/appeals-list', () => {
  const appealsListData = [
    {
      id: '5acfba23-af2f-4ce8-a519-3ab41020b6cf',
      reference: 'BRL/Q9999/D/21/1234567',
      dateReceived: '20 May 2021',
      site: '10 Peldon Court, Maidstone, Kent, MD2 5XY',
    },
  ];

  describe('getAppealsList', () => {
    it('should render the view with data correctly', async () => {
      const req = {};
      const res = {
        render: jest.fn(),
      };

      getAllAppeals.mockReturnValue(appealsListData);

      await getAppealsList(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appealsList, {
        appealsListData,
        pageTitle: 'Appeal submissions for review',
      });
    });
  });
});
