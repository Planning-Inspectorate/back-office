const { createHasAppealSubmissionRecord } = require('../lib/db-wrapper');
const logger = require('../lib/logger');

const postAppealSubmission = async (req, res) => {
  try {
    const { body } = req;
    const result = await createHasAppealSubmissionRecord(body);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to insert appeal submission');
    res.status(500).send('Failed to insert appeal submission');
  }
};

module.exports = {
  postAppealSubmission,
};
