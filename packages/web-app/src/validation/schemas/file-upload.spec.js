const fileUpload = require('./file-upload');

jest.mock('pins-mime-validation', () => ({
  validMimeType: jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error('Text Test.txt must be a DOC, DOCX, PDF, TIF, JPG or PNG');
    })
    .mockImplementationOnce(() => true),
  validateMimeBinaryType: jest.fn().mockImplementationOnce(() => {
    throw new Error('Text Test.txt must be a DOC, DOCX, PDF, TIF, JPG or PNG');
  }),
}));

jest.mock('../../config/config', () => ({
  fileUpload: {
    maxSizeInBytes: 10000,
  },
}));

describe('validation/schemas/file-upload', () => {
  let req;
  let schema;

  beforeEach(() => {
    req = {};
    schema = fileUpload['file-upload'].custom.options;
  });

  it('should throw the correct error when req.files is empty', async () => {
    req.files = [];

    await expect(() => schema(null, { req })).rejects.toThrow('Select a document to add');
  });

  it('should throw the correct error when req.files does not exist', async () => {
    await expect(() => schema(null, { req })).rejects.toThrow('Select a document to add');
  });

  it('should throw the correct error when a file has an incorrect mime type', async () => {
    req.files = [
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
      },
      {
        mimetype: 'text/plain',
        originalname: 'Text Test.txt',
      },
    ];

    await expect(() => schema(null, { req })).rejects.toThrow(
      'Text Test.txt must be a DOC, DOCX, PDF, TIF, JPG or PNG'
    );
  });

  it('should throw the correct error when a file has a file size which is too large', async () => {
    req.files = [
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
        size: 1000,
      },
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
        size: 100000000,
      },
    ];

    await expect(() => schema(null, { req })).rejects.toThrow(
      'PDF Test.pdf must be smaller than 10KB'
    );
  });

  it('should throw the correct error when a file has an incorrect binary mime type', async () => {
    req.files = [
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
      },
      {
        mimetype: 'application/pdf',
        originalname: 'Text Test.pdf',
      },
    ];

    await expect(() => schema(null, { req })).rejects.toThrow(
      'Text Test.txt must be a DOC, DOCX, PDF, TIF, JPG or PNG'
    );
  });

  it('should return true when valid files are uploaded', async () => {
    req.files = [
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
      },
      {
        mimetype: 'application/pdf',
        originalname: 'PDF Test.pdf',
      },
    ];

    const result = schema(null, { req });

    expect(result).toBeTruthy();
  });
});
