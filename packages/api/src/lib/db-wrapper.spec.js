const mockHasAppealSubmissionDbRecord = require('../../test/data/has-appeal-submission-db-record');
const mockHasLpaSubmissionDbRecord = require('../../test/data/has-lpa-submission-db-record');
const {
  createHasAppeal,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
} = require('./db-wrapper');

const db = {
  query: jest
    .fn()
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
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
};

describe('lib/db-wrapper', () => {
  const data = { appealId: 'c5facec7-60df-4829-974d-ffa5b0a0a317' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createHasAppeal', () => {
    it('should return the inserted data when the query is successful', () => {
      createHasAppeal(db, data);

      expect(db.query).toBeCalledTimes(1);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => createHasAppeal(db, data)).toThrow(
        'Failed to create HAS appeal data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findAllAppeals', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findAllAppeals(db);

      expect(result).toEqual([mockHasAppealSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findAllAppeals(db)).rejects.toThrow(
        'Failed to get appeals data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findOneAppeal', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findOneAppeal(db);

      expect(result).toEqual(mockHasAppealSubmissionDbRecord);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findOneAppeal(db)).rejects.toThrow(
        'Failed to get appeal data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findAllQuestionnaires', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findAllQuestionnaires(db);

      expect(result).toEqual([mockHasLpaSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findAllQuestionnaires(db)).rejects.toThrow(
        'Failed to get questionnaires data with error - Error: Internal Server Error'
      );
    });
  });

  describe('findOneQuestionnaire', () => {
    it('should return the fetched data when the query is successful', async () => {
      const result = await findOneQuestionnaire(db);

      expect(result).toEqual(mockHasLpaSubmissionDbRecord);
    });

    it('should throw an error when an error occurs', () => {
      expect(() => findOneQuestionnaire(db)).rejects.toThrow(
        'Failed to get questionnaire data with error - Error: Internal Server Error'
      );
    });
  });
});
