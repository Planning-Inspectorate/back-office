const { findAllAppeals, findOneAppeal, create } = require('../lib/db-wrapper');
const hasAppealSubmission = require('../models/has-appeal-submission');
const logger = require('../lib/logger');
const { getDocumentsMetadata } = require('../lib/documents-api-wrapper');
const ApiError = require('../lib/api-error');

const getAllAppeals = async (req, res) => {
  try {
    const appeals = await findAllAppeals();
    res.status(200).send(appeals);
  } catch (err) {
    logger.error({ err }, 'Failed to get appeals');
    res.status(500).send('Failed to get appeals');
  }
};

const getOneAppeal = async (req, res) => {
  try {
    const { appealId } = req.params;

    if (!appealId) {
      throw new ApiError('No AppealId given');
    }

    const appeal = await findOneAppeal(appealId);
    appeal.documents = await getDocumentsMetadata(appealId);
    res.status(200).send(appeal);
  } catch (err) {
    logger.error({ err }, 'Failed to get appeal');
    res.status(500).send(`Failed to get appeal - ${err.message}`);
  }
};

const postAppeal = async (req, res) => {
  try {
    const { body } = req;
    const result = await create(hasAppealSubmission, body);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to insert appeal');
    res.status(500).send('Failed to insert appeal');
  }
};

module.exports = {
  getAllAppeals,
  getOneAppeal,
  postAppeal,
};
