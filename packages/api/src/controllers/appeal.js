const { find, insert } = require('../lib/db-wrapper');
const hasAppealSubmission = require('../models/has-appeal-submission');
const logger = require('../lib/logger');

const getAppeal = async (req, res) => {
  try {
    const result = await find(hasAppealSubmission);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to find data');
    res.status(500).send('Failed to find data');
  }
};

const postAppeal = async (req, res) => {
  try {
    const result = await insert(hasAppealSubmission, req.body);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to insert data');
    res.status(500).send('Failed to insert data');
  }
};

module.exports = {
  getAppeal,
  postAppeal,
};
