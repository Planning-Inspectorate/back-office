import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

/**
 * @typedef {Object} Config
 * @property {string} NODE_ENV
 * @property {string} API_HOST
 * @property {number} SUBSCRIPTIONS_PER_BATCH
 * @property {number} WAIT_PER_BATCH_SECONDS
 * @property {string} GOV_NOTIFY_API_KEY
 * @property {string} GOV_NOTIFY_TEMPLATE_ID
 * @property {string} ENCRYPT_ALGORITHM
 * @property {string} ENCRYPT_KEY
 * @property {number} ENCRYPT_IV_LENGTH
 * @property {string} FRONT_OFFICE_URL
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
	const schema = joi
		.object({
			NODE_ENV: joi.string().valid('development', 'production', 'test'),
			API_HOST: joi.string(),
			SUBSCRIPTIONS_PER_BATCH: joi.number().min(1),
			WAIT_PER_BATCH_SECONDS: joi.number().min(0),
			GOV_NOTIFY_API_KEY: joi.string(),
			GOV_NOTIFY_TEMPLATE_ID: joi.string(),
			ENCRYPT_ALGORITHM: joi.string(),
			ENCRYPT_KEY: joi.string(),
			ENCRYPT_IV_LENGTH: joi.number().min(16),
			FRONT_OFFICE_URL: joi.string()
		})
		.options({ presence: 'required' }); // all required by default;

	const environment = loadEnvironment(process.env.NODE_ENV);

	const { value, error } = schema.validate({
		NODE_ENV: environment.NODE_ENV,
		API_HOST: environment.API_HOST,
		SUBSCRIPTIONS_PER_BATCH: environment.SUBSCRIPTIONS_PER_BATCH || 100,
		WAIT_PER_BATCH_SECONDS: environment.WAIT_PER_BATCH_SECONDS || 10,
		GOV_NOTIFY_API_KEY: environment.GOV_NOTIFY_API_KEY,
		GOV_NOTIFY_TEMPLATE_ID: environment.GOV_NOTIFY_TEMPLATE_ID,
		ENCRYPT_ALGORITHM: environment.ENCRYPT_ALGORITHM || 'aes-256-ctr',
		ENCRYPT_KEY: environment.ENCRYPT_KEY || 'x!A%C*F-JaNdRgUkXp2s5v8y/B?E(G+K',
		ENCRYPT_IV_LENGTH: environment.ENCRYPT_IV_LENGTH || 16,
		FRONT_OFFICE_URL: environment.FRONT_OFFICE_URL
	});

	if (error) {
		throw error;
	}
	loadedConfig = value;

	return value;
}
