const {
  findAllQuestionnaires,
  findOneQuestionnaire,
  createHasLpaSubmissionRecord,
  createHasAppeal,
  findQuestionnaireOutcome: findOutcome,
  setQuestionnaireOutcome: setOutcome,
} = require('../lib/db-wrapper');

const logger = require('../lib/logger');
const { getDocumentsMetadata } = require('../lib/documents-api-wrapper');
const ApiError = require('../lib/api-error');

const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await findAllQuestionnaires();
    res.status(200).send(questionnaires);
  } catch (err) {
    logger.error({ err }, 'Failed to get questionnaires');
    res.status(500).send('Failed to get questionnaires');
  }
};

const getQuestionnaireOutcome = async (req, res) => {
  try {
    const { appealId } = req.params;
    const { outcome } = req.body;

    if (typeof appealId === 'undefined') {
      throw new Error('appeal id is not defined');
    }

    if (typeof outcome === 'undefined') {
      throw new Error('outcome is not defined');
    }

    const reviewOutcome = findOutcome(appealId);
    return res.status(200).send({ reviewOutcome });
  } catch (err) {
    logger.error({ err }, 'Failed to get questionnaire outcome');
    return res.status(500).send('Failed to get questionnaire outcome');
  }
};

const setQuestionnaireOutcome = async (req, res) => {
  try {
    const { appealId } = req.params;
    const { outcome } = req.body;

    if (typeof appealId === 'undefined') {
      throw new Error('appeal id is not defined');
    }

    if (typeof outcome === 'undefined') {
      throw new Error('outcome is not defined');
    }

    await setOutcome(appealId, outcome);
    return res.sendStatus(204);
  } catch (err) {
    logger.error({ err }, 'Failed to set questionnaires');
    return res.status(500).send('Failed to set questionnaire');
  }
};

const getOneQuestionnaire = async (req, res) => {
  try {
    const { appealId } = req.params;

    if (!appealId) {
      throw new ApiError('No AppealId given');
    }

    const questionnaire = await findOneQuestionnaire(appealId);
    questionnaire.documents = await getDocumentsMetadata(questionnaire.lpaQuestionnaireId);
    res.status(200).send(questionnaire);
  } catch (err) {
    logger.error({ err }, 'Failed to get questionnaire');
    res.status(500).send(`Failed to get questionnaire - ${err.message}`);
  }
};

const postQuestionnaire = async (req, res) => {
  try {
    const { body } = req;
    const result = await createHasLpaSubmissionRecord(body);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to insert questionnaire');
    res.status(500).send('Failed to insert questionnaire');
  }
};

module.exports = {
  getAllQuestionnaires,
  getOneQuestionnaire,
  postQuestionnaire,
  setQuestionnaireOutcome,
  getQuestionnaireOutcome,
};
