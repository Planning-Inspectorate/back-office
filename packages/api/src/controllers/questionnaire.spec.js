const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockDbRecord = require('../../test/data/has-lpa-submission-db-record');
const mockDocumentsMetadata = require('../../test/data/documents-metadata');

jest.mock('../lib/db-wrapper', () => ({
  findOneQuestionnaire: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  findAllQuestionnaires: jest
    .fn()
    .mockImplementationOnce(() => [mockDbRecord])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  createRecord: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
  createHasLpaSubmissionRecord: jest
    .fn()
    .mockImplementationOnce(() => mockDbRecord)
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

jest.mock('../lib/documents-api-wrapper', () => ({
  getDocumentsMetadata: jest.fn().mockReturnValue(mockDocumentsMetadata),
}));

const { getOneQuestionnaire, getAllQuestionnaires, postQuestionnaire } = require('./questionnaire');

describe('controllers/questionnaire', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAllQuestionnaires', () => {
    it('should return the correct response when data can be fetched', async () => {
      await getAllQuestionnaires(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith([mockDbRecord]);
    });

    it('should return the correct response when an error occurs', async () => {
      await getAllQuestionnaires(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get questionnaires');
    });
  });

  describe('getOneQuestionnaire', () => {
    it('should return the correct response when given an appeal id and data can be fetched', async () => {
      req.params.appealId = 'da8f8051-bc7f-403c-8431-e9788563c07b';

      await getOneQuestionnaire(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should return the correct response when not given an appeal id', async () => {
      await getOneQuestionnaire(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get questionnaire - No AppealId given');
    });

    it('should return the correct response when an error occurs', async () => {
      req.params.appealId = 'da8f8051-bc7f-403c-8431-e9788563c07b';

      await getOneQuestionnaire(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to get questionnaire - Internal Server Error');
    });
  });

  describe('postQuestionnaire', () => {
    it('should return the correct response when data can be inserted', async () => {
      await postQuestionnaire(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockDbRecord);
    });

    it('should return the correct response when an error occurs', async () => {
      await postQuestionnaire(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Failed to insert questionnaire');
    });
  });
});
