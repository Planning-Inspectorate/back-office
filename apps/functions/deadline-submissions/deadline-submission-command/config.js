import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	apiHost: joi.string(),
	storageUrl: joi.string(),
	submissionsContainer: joi.string(),
	uploadsContainer: joi.string(),
	serviceBusHost: joi.string(),
	serviceBusTopic: joi.string()
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	apiHost: environment.API_HOST,
	storageUrl: environment.BLOB_STORAGE_URL,
	submissionsContainer: environment.SUBMISSIONS_BLOB_CONTAINER_NAME,
	uploadsContainer: environment.UPLOADS_BLOB_CONTAINER_NAME,
	serviceBusHost: environment.SERVICE_BUS_HOSTNAME,
	serviceBusTopic: environment.SERVICE_BUS_TOPIC
});

if (error) {
	throw error;
}

export default value;
