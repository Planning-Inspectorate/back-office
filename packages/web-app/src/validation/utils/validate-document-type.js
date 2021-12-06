const { documentTypes } = require('@pins/common');

const validateDocumentType = (documentType) =>
  Object.values(documentTypes)
    .map(({ name }) => name)
    .includes(documentType);

module.exports = validateDocumentType;
