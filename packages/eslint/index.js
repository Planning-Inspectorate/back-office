// configs

const recommended = require('./configs/recommended.js');
const comments = require('./configs/comments.js');
const eslint = require('./configs/eslint.js');
const imports = require('./configs/simple-import-sort.js');
const jest = require('./configs/jest.js');
const jsdoc = require('./configs/jsdoc.js');
const pins = require('./configs/pins.js');
const node = require('./configs/node.js');
const unicorn = require('./configs/unicorn.js');

// rules

const requireShould = require('./rules/require-should.js');

module.exports = {
	rules: {
		'pins/require-should': requireShould
	},
	configs: {
		comments,
		eslint,
		imports,
		jest,
		jsdoc,
		node,
		pins,
		recommended,
		unicorn
	}
};
