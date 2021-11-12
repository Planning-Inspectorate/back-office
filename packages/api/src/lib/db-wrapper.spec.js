const mockHasAppealSubmissionDbRecord = require('../../test/data/has-appeal-submission-db-record');
const mockHasLpaSubmissionDbRecord = require('../../test/data/has-lpa-submission-db-record');
const {
  createHasAppealRecord,
  createAppealLinkRecord,
  createHasLpaSubmissionRecord,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
} = require('./db-wrapper');
const db = require('./db-connect');

jest.mock('./db-connect', () => ({
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
    })
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));

describe('lib/db-wrapper', () => {
  const data = { appealId: 'c5facec7-60df-4829-974d-ffa5b0a0a317' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllAppeals', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findAllAppeals();

      expect(result).toEqual([mockHasAppealSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findAllAppeals()).rejects.toThrow(
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
      expect(() => findOneAppeal()).rejects.toThrow(
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
      expect(() => findAllQuestionnaires()).rejects.toThrow(
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
      expect(() => findOneQuestionnaire()).rejects.toThrow(
        'Failed to get questionnaire data with error - Error: Internal Server Error'
      );
    });
  });

  describe('createHasAppealRecord', () => {
    it('should return the correct data when the query is successful', () => {
      createHasAppealRecord(data);

      expect(db.query).toBeCalledTimes(1);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => createHasAppealRecord(data)).toThrow(
        'Failed to execute CreateHASAppeal with error - Error: Internal Server Error'
      );
    });
  });

  describe('createAppealLinkRecord', () => {
    it('should return the correct data when the query is successful', () => {
      createAppealLinkRecord(data);

      expect(db.query).toBeCalledTimes(1);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => createAppealLinkRecord(data)).toThrow(
        'Failed to execute CreateAppealLink with error - Error: Internal Server Error'
      );
    });
  });

  describe('createHasLpaSubmissionRecord', () => {
    it('should return the correct data when the query is successful', () => {
      createHasLpaSubmissionRecord(data);

      expect(db.query).toBeCalledTimes(1);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => createHasLpaSubmissionRecord(data)).toThrow(
        'Failed to execute CreateHASLPASubmission with error - Error: Internal Server Error'
      );
    });
  });
});
