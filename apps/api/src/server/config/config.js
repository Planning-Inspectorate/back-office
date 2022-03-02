'use strict';

const {loadEnvironment} = require("./load-environment");

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT
};

module.exports = config;
