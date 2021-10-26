const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockDbRecord = require('../../test/data/hasAppealSubmissionDbRecord');

jest.mock('../lib/db-wrapper', () => ({
  find: jest
    .fn()
    .mockImplementationOnce(() => [mockDbRecord])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  insert: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  sequelize: jest.fn().mockReturnValue({
    define: jest.fn(),
  }),
}));

const { getAppeal, postAppeal } = require('./appeal');

describe('controllers/appeal', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAppeal', () => {
    it('should respond a success status and the correct data when data can be fetched', async () => {
      await getAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith([mockDbRecord]);
    });

    it('should respond with an error status and the correct data when an error occurs', async () => {
      await getAppeal(req, res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to find data');
    });
  });

  describe('postAppeal', () => {
    it('should respond with a success status and the correct data when data can be inserted', async () => {
      await postAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should respond with an error status and the correct data when an error occurs', async () => {
      await postAppeal(req, res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to insert data');
    });
  });
});
