// import { loadEnvironment } from '@pins/platform';
import dotenv from 'dotenv';
import joi from 'joi';
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

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	CLAM_AV_HOST: joi.string(),
	CLAM_AV_PORT: joi.number(),
	log: joi.object({
		levelStdOut: joi.string()
	})
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	CLAM_AV_HOST: environment.CLAM_AV_HOST,
	CLAM_AV_PORT: environment.CLAM_AV_PORT,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	}
});

if (error) {
	throw error;
}

export default value;
