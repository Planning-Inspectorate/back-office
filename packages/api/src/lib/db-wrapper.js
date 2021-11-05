const ApiError = require('./api-error');
const db = require('../models');

const create = (model, data) => {
  try {
    return db[model.name].create(data);
  } catch (err) {
    throw new ApiError(`Failed to create data with error - ${err.toString()}`);
  }
};

const findAllAppeals = async () => {
  try {
    const query = 'SELECT * FROM AppealData WHERE caseReference IS NOT NULL AND CaseStageId = 1';
    const result = await db.sequelize.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get appeals data with error - ${err.toString()}`);
  }
};

const findOneAppeal = async (appealId) => {
  try {
    const query = `SELECT * FROM AppealData WHERE AppealId = '${appealId}'`;
    const result = await db.sequelize.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get appeal data with error - ${err.toString()}`);
  }
};

const findAllQuestionnaires = async () => {
  try {
    const query = 'SELECT * FROM QuestionnaireData';
    const result = await db.sequelize.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaires data with error - ${err.toString()}`);
  }
};

const findOneQuestionnaire = async (appealId) => {
  try {
    const query = `SELECT * FROM QuestionnaireData WHERE AppealId = '${appealId}'`;
    const result = await db.sequelize.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaire data with error - ${err.toString()}`);
  }
};

module.exports = {
  create,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
};
