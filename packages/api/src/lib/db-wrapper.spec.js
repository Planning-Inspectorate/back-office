const { Sequelize } = require('sequelize');
const { find, insert, sequelize } = require('./db-wrapper');
const hasAppealSubmissionDbRecord = require('../../test/data/hasAppealSubmissionDbRecord');

jest.mock('sequelize');

describe('lib/db-wrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sequelize', () => {
    it('should return a Sequelize instance when the connection is successful', () => {
      const MockSequelize = class {
        constructor() {
          return this;
        }
      };

      Sequelize.mockImplementation(() => MockSequelize);

      const result = sequelize();

      expect(result).toEqual(MockSequelize);
    });

    it('should throw an error when an error occurs', () => {
      Sequelize.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      expect(() => sequelize()).toThrow(
        'Failed to connect to the database with error - Error: Internal Server Error'
      );
    });
  });

  describe('insert', () => {
    it('should return the inserted data when the query is successful', () => {
      const model = {
        create: jest.fn().mockReturnValue(hasAppealSubmissionDbRecord),
      };
      const data = {};
      const result = insert(model, data);

      expect(result).toEqual(hasAppealSubmissionDbRecord);
    });

    it('should throw an error when an error occurs', () => {
      const model = {
        create: jest.fn().mockImplementation(() => {
          throw new Error('Internal Server Error');
        }),
      };
      const data = {};

      expect(() => insert(model, data)).toThrow(
        'Failed to insert data with error - Error: Internal Server Error'
      );
    });
  });

  describe('find', () => {
    it('should return the fetched data when the query is successful', () => {
      const model = {
        findAll: jest.fn().mockReturnValue([hasAppealSubmissionDbRecord]),
      };
      const result = find(model);

      expect(result).toEqual([hasAppealSubmissionDbRecord]);
    });

    it('should throw an error when an error occurs', () => {
      const model = {
        findAll: jest.fn().mockImplementation(() => {
          throw new Error('Internal Server Error');
        }),
      };

      expect(() => find(model)).toThrow(
        'Failed to find data with error - Error: Internal Server Error'
      );
    });
  });
});
