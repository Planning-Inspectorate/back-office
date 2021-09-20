const fetch = require('node-fetch');
const { getDocument } = require('./documents-api-wrapper');

const config = require('../config/config');

const mockLogger = jest.fn();

config.documents.url = 'http://fake.url';

jest.mock('./logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    warn: mockLogger,
  }),
}));

describe('lib/documents-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getDocument', () => {
    it(`should call the expected URL`, async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getDocument('123', '456');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/123/456/file');
    });

    it('should gracefully handle a fetch failure', async () => {
      fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
        status: 400,
      });

      /**
       * Non-standard way to handle functions that throw in Jest.
       * I believe this is because of `utils.promiseTimout`.
       */
      try {
        await getDocument('123', '456');
      } catch (e) {
        expect(e.toString()).toEqual('Error: something went wrong');
      }
    });
  });
});
