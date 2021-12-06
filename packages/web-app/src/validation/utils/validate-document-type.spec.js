const validateDocumentType = require('./validate-document-type');

describe('validation/utils/validate-document-type', () => {
  it('should return true when given a valid document type', () => {
    const isValid = validateDocumentType('originalApplication');
    expect(isValid).toBeTruthy();
  });

  it('should return false when given an invalid document type', () => {
    const isValid = validateDocumentType('someOtherDocumentType');
    expect(isValid).toBeFalsy();
  });
});
