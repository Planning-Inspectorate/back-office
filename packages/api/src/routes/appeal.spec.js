const { getAppeal, postAppeal, putAppeal, patchAppeal } = require('../controllers/appeal');
const { mockGet, mockPatch, mockPost, mockPut } = require('../../test/utils/mocks');

describe('routes/appeal', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./appeal');

    expect(mockGet).toHaveBeenCalledWith('/', getAppeal);
    expect(mockPost).toHaveBeenCalledWith('/', postAppeal);
    expect(mockPut).toHaveBeenCalledWith('/', putAppeal);
    expect(mockPatch).toHaveBeenCalledWith('/', patchAppeal);
  });
});
