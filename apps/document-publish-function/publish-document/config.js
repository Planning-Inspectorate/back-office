import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	DOCUMENT_STORAGE_CONNECTION_STRING: joi.string(),
	DOCUMENT_STORAGE_HOST: joi.string(),
	NSIP_DOC_TOPIC_NAME: joi.string(),
	log: joi.object({
		levelStdOut: joi.string()
	})
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	DOCUMENT_STORAGE_CONNECTION_STRING: environment.DOCUMENT_STORAGE_CONNECTION_STRING,
	DOCUMENT_STORAGE_HOST: environment.DOCUMENT_STORAGE_HOST,
	NSIP_DOC_EVENT_QUEUE: environment.NSIP_DOC_TOPIC_NAME,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	}
});

if (error) {
	throw error;
}

export default value;
