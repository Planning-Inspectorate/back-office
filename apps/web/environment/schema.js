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
		isRelease: joi.boolean().optional(),
		gitSha: joi.string().optional()
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
		azureAiLanguage: joi.object({
			endpoint: joi.string().optional()
		}),
		azureKeyVaultEnabled: joi.boolean().optional(),
		blobStorageUrl: joi.string(),
		cacheControl: joi.object({ maxAge: joi.string() }).options({ presence: 'required' }),
		logLevelStdOut: joi.string().valid(...logLevel),
		retry: joi.object({
			maxAttempts: joi.number().optional(),
			statusCodes: joi.string().optional()
		}),
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
		customFeaturesByCase: joi.object({
			sensitiveCases: joi.array().optional()
		}),
		featureFlagConnectionString: joi.string().optional(),
		featureFlagsStatic: joi.string().optional(),
		dummyAddressData: joi.boolean().optional(),
		dummyUserData: joi.boolean().optional(),
		frontOfficeURL: joi.string().optional()
	})
	.options({ presence: 'required' }); // all required by default
