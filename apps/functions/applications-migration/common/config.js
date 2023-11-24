import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		synapseDatabase: {
			host: joi.string()
		}
	})
	.options({ presence: 'required' }); // all required by default;

/**
 * @typedef {Object} SynapseDatabaseConfig
 * @property {string} host
 */

/**
 * @typedef {Object} Config
 * @property {string} NODE_ENV
 * @property {SynapseDatabaseConfig} synapseDatabase
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
		synapseDatabase: {
			host: environment.SYNAPSE_SQL_HOST
		}
	});

	if (error) {
		throw error;
	}
	loadedConfig = value;
	return value;
}
