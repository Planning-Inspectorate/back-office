import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	submissionsBlobStore: {
		connectionString: joi.string(),
		container: joi.string()
	},
	uploadsBlobStore: {
		connectionString: joi.string(),
		container: joi.string()
	}
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	submissionsBlobStore: {
		connectionString: environment.SUBMISSION_BLOB_CONNECTION_STRING,
		container: environment.SUBMISSIONS_BLOB_CONTAINER_NAME
	},
	uploadsBlobStore: {
		connectionString: environment.UPLOADS_BLOB_CONNECTION_STRING,
		container: environment.UPLOADS_BLOB_CONTAINER_NAME
	}
});

if (error) {
	throw error;
}

export default value;
