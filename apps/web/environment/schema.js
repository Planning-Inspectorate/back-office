import joi from 'joi';

const logLevel = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

export default joi.object({
	apiUrl: joi.string().uri(),
	authDisabled: joi.boolean().optional(),
	blobStorageUrl: joi.string(),
	env: joi.string().valid('development', 'production', 'test', 'local'),
	isRelease: joi.boolean().optional(),
	logLevelFile: joi.string().valid(...logLevel),
	logLevelStdOut: joi.string().valid(...logLevel),
	msal: joi.object({
		clientId: joi.string(),
		clientSecret: joi.string(),
		tenantId: joi.string()
	}),
	serverProtocol: joi.string().valid('http', 'https'),
	serverPort: joi.number(),
	sessionSecret: joi.string(),
	sslCertificateFile: joi.string(),
	sslCertificateKeyFile: joi.string(),
	referenceData: joi.object({
		appeals: joi.object({
			caseOfficerGroupId: joi.string(),
			inspectorGroupId: joi.string(),
			validationOfficerGroupId: joi.string()
		}),
		applications: joi.object({
			caseAdminOfficerGroupId: joi.string(),
			caseTeamGroupId: joi.string(),
			inspectorGroupId: joi.string()
		})
	}),
	featureFlags: joi.object().pattern(/featureFlagBoas\d+[A-Za-z]+/, joi.boolean()),

	clientCredentialsGrantEnabled: joi.boolean().optional()
});
