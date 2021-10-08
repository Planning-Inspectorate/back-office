const toArray = require('../../lib/to-array');

const validateCheckboxValueAgainstOptions = (value, validOptions) => {
  if (value) {
    const valueAsArray = toArray(value);
    if (!valueAsArray.every((item) => validOptions.includes(item))) {
      throw new Error('Invalid option(s) received');
    }
  }
  return true;
};

module.exports = validateCheckboxValueAgainstOptions;
