const { get } = require('../../test/routes/router-mock');
const documentServiceProxyController = require('../controllers/document-service-proxy');
const ensureAppealMatchesSessionMiddleware = require('../middleware/ensure-appeal-matches-session');

describe('routes/document-service-proxy', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('./document-service-proxy');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:appealId/:documentId',
      [ensureAppealMatchesSessionMiddleware],
      documentServiceProxyController.getDocument
    );
  });
});
