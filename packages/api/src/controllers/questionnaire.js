const {
  dbConnect,
  findAllQuestionnaires,
  findOneQuestionnaire,
  createHasAppeal,
} = require('../lib/db-wrapper');
const logger = require('../lib/logger');
const { getDocumentsMetadata } = require('../lib/documents-api-wrapper');
const ApiError = require('../lib/api-error');

const db = dbConnect();

const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await findAllQuestionnaires(db);
    res.status(200).send(questionnaires);
  } catch (err) {
    logger.error({ err }, 'Failed to get questionnaires');
    res.status(500).send('Failed to get questionnaires');
  }
};

const getOneQuestionnaire = async (req, res) => {
  try {
    const { appealId } = req.params;

    if (!appealId) {
      throw new ApiError('No AppealId given');
    }

    const questionnaire = await findOneQuestionnaire(db, appealId);
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
    const result = await createHasAppeal(db, body);
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
};
