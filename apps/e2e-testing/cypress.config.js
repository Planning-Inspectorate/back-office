const { defineConfig } = require("cypress");
const { azureSignIn } = require("./cypress/support/login");
const { clearAllCookies, cookiesFileExists, getCookiesFileContents, getConfigByFile } = require("./cypress/support/utils");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
require('dotenv').config();

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			await preprocessor.addCucumberPreprocessorPlugin(on, config);

			on("task", { AzureSignIn: azureSignIn });
			on("task", { ClearAllCookies: clearAllCookies });
			on("task", { CookiesFileExists: cookiesFileExists });
			on("task", { GetConfigByFile: getConfigByFile });
			on("task", { GetCookiesFileContents: getCookiesFileContents });
			on(
				"file:preprocessor",
				createBundler({
					plugins: [createEsbuildPlugin.default(config)],
				})
			);
			return config;
		},
		baseUrl: process.env.BASE_URL,
		env: {
			PASSWORD: process.env.USER_PASSWORD,
			CASE_TEAM_EMAIL: process.env.CASE_TEAM_EMAIL,
			CASE_ADMIN_EMAIL: process.env.CASE_ADMIN_EMAIL,
			INSPECTOR_EMAIL: process.env.INSPECTOR_EMAIL
		},
		retries: 1,
		specPattern: "cypress/e2e/**/*.feature",
		supportFile: false,
		viewportHeight: 960,
		viewportWidth: 1536,
		defaultCommandTimeout: 10000
	},
});
