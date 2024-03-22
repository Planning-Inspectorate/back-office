import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	API_HOST: joi.string(),
	BLOB_PUBLISH_CONTAINER: joi.string(),
	BLOB_SOURCE_CONTAINER: joi.string(),
	BLOB_STORAGE_ACCOUNT_HOST: joi.string(),
	BLOB_STORAGE_ACCOUNT_DOMAIN: joi.string(),
	log: joi.object({
		levelStdOut: joi.string()
	}),
	NODE_ENV: joi.string().valid('development', 'production', 'test')
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	API_HOST: environment.API_HOST,
	BLOB_PUBLISH_CONTAINER: environment.BLOB_PUBLISH_CONTAINER,
	BLOB_SOURCE_CONTAINER: environment.BLOB_SOURCE_CONTAINER,
	BLOB_STORAGE_ACCOUNT_HOST: environment.BLOB_STORAGE_ACCOUNT_HOST,
	BLOB_STORAGE_ACCOUNT_DOMAIN: environment.BLOB_STORAGE_ACCOUNT_DOMAIN,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	NODE_ENV: environment.NODE_ENV
});

if (error) {
	throw error;
}

export default value;
