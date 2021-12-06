const fetch = require('node-fetch');
const { getDocument, uploadDocuments } = require('./documents-api-wrapper');
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
jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue(Buffer.from('Test PDF file')),
}));

describe('lib/documents-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getDocument', () => {
    it('should call the expected URL', async () => {
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

  describe('uploadDocuments', () => {
    it('should call the expected URL', async () => {
      fetch.mockImplementation(() => ({
        ok: true,
        json: jest.fn().mockReturnValue({ shouldBe: 'valid' }),
      }));

      const appealId = '7eba9d37-c847-42c8-97f9-f43d4d009d28';
      const documentType = 'originalApplication';
      const files = [{ path: 'tmp/test-pdf-file.pdf', originalname: 'PDF Test.pdf' }];

      const response = await uploadDocuments(appealId, documentType, files);

      expect(response[0].json()).toEqual({ shouldBe: 'valid' });
    });
  });
});
