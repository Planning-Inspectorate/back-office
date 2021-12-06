const validateDocumentType = require('../validation/utils/validate-document-type');
const { appealDetails } = require('../config/views');

const checkValidDocumentType = (req, res, next) => {
  const {
    params: { appealId, documentType },
  } = req;

  const isValidDocumentType = validateDocumentType(documentType);

  if (isValidDocumentType) {
    return next();
  }

  return res.redirect(`/${appealDetails}/${appealId}`);
};

module.exports = checkValidDocumentType;
