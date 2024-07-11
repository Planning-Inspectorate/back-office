import joi from 'joi';

export default joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		PORT: joi.number(),
		APPLICATIONINSIGHTS_CONNECTION_STRING: joi.string().optional(),
		SWAGGER_JSON_DIR: joi.string(),
		DATABASE_URL: joi.string(),
		DATABASE_NAME: joi.string(),
		blobStorageUrl: joi.string().when('NODE_ENV', { not: 'production', then: joi.optional() }),
		blobStorageContainer: joi
			.string()
			.when('NODE_ENV', { not: 'production', then: joi.optional() }),
		virusScanningDisabled: joi.boolean().optional(),
		defaultApiVersion: joi.string(),
		serviceBusOptions: joi.object({
			hostname: joi.string().optional()
		}),
		log: joi.object({
			levelStdOut: joi.string()
		}),
		cwd: joi.string(),
		authDisabled: joi.boolean().optional(),
		serviceBusEnabled: joi.boolean().optional(),
		azureKeyVaultEnabled: joi.boolean().optional(),
		featureFlagConnectionString: joi.string().optional(),
		featureFlagsStatic: joi.boolean().optional()
	})
	.options({ presence: 'required' }); // required by default
