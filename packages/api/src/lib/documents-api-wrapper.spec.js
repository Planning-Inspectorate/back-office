const fetch = require('node-fetch');
const { getDocumentsMetadata } = require('./documents-api-wrapper');
const documentsProperties = require('../../test/data/documents-properties');
const documentsMetadata = require('../../test/data/documents-metadata');

jest.mock('node-fetch');

fetch
  .mockImplementationOnce(() => ({
    ok: true,
    json: jest.fn().mockReturnValue(documentsProperties),
  }))
  .mockImplementationOnce(() => ({
    ok: false,
  }))
  .mockImplementationOnce(() => {
    throw new Error('Internal Server Error');
  });

describe('lib/documents-api-wrapper', () => {
  const appealId = 'd754eec0-d59f-4603-a0ec-7ef19ea0c47c';

  describe('getDocumentsMetadata', () => {
    it('should return the correct data when a successful response is received', async () => {
      const metadata = await getDocumentsMetadata(appealId);

      expect(metadata).toEqual(documentsMetadata);
    });

    it('should return null when an unsuccessful response is received', async () => {
      const metadata = await getDocumentsMetadata(appealId);

      expect(metadata).toEqual(null);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => getDocumentsMetadata(appealId)).rejects.toThrow(
        'Failed to get documents - Error: Internal Server Error'
      );
    });
  });
});
