import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	blobStore: {
		host: environment.AZURE_BLOB_STORE_HOST,
		connectionString: environment.AZURE_BLOB_STORE_CONNECTION_STRING,
		container: environment.AZURE_BLOB_STORE_CONTAINER
	},
	log: {
		levelFile: environment.LOG_LEVEL_FILE || 'silent',
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	cwd: url.fileURLToPath(new URL('..', import.meta.url)),
	defaultApiVersion: '1',
	// flag name convention: featureFlag[ jira number ][ferature shoret description]
	// set Feature Flag default val here [default: true] - will be overwritted by values cming from the .env file
	featureFlags: {
		featureFlagBoas1TestFeature: environment.FEATURE_FLAG_BOAS_1_TEST_FEATURE === 'true'
	}
});

if (error) {
	throw error;
}

export default value;
