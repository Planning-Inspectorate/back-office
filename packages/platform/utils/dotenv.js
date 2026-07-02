import { loadEnvFile } from 'node:process';
import path from 'node:path';

/**
 * Load .env into process.env
 *
 * @param {string} [environment='development']
 * @returns {Record<string, string | undefined>}
 */
export function loadEnvironment(environment = 'development') {
	const isTest = environment === 'test';

	// either load .env.test for tests, or just .env regardless of environment
	const sourceFile = isTest ? '.env.test' : '.env';
	// load into process.env (process.env takes precendence)
	try {
		loadEnvFile(path.resolve(sourceFile));
	} catch {
		/* ignore errors*/
	}

	return process.env;
}
