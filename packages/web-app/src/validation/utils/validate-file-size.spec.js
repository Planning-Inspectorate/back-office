const validateFileSize = require('./validate-file-size');

describe('validation/utils/validate-file-size', () => {
  it('should return true when given a valid file size', () => {
    const isValid = validateFileSize(1000, 10000);
    expect(isValid).toBeTruthy();
  });

  it('should throw the correct error when given an invalid file size and no filename', async () => {
    await expect(() => validateFileSize(10000, 1000)).toThrow(
      'The selected file must be smaller than 1KB'
    );
  });

  it('should throw the correct error when given an invalid file size and a filename', async () => {
    await expect(() => validateFileSize(10000, 1000, 'PDF Test.pdf')).toThrow(
      'PDF Test.pdf must be smaller than 1KB'
    );
  });
});
