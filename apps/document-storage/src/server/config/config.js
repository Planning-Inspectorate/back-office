import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	blobStore: {
		connectionString: environment.AZURE_BLOB_STORE_CONNECTION_STRING,
		container: environment.AZURE_BLOB_STORE_CONTAINER
	},
	log: {
		levelFile: environment.LOG_LEVEL_FILE || 'silent',
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	cwd: url.fileURLToPath(new URL('..', import.meta.url))
});

if (error) {
	throw error
}

export default value;
