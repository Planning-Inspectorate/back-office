const logger = require('../lib/logger');

const notFound = (req, res) => {
  logger.error('Not Found');
  res.status(404).send('Not Found');
};

module.exports = notFound;
