import joi from 'joi';

export default joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	PORT: joi.number(),
	SWAGGER_JSON_DIR: joi.string(),
	DATABASE_URL: joi.string(),
	defaultApiVersion: joi.string(),
	documentStorageApi: joi.object({
		host: joi.string(),
		port: joi.number()
	}),
	serviceBusOptions: joi.object({
		host: joi.string().optional(),
		hostname: joi.string().optional(),
		reconnect_limit: joi.number(),
		password: joi.string().optional(),
		port: joi.number(),
		reconnect: joi.boolean(),
		transport: joi.string().optional(),
		username: joi.string().optional(),
		subscriber: joi.string()
	}),
	msal: joi.object({
		clientId: joi.string().optional(),
		clientSecret: joi.string().optional(),
		tenantId: joi.string().optional()
	}),
	queues: joi.object({
		startedCaseQueue: joi.string()
	}),
	log: joi.object({
		levelFile: joi.string(),
		levelStdOut: joi.string()
	}),
	cwd: joi.string(),
	featureFlags: joi.object().pattern(/featureFlagBoas\d+[A-Za-z]+/, joi.boolean()),
	serviceBusEnabled: joi.boolean().optional(),
	clientCredentialsGrantEnabled: joi.boolean().optional()
});
