const fs = require('fs');
const yaml = require('js-yaml');
const logger = require('./logger');

const getFileContents = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    logger.debug('Successfully loaded file');
    return yaml.safeLoad(fileContents);
  } catch (err) {
    logger.error(`Failed to load file\n${err}`);
    return null;
  }
};

module.exports = getFileContents;
