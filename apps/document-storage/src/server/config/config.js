import { loadEnvironment } from '@pins/platform';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	blobStore: {
		connectionString: environment.AZURE_BLOB_STORE_CONNECTION_STRING,
		container: environment.AZURE_BLOB_STORE_CONTAINER
	}
});

if (error) {
	throw error
}

export default value;
