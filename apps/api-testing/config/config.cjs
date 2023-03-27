/* eslint-disable unicorn/prefer-module */
require('dotenv').config();

module.exports = {
	baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
	swaggerUrl: 'http://localhost:3000/api-docs/'
};
