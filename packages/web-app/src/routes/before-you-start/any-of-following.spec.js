const {
  getAnyOfFollowing,
  postAnyOfFollowing,
} = require('../../controllers/before-you-start/any-of-following');
const { mockGet, mockPost } = require('../../../test/utils/mocks');

describe('routes/appeal-already-reviewed', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./any-of-following');

    expect(mockGet).toBeCalledWith('/', getAnyOfFollowing);
    expect(mockPost).toBeCalledWith('/', postAnyOfFollowing);
  });
});
