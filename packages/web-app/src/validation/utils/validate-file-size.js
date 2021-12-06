const fileSizeDisplay = require('../../lib/file-size-display');

const validateFileSize = (givenFileSize, maxFileSize, fileName = 'The selected file') => {
  if (givenFileSize > maxFileSize) {
    throw new Error(`${fileName} must be smaller than ${fileSizeDisplay(maxFileSize)}`);
  }

  return true;
};

module.exports = validateFileSize;
