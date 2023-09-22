import joi from 'joi';

export default joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		PORT: joi.number(),
		SWAGGER_JSON_DIR: joi.string(),
		DATABASE_URL: joi.string(),
		blobStorageUrl: joi.string().when('NODE_ENV', { is: 'development', then: joi.optional() }),
		virusScanningDisabled: joi.boolean().optional(),
		defaultApiVersion: joi.string(),
		documentStorageApi: joi
			.object({
				host: joi.string()
			})
			.when('NODE_ENV', { not: 'production', then: joi.object({ host: joi.optional() }) }),
		serviceBusOptions: joi.object({
			hostname: joi.string().optional()
		}),
		msal: joi.object({
			clientId: joi.string().optional(),
			clientSecret: joi.string().optional(),
			tenantId: joi.string().optional()
		}),
		log: joi.object({
			levelFile: joi.string(),
			levelStdOut: joi.string()
		}),
		cwd: joi.string(),
		featureFlags: joi.object().pattern(/featureFlagBoas\d+[A-Za-z]+/, joi.boolean()),
		serviceBusEnabled: joi.boolean().optional()
	})
	.options({ presence: 'required' }); // required by default
