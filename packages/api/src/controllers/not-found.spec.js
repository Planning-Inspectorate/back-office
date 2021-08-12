const notFound = require('./not-found');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('middleware/not-found', () => {
  const req = mockReq();
  const res = mockRes();

  it('should...', async () => {
    await notFound(req, res);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith('Not Found');
  });
});
