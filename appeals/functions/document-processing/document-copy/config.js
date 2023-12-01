import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	BO_BLOB_STORAGE_ACCOUNT: joi.string(),
	BO_BLOB_CONTAINER: joi.string()
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	BO_BLOB_STORAGE_ACCOUNT: environment.BO_BLOB_STORAGE_ACCOUNT,
	BO_BLOB_CONTAINER: environment.BO_BLOB_CONTAINER
});

if (error) {
	throw error;
}

export default value;
