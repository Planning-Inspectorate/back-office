import dotenv from 'dotenv';
import path from 'node:path';

/**
 * Evaluates all .env files, and returns a merged configuration of locally
 * defined variables.
 *
 * @param {string} [environment='development']
 * @returns {Record<string, string | undefined>}
 */
export function loadEnvironment(environment = 'development') {
	/** @type {Record<string, string | undefined>} */
	const config = {};
	const sourceFiles = ['.env', `.env.${environment}`];

	// Ensure tests can run in a deterministic fashion regardless of changes made
	// to local environment (such as during development)
	if (environment !== 'test') {
		sourceFiles.push('.env.local', `.env.${environment}.local`);
	}

	for (const pathToFile of sourceFiles) {
		Object.assign(config, dotenv.config({ path: path.resolve(pathToFile) }).parsed);
	}

	return Object.fromEntries(
		Object.entries({ ...config, ...process.env }).filter(([, value]) => Boolean(value))
	);
}
