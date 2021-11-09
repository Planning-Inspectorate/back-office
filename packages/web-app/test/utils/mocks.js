jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockPatch = jest.fn();
const mockUse = jest.fn();
const mockReq = {
  log: logger,
  params: {},
  body: {},
  session: {
    appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
    questionnaire: {
      caseReference: '5c943cb9-e029-4094-a447-4b3256d6ede7',
      siteAddressLineOne: 'one',
      siteAddressLineTwo: 'two',
      siteAddressTown: 'three',
      siteAddressCounty: 'four',
      siteAddressPostCode: 'five',
      localPlanningAuthorityName: 'seven',
    },
  },
};

const mockRes = () => {
  const res = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

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
  mockNext,
};
