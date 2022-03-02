'use strict';

const path = require('node:path');
const dotenv = require('dotenv');

function loadEnvironment(nodeEnv = 'development') {
	const environmentSpecificLocalEnv = dotenv.config({
		path: path.resolve(`.env.${nodeEnv}.local`),
	});

	const localEnv =
		nodeEnv === 'test'
			? {}
			: dotenv.config({
				path: path.resolve(`.env.local`),
			});

	const environmentSpecificEnv = dotenv.config({
		path: path.resolve(`.env.${nodeEnv}`),
	});

	const defaultEnv = dotenv.config({ path: path.resolve('.env') });

	return Object.assign({}, defaultEnv.parsed, environmentSpecificEnv.parsed, localEnv.parsed, environmentSpecificLocalEnv.parsed);
}

module.exports = {
	loadEnvironment
};
