const { searchAppeals } = require('../lib/api-wrapper');
const views = require('../config/views');
const logger = require('../lib/logger');

const getAppealSearchResults = async (req, res) => {
  const { searchString } = req.params;
  let searchResults = [];

  try {
    searchResults = await searchAppeals(searchString);
  } catch (err) {
    logger.error({ err }, 'Failed to get appeal search results');
  }

  res.render(views.searchResults, {
    searchResults,
    searchString,
    pageTitle: 'Search results',
  });
};

module.exports = {
  getAppealSearchResults,
};
