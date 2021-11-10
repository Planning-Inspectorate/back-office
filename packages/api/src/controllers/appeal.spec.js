const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockDbRecord = require('../../test/data/has-appeal-submission-db-record');
const mockDocumentsMetadata = require('../../test/data/documents-metadata');

jest.mock('../lib/db-wrapper', () => ({
  dbConnect: jest.fn(),
  findOneAppeal: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  findAllAppeals: jest
    .fn()
    .mockImplementationOnce(() => [mockDbRecord])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  createHasAppeal: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

jest.mock('../lib/documents-api-wrapper', () => ({
  getDocumentsMetadata: jest.fn().mockReturnValue(mockDocumentsMetadata),
}));

const { getOneAppeal, getAllAppeals, postAppeal } = require('./appeal');

describe('controllers/appeal', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAllAppeals', () => {
    it('should return the correct response when data can be fetched', async () => {
      await getAllAppeals(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith([mockDbRecord]);
    });

    it('should return the correct response when an error occurs', async () => {
      await getAllAppeals(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get appeals');
    });
  });

  describe('getOneAppeal', () => {
    it('should return the correct response when given an appeal id and data can be fetched', async () => {
      req.params.appealId = 'da8f8051-bc7f-403c-8431-e9788563c07b';

      await getOneAppeal(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should return the correct response when not given an appeal id', async () => {
      await getOneAppeal(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get appeal - No AppealId given');
    });

    it('should return the correct response when an error occurs', async () => {
      req.params.appealId = 'da8f8051-bc7f-403c-8431-e9788563c07b';

      await getOneAppeal(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get appeal - Internal Server Error');
    });
  });

  describe('postAppeal', () => {
    it('should return the correct response when data can be inserted', async () => {
      await postAppeal(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should return the correct response when an error occurs', async () => {
      await postAppeal(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to insert appeal');
    });
  });
});
