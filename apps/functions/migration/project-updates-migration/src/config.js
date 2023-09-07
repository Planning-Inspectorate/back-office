import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		DATABASE_URL: joi.string()
	})
	.options({ presence: 'required' }); // all required by default;

/**
 * @typedef {Object} Config
 * @property {string} NODE_ENV
 * @property {string} DATABASE_URL - for connecting to the back office database
 */

/** @type {Config|undefined} */
let loadedConfig;

/**
 * @returns {Config}
 */
export function loadConfig() {
	if (loadedConfig) {
		// only load config once
		return loadedConfig;
	}
	const environment = loadEnvironment(process.env.NODE_ENV);

	const { value, error } = schema.validate({
		NODE_ENV: environment.NODE_ENV,
		DATABASE_URL: environment.DATABASE_URL
	});

	if (error) {
		throw error;
	}
	loadedConfig = value;
	return value;
}
