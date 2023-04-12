import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	DOCUMENT_STORAGE_CONNECTION_STRING: joi.string(),
	DOCUMENT_STORAGE_HOST: joi.string(),
	log: joi.object({
		levelStdOut: joi.string()
	}),
	serviceBusEnabled: joi.boolean(),
	serviceBusOptions: joi.object({
		hostname: joi.string()
	})
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	DOCUMENT_STORAGE_CONNECTION_STRING: environment.DOCUMENT_STORAGE_CONNECTION_STRING,
	DOCUMENT_STORAGE_HOST: environment.DOCUMENT_STORAGE_HOST,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	serviceBusEnabled: environment.SERVICE_BUS_ENABLED || true,
	serviceBusOptions: {
		hostname: environment.SERVICE_BUS_HOSTNAME
	}
});

if (error) {
	throw error;
}

export default value;
