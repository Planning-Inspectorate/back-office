jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockPatch = jest.fn();
const mockUse = jest.fn();
const mockReq = () => ({
  log: logger,
  params: {},
  body: {},
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

jest.doMock('express', () => ({
  Router: () => ({
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
    put: mockPut,
    use: mockUse,
  }),
}));

module.exports = {
  mockGet,
  mockPost,
  mockPut,
  mockPatch,
  mockUse,
  mockReq,
  mockRes,
};
