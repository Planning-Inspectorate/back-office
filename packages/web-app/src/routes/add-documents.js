const express = require('express');
const multer = require('../lib/multer');
const { getAddDocuments, postAddDocuments } = require('../controllers/add-documents');
const checkValidDocumentType = require('../middleware/check-valid-document-type');
const fileUploadValidation = require('../validation/file-upload');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/:documentType/:appealId/:questionnaireId?', checkValidDocumentType, getAddDocuments);
router.post(
  '/:documentType/:appealId/:questionnaireId?',
  checkValidDocumentType,
  multer.array('file-upload'),
  fileUploadValidation(),
  expressValidationErrorsToGovUkErrorList,
  postAddDocuments
);

module.exports = router;
