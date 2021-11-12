const { createAppealLinkRecord } = require('../lib/db-wrapper');
const logger = require('../lib/logger');

const postAppealLink = async (req, res) => {
  try {
    const { body } = req;
    const result = await createAppealLinkRecord(body);
    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to insert appeal link');
    res.status(500).send('Failed to insert appeal link');
  }
};

module.exports = {
  postAppealLink,
};
