const { mockReq, mockRes } = require('../../test/utils/controller-mocks');
const documentServiceProxyController = require('./document-service-proxy');
const { getDocument } = require('../lib/documents-api-wrapper');

jest.mock('../lib/documents-api-wrapper');

const req = mockReq();
const res = mockRes();

describe('controllers/document-service-proxy', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDocument', () => {
    describe('requires the needed params', () => {
      [
        {
          description: 'should require an appeal ID',
          req,
        },
        {
          description: 'should require a document ID',
          req: {
            ...req,
            params: {
              appealId: 'some fake value',
            },
          },
        },
      ].forEach(({ description, req: request }) => {
        it(description, () => {
          documentServiceProxyController.getDocument(request, res);

          expect(res.sendStatus).toHaveBeenCalledWith(400);
          expect(getDocument).not.toHaveBeenCalledWith();
        });
      });
    });

    describe('has the required params', () => {
      let appealId;
      let documentId;
      let request;

      beforeEach(() => {
        appealId = 'some fake appeal id';
        documentId = 'some fake document id';

        request = {
          ...req,
          params: {
            appealId,
            documentId,
          },
        };
      });

      it('should fail with a 400 error if document lookup fails for any reason', () => {
        getDocument.mockImplementation(() => {
          throw new Error('Something goes wrong with the call');
        });

        documentServiceProxyController.getDocument(request, res);

        expect(getDocument).toHaveBeenCalledWith(appealId, documentId);
        expect(res.sendStatus).toHaveBeenCalledWith(400);
      });

      describe('getDocument succeeds', () => {
        it('should return a 500 if anything goes wrong from this point', async () => {
          getDocument.mockResolvedValue({
            headers: {
              a: 'b',
            },
          });

          await documentServiceProxyController.getDocument(request, res);

          expect(res.sendStatus).toHaveBeenCalledWith(500);
        });

        it('should proxy the document request and set the expected headers', async () => {
          const fakeOriginalFileName = 'some fake file name';
          const fakeContentLength = 12345;
          const fakeContentType = 'fake/type';

          const headers = {
            get: (value) => {
              switch (value) {
                case 'x-original-file-name': {
                  return fakeOriginalFileName;
                }
                case 'content-length': {
                  return fakeContentLength;
                }
                case 'content-type': {
                  return fakeContentType;
                }
                default:
                  throw new Error('Option not defined');
              }
            },
          };

          const mockPipeFn = jest.fn();

          getDocument.mockResolvedValue({
            headers,
            body: {
              pipe: mockPipeFn,
            },
          });

          await documentServiceProxyController.getDocument(request, res);

          expect(getDocument).toHaveBeenCalledWith(appealId, documentId);

          expect(res.set).toHaveBeenCalledWith({
            'content-length': fakeContentLength,
            'content-disposition': `attachment;filename="${fakeOriginalFileName}"`,
            'content-type': fakeContentType,
          });

          expect(res.sendStatus).not.toHaveBeenCalled();

          expect(mockPipeFn).toHaveBeenCalledWith(res);
        });
      });
    });
  });
});
