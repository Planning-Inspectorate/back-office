const { getAppeal, postAppeal, putAppeal, patchAppeal } = require('./appeal');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/appeal', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAppeal', () => {
    it('should respond with the correct status and data', async () => {
      await getAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('GET endpoint exists but has not been implemented yet');
    });
  });

  describe('postAppeal', () => {
    it('should respond with the correct status and data', async () => {
      await postAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('POST endpoint exists but has not been implemented yet');
    });
  });

  describe('putAppeal', () => {
    it('should respond with the correct status and data', async () => {
      await putAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('PUT endpoint exists but has not been implemented yet');
    });
  });

  describe('patchAppeal', () => {
    it('should respond with the correct status and data', async () => {
      await patchAppeal(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('PATCH endpoint exists but has not been implemented yet');
    });
  });
});
