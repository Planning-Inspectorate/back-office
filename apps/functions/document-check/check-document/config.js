import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	CLAM_AV_HOST: joi.string(),
	CLAM_AV_PORT: joi.number(),
	EXCLUDED_STORAGE_ACCOUNTS: joi.array().items(joi.string()),
	serviceBus: {
		host: joi.string(),
		topic: joi.string()
	},
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
	EXCLUDED_STORAGE_ACCOUNTS: JSON.parse(environment.EXCLUDED_STORAGE_ACCOUNTS ?? '[]'),
	serviceBus: {
		host: environment.SERVICE_BUS_HOST,
		topic: environment.SERVICE_BUS_TOPIC
	},
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	}
});

if (error) {
	throw error;
}

export default value;
