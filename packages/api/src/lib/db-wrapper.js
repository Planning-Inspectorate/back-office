const ApiError = require('./api-error');
const db = require('./db-connect');

const createRecord = (procedure, data) => {
  try {
    const query = `EXEC ${procedure} @json = ?`;
    return db.query(query, { replacements: [JSON.stringify(data)] });
  } catch (err) {
    throw new ApiError(`Failed to execute ${procedure} with error - ${err.toString()}`);
  }
};

const createHasAppealRecord = (data) => createRecord('CreateHASAppeal', data);
const createAppealLinkRecord = (data) => createRecord('CreateAppealLink', data);
const createHasLpaSubmissionRecord = (data) => createRecord('CreateHASLPASubmission', data);

const findAllAppeals = async () => {
  try {
    const query = 'SELECT * FROM AppealData WHERE caseReference IS NOT NULL AND CaseStatusId = 1';
    const result = await db.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get appeals data with error - ${err.toString()}`);
  }
};

const findOneAppeal = async (appealId) => {
  try {
    const query = `SELECT * FROM AppealData WHERE AppealId = '${appealId}'`;
    const result = await db.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get appeal data with error - ${err.toString()}`);
  }
};

const findAllQuestionnaires = async () => {
  try {
    const query = 'SELECT * FROM QuestionnaireData';
    const result = await db.query(query);
    return result[0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaires data with error - ${err.toString()}`);
  }
};

const findOneQuestionnaire = async (appealId) => {
  try {
    const query = `SELECT * FROM QuestionnaireData WHERE AppealId = '${appealId}'`;
    const result = await db.query(query);
    return result[0][0];
  } catch (err) {
    throw new ApiError(`Failed to get questionnaire data with error - ${err.toString()}`);
  }
};

module.exports = {
  createAppealLinkRecord,
  createHasAppealRecord,
  createHasLpaSubmissionRecord,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
};
