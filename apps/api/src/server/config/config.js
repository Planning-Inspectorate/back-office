import { loadEnvironment } from '@pins/platform';
import url from 'node:url';
import schema from './schema.js';

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	PORT: environment.PORT,
	SWAGGER_JSON_DIR: environment.SWAGGER_JSON_DIR || './src/server/swagger-output.json',
	DATABASE_URL: environment.DATABASE_URL,
	defaultApiVersion: environment.DEFAULT_API_VERSION || '1',
	serviceBusOptions: {
		host: process.env.SERVICE_BUS_HOST,
		hostname: process.env.SERVICE_BUS_HOSTNAME,
		reconnect_limit: Number(process.env.SERVICE_BUS_RECONNECT_LIMIT),
		password: process.env.SERVICE_BUS_PASSWORD,
		port: process.env.SERVICE_BUS_PORT,
		reconnect: false,
		transport: process.env.SERVICE_BUS_TRANSPORT,
		username: process.env.SERVICE_BUS_USERNAME,
		subscriber: process.env.SERVICE_BUS_SUBSCRIBER
	},
	queues: {
		startedCaseQueue: process.env.SERVICE_BUS_STARTED_CASE_QUEUE
	},
	log: {
		levelFile: environment.LOG_LEVEL_FILE || 'silent',
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	cwd: url.fileURLToPath(new URL('..', import.meta.url))
});

if (error) {
	throw error;
}

export default value;
