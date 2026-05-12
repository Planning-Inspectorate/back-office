import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	API_HOST: joi.string(),
	BLOB_PUBLISH_CONTAINER: joi.string(),
	BLOB_SOURCE_CONTAINER: joi.string(),
	BLOB_STORAGE_ACCOUNT_HOST: joi.string(),
	BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN: joi.string(),
	log: joi.object({
		levelStdOut: joi.string()
	}),
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	SERVICE_BUS_CONNECTION_STRING: joi.string().allow('', null),
	ServiceBusConnection: joi.string().allow('', null)
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	API_HOST: environment.API_HOST,
	BLOB_PUBLISH_CONTAINER: environment.BLOB_PUBLISH_CONTAINER,
	BLOB_SOURCE_CONTAINER: environment.BLOB_SOURCE_CONTAINER,
	BLOB_STORAGE_ACCOUNT_HOST: environment.BLOB_STORAGE_ACCOUNT_HOST,
	BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN: environment.BLOB_STORAGE_ACCOUNT_DOMAIN,
	log: {
		levelStdOut: environment.LOG_LEVEL_STDOUT || 'debug'
	},
	NODE_ENV: environment.NODE_ENV,
	SERVICE_BUS_CONNECTION_STRING: environment.SERVICE_BUS_CONNECTION_STRING,
	ServiceBusConnection: environment.ServiceBusConnection
});

if (error) {
	throw error;
}

const resolvedServiceBusConnectionString =
	value.SERVICE_BUS_CONNECTION_STRING || value.ServiceBusConnection;

if (!resolvedServiceBusConnectionString) {
	throw new Error(
		'No Service Bus connection string configured. Set ServiceBusConnection or SERVICE_BUS_CONNECTION_STRING.'
	);
}

export default {
	...value,
	SERVICE_BUS_CONNECTION_STRING: resolvedServiceBusConnectionString
};
