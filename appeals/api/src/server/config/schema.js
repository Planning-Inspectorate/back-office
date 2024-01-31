import joi from 'joi';

export default joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		PORT: joi.number(),
		SWAGGER_JSON_DIR: joi.string(),
		APPLICATIONINSIGHTS_CONNECTION_STRING: joi.string().optional(),
		DATABASE_URL: joi.string(),
		BO_BLOB_STORAGE_ACCOUNT: joi.string(),
		BO_BLOB_CONTAINER: joi.string(),
		defaultApiVersion: joi.string(),
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
		serviceBusEnabled: joi.boolean().optional(),
		govNotify: joi
			.object({
				api: joi.object({
					key: joi.string() // optional if not NODE_ENV=production
				}),
				template: joi.object({
					validAppellantCase: joi.object({
						id: joi.string()
					})
				}),
				testMailbox: joi.string()
			})
			.when('NODE_ENV', {
				not: 'production',
				then: joi.object({ api: joi.object({ key: joi.optional() }) })
			}),
		appealAllocationLevels: joi.array().items(
			joi.object({
				level: joi.string(),
				band: joi.number()
			})
		),
		horizon: joi.object({
			url: joi.string()
		})
	})
	.options({ presence: 'required' }); // required by default;
