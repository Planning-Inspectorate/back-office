'use strict';

const merge = require('lodash/merge');
const eslintConfig = require('@pins/eslint-config');
const eslintConfigNode = require('@pins/eslint-config/node');

module.exports = merge(eslintConfig, eslintConfigNode, {
	root: true
});
