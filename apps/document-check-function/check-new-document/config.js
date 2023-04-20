import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	API_HOST: joi.string(),
	AzureWebJobsStorage__blobServiceUri: joi.string(),
	CLAM_AV_HOST: joi.string(),
	CLAM_AV_PORT: joi.number(),
	log: joi.object({
		levelStdOut: joi.string()
	})
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	API_HOST: environment.API_HOST,
	DOCUMENT_STORAGE_API_HOST: environment.AzureWebJobsStorage__blobServiceUri,
	CLAM_AV_HOST: environment.CLAM_AV_HOST,
	CLAM_AV_PORT: environment.CLAM_AV_PORT,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	}
});

if (error) {
	throw error;
}

export default value;
