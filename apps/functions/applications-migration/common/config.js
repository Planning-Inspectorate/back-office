import { loadEnvironment } from '@pins/platform';
import joi from 'joi';
import { memoize } from 'lodash-es';

/**
 * @typedef {Object} SynapseDatabaseConfig
 * @property {string} host
 */

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
 * @typedef {Object} ApiConfig
 * @property {string} apiHost
 */

const environment = loadEnvironment(process.env.NODE_ENV);

const validate = (schema, config) => {
	const objectSchema = joi.object(schema).options({ presence: 'required' });

	const { value, error } = objectSchema.validate(config);
	if (error) {
		throw error;
	}
	return value;
};

/**
 * @returns {ApiConfig}
 */
const loadApiConfig = memoize(() => {
	const schema = {
		apiHost: joi.string(),
		azureKeyVaultEnabled: joi.boolean()
	};

	const config = {
		apiHost: environment.API_HOST,
		azureKeyVaultEnabled: environment.KEY_VAULT_ENABLED === 'true'
	};

	validate(schema, config);

	return config;
});

/**
 * @returns {SynapseDatabaseConfig}
 */
const loadSynapseConfig = memoize(() => {
	const schema = {
		synapseDatabase: {
			host: joi.string()
		}
	};

	const config = {
		synapseDatabase: {
			host: environment.SYNAPSE_SQL_HOST
		}
	};

	validate(schema, config);

	return config;
});

/**
 * @returns {WordpressDatabaseConfig}
 */
const loadWordpressConfig = memoize(() => {
	const schema = {
		wordpressDatabase: {
			username: joi.string(),
			password: joi.string(),
			database: joi.string(),
			host: joi.string(),
			port: joi.string(),
			dialect: joi.string()
		}
	};

	const config = {
		wordpressDatabase: {
			username: environment.NI_DB_MYSQL_USERNAME,
			password: environment.NI_DB_MYSQL_PASSWORD,
			database: environment.NI_DB_MYSQL_DATABASE,
			host: environment.NI_DB_MYSQL_HOST,
			port: environment.NI_DB_MYSQL_PORT,
			dialect: environment.NI_DB_MYSQL_DIALECT
		}
	};

	validate(schema, config);

	return config;
});

export { loadApiConfig, loadSynapseConfig, loadWordpressConfig };
