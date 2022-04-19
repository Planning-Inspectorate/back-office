import path from 'path';
import dotenv from 'dotenv';

/**
 * Loads the defined environment variables from the local files
 *
 * @param {string} nodeEnv The Node.js env value
 * @returns {object} Object containing all parsed env variables
 */
export function loadEnvironment(nodeEnv = 'development') {
	const environmentSpecificLocalEnv = dotenv.config({
		path: path.resolve(`.env.${nodeEnv}.local`),
	});

	const localEnv =
		nodeEnv === 'test'
			? {}
			: dotenv.config({
				path: path.resolve('.env.local'),
			});

	const environmentSpecificEnv = dotenv.config({
		path: path.resolve(`.env.${nodeEnv}`),
	});

	const defaultEnv = dotenv.config({ path: path.resolve('.env') });

	return Object.assign({}, defaultEnv.parsed, environmentSpecificEnv.parsed, localEnv.parsed, environmentSpecificLocalEnv.parsed);
}
