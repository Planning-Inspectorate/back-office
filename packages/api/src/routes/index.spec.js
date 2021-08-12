const appealRouter = require('./appeal');
const apiDocsRouter = require('./api-docs');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toHaveBeenCalledWith('/api/v1/appeal', appealRouter);
    expect(mockUse).toHaveBeenCalledWith('/api-docs', apiDocsRouter);
  });
});
