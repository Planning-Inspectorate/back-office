const Sequelize = require('sequelize');
const ApiError = require('./api-error');
const config = require('../../database/config/config');

const {
  development: { username, password, database, host, dialect },
} = config;

const dbConnect = () => new Sequelize(database, username, password, { host, dialect });

const createHasAppeal = (db, data) => {
  try {
    const query = `EXEC CreateHASAppeal @json = '${JSON.stringify(data)}'`;
    return db.query(query);
  } catch (err) {
    throw new ApiError(`Failed to create HAS appeal data with error - ${err.toString()}`);
  }
};

const findAllAppeals = async (db) => {
  try {
    const query = 'SELECT * FROM AppealData WHERE caseReference IS NOT NULL AND CaseStageId = 1';
    const result = await db.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get appeals data with error - ${err.toString()}`);
  }
};

const findOneAppeal = async (db, appealId) => {
  try {
    const query = `SELECT * FROM AppealData WHERE AppealId = '${appealId}'`;
    const result = await db.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get appeal data with error - ${err.toString()}`);
  }
};

const findAllQuestionnaires = async (db) => {
  try {
    const query = 'SELECT * FROM QuestionnaireData';
    const result = await db.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaires data with error - ${err.toString()}`);
  }
};

const findOneQuestionnaire = async (db, appealId) => {
  try {
    const query = `SELECT * FROM QuestionnaireData WHERE AppealId = '${appealId}'`;
    const result = await db.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaire data with error - ${err.toString()}`);
  }
};

module.exports = {
  dbConnect,
  createHasAppeal,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
};
