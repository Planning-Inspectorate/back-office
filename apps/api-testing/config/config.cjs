/* eslint-disable unicorn/prefer-module */
// prettier-ignore
try { require('node:process').loadEnvFile(); } catch {/* ignore errors*/}

module.exports = {
	baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
	swaggerUrl: 'http://localhost:3000/api-docs/'
};
