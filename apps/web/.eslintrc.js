'use strict';

const merge = require("lodash/merge");
const eslintConfig = require("eslint-config");
const eslintConfigNode = require("eslint-config/node");

module.exports = merge(eslintConfig, eslintConfigNode, {
	root: true
});
