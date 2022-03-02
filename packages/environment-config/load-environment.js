"use strict";

const dotenv = require("dotenv");
const path = require("path");

/**
 * Loads environment from .env file
 *
 * @param {string} nodeEnvironment Declaration of environment
 * @param {string} envFileDirectory Path to env file location
 * @returns {object} Object containing all environment variables
 */
function loadEnvironment(nodeEnvironment = 'development', envFileDirectory = ".") {
	const environmentSpecificLocalEnvironment = dotenv.config({
		path: path.resolve(envFileDirectory, `.env.${nodeEnvironment}.local`),
	});

	const localEnvironment =
		nodeEnvironment === 'test'
			? {}
			: dotenv.config({
				path: path.resolve(`.env.local`),
			});

	const environmentSpecificEnvironment = dotenv.config({
		path: path.resolve(envFileDirectory, `.env.${nodeEnvironment}`),
	});

	const defaultEnvironment = dotenv.config({ path: path.resolve(envFileDirectory, '.env') });

	return Object.assign(
		{},
		defaultEnvironment.parsed,
		environmentSpecificEnvironment.parsed,
		localEnvironment.parsed,
		environmentSpecificLocalEnvironment.parsed
	);
}

module.exports = {
	loadEnvironment
};
