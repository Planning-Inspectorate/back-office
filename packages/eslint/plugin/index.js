const requireShould = require('./rules/require-should.js');

module.exports = {
  rules: {
    'pins/require-should': requireShould
  },
  configs: {
    recommended: {
      'pins/require-should': 2
    }
  }
};
