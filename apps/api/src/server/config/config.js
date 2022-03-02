'use strict';

const {loadEnvironment} = require("../../../../../packages/environment-config/load-environment");

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT
};

module.exports = config;
