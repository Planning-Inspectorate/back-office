'use strict';

const merge = require('lodash/merge');
const eslintConfig = require('eslint-config');
const eslintConfigNode = require('eslint-config/node');
const eslintConfigJest = require('eslint-config/jest');

module.exports = merge(eslintConfig, eslintConfigNode, eslintConfigJest, {
	root: true
});
