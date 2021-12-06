const multer = require('../lib/multer');
const { getAddDocuments, postAddDocuments } = require('../controllers/add-documents');
const { mockGet, mockPost } = require('../../test/utils/mocks');
const checkValidDocumentType = require('../middleware/check-valid-document-type');
const fileUploadValidation = require('../validation/file-upload');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../lib/multer', () => ({
  array: jest.fn(),
}));
jest.mock('../validation/file-upload');

describe('routes/add-documents', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./add-documents');

    expect(mockGet).toBeCalledWith(
      '/:documentType/:appealId/:questionnaireId?',
      checkValidDocumentType,
      getAddDocuments
    );
    expect(mockPost).toBeCalledWith(
      '/:documentType/:appealId/:questionnaireId?',
      checkValidDocumentType,
      multer.array('file-upload'),
      fileUploadValidation(),
      expressValidationErrorsToGovUkErrorList,
      postAddDocuments
    );
  });
});
