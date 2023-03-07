// @ts-nocheck
const { defineConfig } = require('cypress');
const { azureSignIn } = require('./cypress/support/login');
const {
	clearAllCookies,
	cookiesFileExists,
	getCookiesFileContents,
	getConfigByFile,
	deleteFile,
	webpackConfig
} = require('./cypress/support/cypressUtils');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');

require('dotenv').config();

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			await preprocessor.addCucumberPreprocessorPlugin(on, config);
			on('task', { AzureSignIn: azureSignIn });
			on('task', { ClearAllCookies: clearAllCookies });
			on('task', { CookiesFileExists: cookiesFileExists });
			on('task', { DeleteFile: deleteFile });
			on('task', { GetConfigByFile: getConfigByFile });
			on('task', { GetCookiesFileContents: getCookiesFileContents });
			on('file:preprocessor', webpackConfig(config));
			return config;
		},
		baseUrl: process.env.BASE_URL,
		env: {
			PASSWORD: process.env.USER_PASSWORD,
			CASE_TEAM_EMAIL: process.env.CASE_TEAM_EMAIL,
			CASE_ADMIN_EMAIL: process.env.CASE_ADMIN_EMAIL,
			INSPECTOR_EMAIL: process.env.INSPECTOR_EMAIL,
			PRESERVE_COOKIES: process.env.PRESERVE_COOKIES
		},
		specPattern: 'cypress/e2e/**/*.feature',
		supportFile: false,
		viewportHeight: 960,
		viewportWidth: 1536,
		defaultCommandTimeout: 10000,
		pageLoadTimeout: 30000,
		experimentalModifyObstructiveThirdPartyCode: true,
		chromeWebSecurity: false,
		experimentalInteractiveRunEvents: true,
		video: false
	}
});
