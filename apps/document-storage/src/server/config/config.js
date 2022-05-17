import { loadEnvironment } from '@pins/platform';

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	SWAGGER_JSON_DIR: process.env.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	blobStore: {
		connectionString: process.env.AZURE_BLOB_STORE_CONNECTION_STRING,
		container: process.env.AZURE_BLOB_STORE_CONTAINER
	}
};

export default config;
