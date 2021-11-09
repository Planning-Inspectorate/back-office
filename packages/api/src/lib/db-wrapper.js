const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const ApiError = require('./api-error');
const config = require('../../database/config/config');
const DbError = require('./db-error');

const db = require('../models');
const { mapQuestionnaireOutcome } = require('./mapper');

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
const createHasAppealSubmissionRecord = (data) => createRecord('CreateHASAppealSubmission', data);
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

const findQuestionnaireOutcome = async (appealId) => {
  try {
    const query = `SELECT AppealID, EventDateTime, LookUpQuestionnaireOutcome.Outcome
    FROM backofficedev.dbo.HASAppeal
    LEFT JOIN backofficedev.dbo.LookUpQuestionnaireOutcome
    ON HASAppeal.LPAQuestionnaireReviewOutcomeID = LookUpQuestionnaireOutcome.ID
    WHERE AppealID = ?
    ORDER BY EventDateTime DESC`;

    const appeals = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [appealId],
      plain: false,
    });

    const [appeal] = appeals;

    return {
      id: appeal?.AppealID,
      outcome: appeal?.LPAQuestionnaireReviewOutcomeID,
      datetime: appeal?.EventDateTime,
    };
  } catch (err) {
    throw new DbError('Failed to find a specific questionnaire outcome');
  }
};

const setQuestionnaireOutcome = async (appealId, outcome) => {
  const query = `SELECT AppealID, EventDateTime, LookUpQuestionnaireOutcome.Outcome
  FROM backofficedev.dbo.HASAppeal
  LEFT JOIN backofficedev.dbo.LookUpQuestionnaireOutcome
  ON HASAppeal.LPAQuestionnaireReviewOutcomeID = LookUpQuestionnaireOutcome.ID
  WHERE AppealID = ${appealId}
  ORDER BY EventDateTime DESC`;

  const appeals = await db.sequelize.query(query, { type: QueryTypes.SELECT });
  const [appeal] = appeals;

  const insertQuery = `INSERT INTO backofficedev.dbo.HASAppeal (AppealID, MinisterialTargetDate) 
  VALUES (:AppealID, :MinisterialTargetDate, :RecommendedSiteVisitTypeID)`;

  const [_, metadata] = await db.sequelize.query(insertQuery, {
    type: QueryTypes.INSERT,
    replacements: [
      { ...appeal, LPAQuestionnaireReviewOutcomeID: mapQuestionnaireOutcome(outcome) },
    ],
  });

  return metadata;
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
  createHasAppealSubmissionRecord,
  createHasLpaSubmissionRecord,
  findAllAppeals,
  findOneAppeal,
  findAllQuestionnaires,
  findOneQuestionnaire,
  findQuestionnaireOutcome,
  setQuestionnaireOutcome,
};
