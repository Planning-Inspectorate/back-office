const mockUploadDocuments = jest.fn();

jest.mock('../lib/save-and-continue');
jest.mock('../lib/documents-api-wrapper', () => ({
  uploadDocuments: mockUploadDocuments,
}));

const { documentTypes } = require('@pins/common');
const { getAddDocuments, postAddDocuments } = require('./add-documents');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/add-documents', () => {
  let req;
  let res;

  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';
  const documentType = documentTypes.originalApplication.name;
  const expectedViewData = {
    pageTitle: 'Add documents',
    pageTitleCaption: `${documentTypes[documentType].displayName} documents`,
    backLink: `/${views.appealDetails}/${appealId}`,
    multiple: documentTypes[documentType].multiple,
  };

  beforeEach(() => {
    req = {
      ...mockReq,
      params: {
        appealId,
        documentType,
      },
    };
    res = mockRes();
  });

  describe('getAddDocuments', () => {
    it('should render the view with data correctly', () => {
      getAddDocuments(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.addDocuments, expectedViewData);
    });
  });

  describe('postAddDocuments', () => {
    const files = [{ name: 'PDF Test.pdf' }];

    it('should call saveAndContinue with the correct data when passed a questionnaire id', () => {
      req.files = files;
      req.params.questionnaireId = '460ae60f-e2db-441c-9e7f-d33916d369f3';

      postAddDocuments(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.addDocuments,
        nextPage: `${views.appealDetails}/${appealId}`,
        viewData: expectedViewData,
        saveData: expect.any(Function),
      });
    });

    it('should call saveAndContinue with the correct data when passed an appeal id', () => {
      req.files = files;

      postAddDocuments(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.addDocuments,
        nextPage: `${views.appealDetails}/${appealId}`,
        viewData: expectedViewData,
        saveData: expect.any(Function),
      });
    });
  });
});
