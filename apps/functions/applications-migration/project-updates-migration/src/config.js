import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		apiHost: joi.string(),
		wordpressDatabase: {
			username: joi.string(),
			password: joi.string(),
			database: joi.string(),
			host: joi.string(),
			port: joi.string(),
			dialect: joi.string()
		}
	})
	.options({ presence: 'required' }); // all required by default;

/**
 * @typedef {Object} WordpressDatabaseConfig
 * @property {string} username
 * @property {string} password
 * @property {string} database
 * @property {string} host
 * @property {string} port
 * @property {string} dialect
 */

/**
 * @typedef {Object} Config
 * @property {string} NODE_ENV
 * @property {string} apiHost
 * @property {WordpressDatabaseConfig} wordpressDatabase
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
		apiHost: environment.API_HOST,
		wordpressDatabase: {
			username: environment.NI_DB_MYSQL_USERNAME,
			password: environment.NI_DB_MYSQL_PASSWORD,
			database: environment.NI_DB_MYSQL_DATABASE,
			host: environment.NI_DB_MYSQL_HOST,
			port: environment.NI_DB_MYSQL_PORT,
			dialect: environment.NI_DB_MYSQL_DIALECT
		}
	});

	if (error) {
		throw error;
	}
	loadedConfig = value;
	return value;
}
