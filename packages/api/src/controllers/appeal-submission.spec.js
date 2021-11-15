const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockDbRecord = require('../../test/data/appeal-submission-db-record');

jest.mock('../lib/db-wrapper', () => ({
  dbConnect: jest.fn(),
  createRecord: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  createHasAppealSubmissionRecord: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

const { postAppealSubmission } = require('./appeal-submission');

describe('controllers/appeal-submission', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('postAppealSubmission', () => {
    it('should return the correct response when data can be inserted', async () => {
      await postAppealSubmission(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should return the correct response when an error occurs', async () => {
      await postAppealSubmission(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to insert appeal submission');
    });
  });
});
