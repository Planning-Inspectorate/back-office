import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	storageUrl: joi.string(),
	submissionsContainer: joi.string(),
	serviceBusHost: joi.string(),
	serviceBusTopic: joi.string()
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	storageUrl: environment.BLOB_STORAGE_URL,
	submissionsContainer: environment.SUBMISSIONS_BLOB_CONTAINER_NAME,
	serviceBusHost: environment.SERVICE_BUS_HOSTNAME,
	serviceBusTopic: environment.SERVICE_BUS_TOPIC
});

if (error) {
	throw error;
}

export default value;
