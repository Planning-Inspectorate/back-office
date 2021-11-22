/* istanbul ignore file */
const { searchAppeal } = require('../lib/db-wrapper');
const logger = require('../lib/logger');
const ApiError = require('../lib/api-error');

const appealSearch = async (req, res) => {
  try {
    const { searchString } = req.params;

    if (!searchString) {
      throw new ApiError('No search string given');
    }

    const appeal = await searchAppeal(searchString);
    res.status(200).send(appeal);
  } catch (err) {
    logger.error({ err }, 'Failed to get appeals');
    res.status(500).send(`Failed to get appeals - ${err.message}`);
  }
};

module.exports = {
  appealSearch,
};
