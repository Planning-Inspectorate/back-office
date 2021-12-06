const checkValidDocumentType = require('./check-valid-document-type');
const { mockReq, mockRes } = require('../../test/utils/controller-mocks');
const { appealDetails } = require('../config/views');

describe('lib/check-valid-document-type', () => {
  const appealId = 'ed8c00d6-f3a1-4426-9250-6f4438cf30ff';
  const req = {
    ...mockReq(),
    params: {
      appealId,
    },
  };
  const res = mockRes();
  const next = jest.fn();

  it('should call next() when the document type is valid', () => {
    req.params.documentType = 'originalApplication';

    checkValidDocumentType(req, res, next);

    expect(next).toBeCalledTimes(1);
  });

  it('should call res.redirect() when the document type is not valid', () => {
    req.params.documentType = 'someOtherDocumentType';

    checkValidDocumentType(req, res, next);

    expect(res.redirect).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledWith(`/${appealDetails}/${appealId}`);
  });
});
