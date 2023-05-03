// @ts-nocheck
const { defineConfig } = require('cypress');
const { azureSignIn } = require('./cypress/support/login');
const {
	clearAllCookies,
	cookiesFileExists,
	getCookiesFileContents,
	getConfigByFile,
	deleteDownloads,
	deleteUnwantedFixtures,
	validateDownloadedFile
} = require('./cypress/support/cypressUtils');
const { getSpecPattern } = require('./cypress/support/utils/getSpecPattern');

require('dotenv').config();
const app = process.env.APP;

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			on('task', { AzureSignIn: azureSignIn });
			on('task', { ClearAllCookies: clearAllCookies });
			on('task', { CookiesFileExists: cookiesFileExists });
			on('task', { DeleteDownloads: deleteDownloads });
			on('task', { DeleteUnwantedFixtures: deleteUnwantedFixtures });
			on('task', { GetConfigByFile: getConfigByFile });
			on('task', { GetCookiesFileContents: getCookiesFileContents });
			on('task', { ValidateDownloadedFile: validateDownloadedFile });
			return config;
		},
		baseUrl: process.env.BASE_URL,
		env: {
			PASSWORD: process.env.USER_PASSWORD,
			CASE_TEAM_EMAIL: process.env.CASE_TEAM_EMAIL,
			CASE_ADMIN_EMAIL: process.env.CASE_ADMIN_EMAIL,
			INSPECTOR_EMAIL: process.env.INSPECTOR_EMAIL
		},
		specPattern: getSpecPattern(app),
		supportFile: './cypress/support/e2e.js',
		viewportHeight: 960,
		viewportWidth: 1536,
		defaultCommandTimeout: 10000,
		pageLoadTimeout: 30000,
		experimentalModifyObstructiveThirdPartyCode: true,
		chromeWebSecurity: false,
		experimentalInteractiveRunEvents: true,
		video: false,
		retries: 1
	}
});
