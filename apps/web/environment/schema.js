import joi from 'joi';

const logLevel = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

export const baseSchema = joi
	.object({
		buildDir: joi.string(),
		bundleAnalyzer: joi.boolean(),
		cwd: joi.string(),
		env: joi.string().valid('development', 'production', 'test', 'local'),
		isProduction: joi.boolean(),
		isDevelopment: joi.boolean(),
		isTest: joi.boolean(),
		isRelease: joi.boolean().optional()
	})
	.options({ presence: 'required' }); // all required by default

export default baseSchema
	.append({
		appHostname: joi.string(),
		apiUrl: joi.string().uri(),
		appInsightsConnectionString: joi.string().optional(),
		authDisabled: joi.boolean().optional(),
		authDisabledGroupIds: joi.array().optional(),
		authRedirectPath: joi.string(),
		azureKeyVaultEnabled: joi.boolean().optional(),
		blobStorageUrl: joi.string(),
		logLevelFile: joi.string().valid(...logLevel),
		logLevelStdOut: joi.string().valid(...logLevel),
		msal: joi
			.object({
				authority: joi.string(),
				clientId: joi.string(),
				clientSecret: joi.string(),
				logoutUri: joi.string()
			})
			.options({ presence: 'required' }),
		serverProtocol: joi.string().valid('http', 'https'),
		serverPort: joi.number(),
		serviceName: joi.string(),
		session: joi
			.object({
				// ...env means `.env` property of the parent object
				redis: joi.string().when('...env', { not: 'production', then: joi.optional() }),
				secret: joi.string().when('...env', { is: 'test', then: joi.optional() })
			})
			.when('env', { is: 'test', then: joi.optional() }),
		disableRedis: joi.boolean().optional(),
		sslCertificateFile: joi.string().when('serverProtocol', { is: 'http', then: joi.optional() }),
		sslCertificateKeyFile: joi
			.string()
			.when('serverProtocol', { is: 'http', then: joi.optional() }),
		referenceData: joi
			.object({
				applications: joi
					.object({
						caseAdminOfficerGroupId: joi.string(),
						caseTeamGroupId: joi.string(),
						inspectorGroupId: joi.string()
					})
					.options({ presence: 'required' })
			})
			.options({ presence: 'required' }),
		featureFlags: joi.object().pattern(/featureFlagBoas\d+[A-Za-z]+/, joi.boolean())
	})
	.options({ presence: 'required' }); // all required by default
