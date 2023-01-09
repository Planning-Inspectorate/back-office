const { defineConfig } = require("cypress");
const { azureSignIn } = require("./cypress/support/login");
const { clearAllCookies, cookiesFileExists, getCookiesFileContents, getConfigByFile } = require("./cypress/support/utils");
require('dotenv').config();

module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			on("task", { AzureSignIn: azureSignIn });
			on("task", { ClearAllCookies: clearAllCookies });
			on("task", { CookiesFileExists: cookiesFileExists });
			on("task", { GetConfigByFile: getConfigByFile });
			on("task", { GetCookiesFileContents: getCookiesFileContents });
			return config;
		},
		baseUrl: process.env.BASE_URL,
		env: {
			PASSWORD: process.env.USER_PASSWORD,
			CASE_OFFICER_EMAIL: process.env.CASE_OFFICER_EMAIL,
			CASE_OFFICER_ADMIN_EMAIL: process.env.CASE_OFFICER_ADMIN_EMAIL,
			INSPECTOR_EMAIL: process.env.INSPECTOR_EMAIL,
			CASE_OFFICER_INSPECTOR_EMAIL: process.env.CASE_OFFICER_INSPECTOR_EMAIL,
			CASE_OFFICER_CASE_OFFICER_ADMIN_EMAIL: process.env.CASE_OFFICER_CASE_OFFICER_ADMIN_EMAIL,
			CASE_OFFICER_ADMIN_INSPECTOR_EMAIL: process.env.CASE_OFFICER_ADMIN_INSPECTOR_EMAIL
		},
		retries: 1
	},
});
