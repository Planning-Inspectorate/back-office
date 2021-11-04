const views = require('../config/views');
const { getAllAppeals } = require('../lib/api-wrapper');
const logger = require('../lib/logger');

const getAppealsList = async (req, res) => {
  const appealsListData = await getAllAppeals();

  logger.debug({ appealsListData }, 'appealsListData');

  res.render(views.appealsList, {
    appealsListData,
    pageTitle: 'Appeal submissions for review',
  });
};

module.exports = getAppealsList;
