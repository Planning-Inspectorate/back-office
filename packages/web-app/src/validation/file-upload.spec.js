const mockSchema = {
  'file-upload': {},
};

jest.mock('express-validator', () => ({
  checkSchema: jest.fn(),
}));
jest.mock('./schemas/file-upload', () => mockSchema);

const { checkSchema } = require('express-validator');
const fileUpload = require('./file-upload');

describe('validation/file-upload', () => {
  it('should call checkSchema with the correct data', () => {
    fileUpload();

    expect(checkSchema).toBeCalledTimes(1);
    expect(checkSchema).toBeCalledWith(mockSchema);
  });
});
