const fetch = require('node-fetch');
const { getAppealData, getAllAppeals, getAllQuestionnaires, saveData } = require('./api-wrapper');
const singleAppealDataRaw = require('../../test/data/single-appeal-data-raw');
const singleAppealDataFormatted = require('../../test/data/single-appeal-data-formatted');
const appealDataList = require('../../test/data/appeal-data-list');
const singleQuestionnaireDataRaw = require('../../test/data/single-questionnaire-data-raw');
const singleQuestionnaireDataFormatted = require('../../test/data/single-questionnaire-data-formatted');
const questionnaireDataList = require('../../test/data/questionnaire-data-list');

const invalidDocumentList = [
  {
    id: '',
    document_type: 'pdf',
  },
];
const singleAppealDataWithAnInvalidDocument = {
  ...singleAppealDataRaw,
  documents: invalidDocumentList,
};
const singleQuestionnaireDataWithAnInvalidDocument = {
  ...singleQuestionnaireDataRaw,
  documents: invalidDocumentList,
};
const singleAppealDataWithoutDocuments = {
  ...singleAppealDataRaw,
  documents: undefined,
};
const singleQuestionnaireDataWithoutDocuments = {
  ...singleQuestionnaireDataRaw,
  documents: undefined,
};

jest.mock('node-fetch');

describe('lib/apiWrapper', () => {
  describe('getAppealData', () => {
    it('should return the correct data with documents when given an appeal id and both appeal and questionnaire data are found', async () => {
      fetch
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleAppealDataRaw),
        }))
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleQuestionnaireDataRaw),
        }));

      const result = await getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: singleAppealDataFormatted,
        casework: {},
        questionnaire: singleQuestionnaireDataFormatted,
      });
    });

    it('should return the correct data with documents when given an appeal id and only appeal data is found', async () => {
      fetch
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleAppealDataRaw),
        }))
        .mockImplementationOnce(() => ({
          ok: false,
        }));

      const result = await getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: singleAppealDataFormatted,
        casework: {},
        questionnaire: {},
      });
    });

    it('should return the correct data with documents when given an appeal id and only questionnaire data is found', async () => {
      fetch
        .mockImplementationOnce(() => ({
          ok: false,
        }))
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleQuestionnaireDataRaw),
        }));

      const result = await getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: {},
        casework: {},
        questionnaire: singleQuestionnaireDataFormatted,
      });
    });

    it('should return the correct data without documents when given an appeal idand data is returned without documents', async () => {
      fetch
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleAppealDataWithoutDocuments),
        }))
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleQuestionnaireDataWithoutDocuments),
        }));

      const result = await getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: singleAppealDataWithoutDocuments,
        casework: {},
        questionnaire: singleQuestionnaireDataWithoutDocuments,
      });
    });

    it('should return the correct data without documents with an invalid type when given an appeal id', async () => {
      fetch
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleAppealDataWithAnInvalidDocument),
        }))
        .mockImplementationOnce(() => ({
          ok: true,
          json: jest.fn().mockReturnValue(singleQuestionnaireDataWithAnInvalidDocument),
        }));

      const result = await getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c');

      expect(result).toEqual({
        appeal: singleAppealDataWithoutDocuments,
        casework: {},
        questionnaire: singleQuestionnaireDataWithoutDocuments,
      });
    });

    it('should return the default data when not given an appeal id', async () => {
      const result = await getAppealData();

      expect(result).toEqual({
        appeal: {},
        casework: {},
        questionnaire: {},
      });
    });

    it('should throw an error when an error occurs', () => {
      fetch.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      expect(() => getAppealData('6e409024-97f3-4178-a44d-f0f3f234035c')).rejects.toThrow(
        'Failed to get data with error - Error: Internal Server Error'
      );
    });
  });

  describe('getAllAppeals', () => {
    it('should return the correct data when appeals are found', async () => {
      fetch.mockImplementation(() => ({
        ok: true,
        json: jest.fn().mockReturnValue(appealDataList),
      }));

      const result = await getAllAppeals();

      expect(result).toEqual(appealDataList);
    });

    it('should return an empty array when appeals are not found', async () => {
      fetch.mockImplementation(() => ({
        ok: false,
      }));

      const result = await getAllAppeals();

      expect(result).toEqual([]);
    });

    it('should throw an error when an error occurs', async () => {
      fetch.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      expect(() => getAllAppeals()).rejects.toThrow(
        'Failed to get all appeals with error - Error: Internal Server Error'
      );
    });
  });

  describe('getAllQuestionnaires', () => {
    it('should return the correct data when questionnaires are found', async () => {
      fetch.mockImplementation(() => ({
        ok: true,
        json: jest.fn().mockReturnValue(questionnaireDataList),
      }));

      const result = await getAllQuestionnaires();

      expect(result).toEqual(questionnaireDataList);
    });

    it('should return an empty array when questionnaires are not found', async () => {
      fetch.mockImplementation(() => ({
        ok: false,
      }));

      const result = await getAllQuestionnaires();

      expect(result).toEqual([]);
    });

    it('should throw an error when an error occurs', async () => {
      fetch.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      expect(() => getAllQuestionnaires()).rejects.toThrow(
        'Failed to get all questionnaires with error - Error: Internal Server Error'
      );
    });
  });

  describe('saveData', () => {
    it('should return the data when given data', () => {
      const data = {
        appeal: {
          horizonId: 'APP/Q9999/D/21/1234567',
        },
      };

      const result = saveData(data);

      expect(result).toEqual(data);
    });

    it('should return null when not given data', () => {
      const result = saveData();

      expect(result).toBeNull();
    });
  });
});
