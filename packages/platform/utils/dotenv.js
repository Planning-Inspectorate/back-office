import dotenv from 'dotenv';
import path from 'node:path';

/**
 * Evaluates all .env files, and returns a merged configuration of locally
 * defined variables.
 *
 * @param {string} [environment='development']
 * @returns {Record<string, string>}
 */
export function loadEnvironment(environment = 'development') {
	/** @type {Record<string, string>} */
	const config = {};

	for (const pathToFile of [
		'.env',
		`.env.${environment}`,
		'.env.local',
		`.env.${environment}.local`
	]) {
		Object.assign(config, dotenv.config({ path: path.resolve(pathToFile) }).parsed);
	}
	return config;
}
