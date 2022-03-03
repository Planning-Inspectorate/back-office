'use strict';

const { loadEnvironment } = require('planning-inspectorate-libs');

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT
};

module.exports = config;
