const mockHasAppealSubmissionDbRecord = require('../../test/data/has-appeal-submission-db-record');
const mockHasLpaSubmissionDbRecord = require('../../test/data/has-lpa-submission-db-record');

jest.mock('../models', () => ({
  HASAppealSubmission: {
    create: jest
      .fn()
      .mockImplementationOnce(() => ({}))
      .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      }),
  },
  sequelize: {
    query: jest
      .fn()
      .mockImplementationOnce(() => [[mockHasAppealSubmissionDbRecord]])
      .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      })
      .mockImplementationOnce(() => [[mockHasAppealSubmissionDbRecord]])
      .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      })
      .mockImplementationOnce(() => [[mockHasLpaSubmissionDbRecord]])
      .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      })
      .mockImplementationOnce(() => [[mockHasLpaSubmissionDbRecord]])
      .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
      }),
  },
}));

const {
  create,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
} = require('./db-wrapper');

describe('lib/db-wrapper', () => {
  const model = {
    name: 'HASAppealSubmission',
  };
  const data = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the inserted data when the query is successful', () => {
      const result = create(model, data);

      expect(result).toEqual({});
    });

    it('should throw an error when an error occurs', () => {
      expect(() => create(model, data)).toThrow(
        'Failed to create data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findAllAppeals', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findAllAppeals();

      expect(result).toEqual([mockHasAppealSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findAllAppeals(model)).rejects.toThrow(
        'Failed to get appeals data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findOneAppeal', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findOneAppeal();

      expect(result).toEqual(mockHasAppealSubmissionDbRecord);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findOneAppeal(model)).rejects.toThrow(
        'Failed to get appeal data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findAllQuestionnaires', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findAllQuestionnaires();

      expect(result).toEqual([mockHasLpaSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findAllQuestionnaires(model)).rejects.toThrow(
        'Failed to get questionnaires data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findOneQuestionnaire', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findOneQuestionnaire();

      expect(result).toEqual(mockHasLpaSubmissionDbRecord);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findOneQuestionnaire(model)).rejects.toThrow(
        'Failed to get questionnaire data with error - Error: Internal Server Error'
      );
    });
  });
});
