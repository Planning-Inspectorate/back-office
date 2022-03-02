"use strict";

const dotenv = require("dotenv");
const path = require("path");

/**
 * Loads environment from .env file
 *
 * @param {string} nodeEnvironment Declaration of environment
 * @returns {void}
 */
function loadEnvironment(nodeEnvironment = 'development') {
	const environmentSpecificLocalEnvironment = dotenv.config({
		path: path.resolve(`.env.${nodeEnvironment}.local`),
	});

	const localEnvironment =
		nodeEnvironment === 'test'
			? {}
			: dotenv.config({
				path: path.resolve(`.env.local`),
			});

	const environmentSpecificEnvironment = dotenv.config({
		path: path.resolve(`.env.${nodeEnvironment}`),
	});

	const defaultEnvironment = dotenv.config({ path: path.resolve('.env') });

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
