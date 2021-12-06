const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/documents-api-wrapper', () => ({
  uploadDocument: jest
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

const { postDocument } = require('./document');

describe('controllers/document', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('postDocument', () => {
    it('should return the correct response when the document can be uploaded', async () => {
      await postDocument(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(true);
    });

    it('should return the correct response when an error occurs', async () => {
      await postDocument(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to upload document');
    });
  });
});
