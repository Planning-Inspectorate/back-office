const { documentTypes } = require('@pins/common');
const { addDocuments: currentPage, appealDetails: nextPage } = require('../config/views');
const { uploadDocuments } = require('../lib/documents-api-wrapper');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (documentType, appealId) => ({
  pageTitle: 'Add documents',
  pageTitleCaption: `${documentTypes[documentType].displayName} documents`,
  backLink: `/${nextPage}/${appealId}`,
  multiple: documentTypes[documentType].multiple,
});

const getAddDocuments = (req, res) => {
  const { appealId, documentType } = req.params;
  res.render(currentPage, viewData(documentType, appealId));
};

const postAddDocuments = async (req, res) => {
  const {
    files,
    params: { appealId, documentType, questionnaireId },
  } = req;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage: `${nextPage}/${appealId}`,
    viewData: viewData(documentType, appealId),
    saveData: /* istanbul ignore next */ () =>
      uploadDocuments(questionnaireId || appealId, documentType, files),
  });
};

module.exports = {
  getAddDocuments,
  postAddDocuments,
};
