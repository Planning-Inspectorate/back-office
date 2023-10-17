import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	BLOB_STORAGE_ACCOUNT_HOST: joi.string(),
	BLOB_PUBLISH_CONTAINER: joi.string(),
	log: joi.object({
		levelStdOut: joi.string()
	})
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	BLOB_STORAGE_ACCOUNT_HOST: environment.BLOB_STORAGE_ACCOUNT_HOST,
	BLOB_PUBLISH_CONTAINER: environment.BLOB_PUBLISH_CONTAINER,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	}
});

if (error) {
	throw error;
}

export default value;
