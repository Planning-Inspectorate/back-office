import joi from 'joi';

const logLevel = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

export default joi
	.object({
		apiUrl: joi.string().uri(),
		authDisabled: joi.boolean(),
		bundleAnalyzer: joi.boolean(),
		env: joi.string().valid('development', 'production', 'test'),
		isRelease: joi.boolean().optional(),
		logLevelFile: joi.string().valid(...logLevel),
		logLevelStdOut: joi.string().valid(...logLevel),
		msal: joi
			.object({
				clientId: joi.string(),
				clientSecret: joi.string(),
				cloudInstanceId: joi.string(),
				redirectUri: joi.string(),
				tenantId: joi.string()
			})
			.options({ presence: 'required' })
			.when('authDisabled', requireIf(false)),
		serverProtocol: joi.string().valid('http', 'https'),
		serverPort: joi.number(),
		sslCertificateFile: joi.string().when('serverProtocol', requireIf('https')),
		sslCertificateKeyFile: joi.string().when('serverProtocol', requireIf('https')),
		referenceData: joi.object({
			groups: joi
				.object({
					caseOfficerGroupId: joi.string(),
					inspectorGroupId: joi.string(),
					validationOfficerGroupId: joi.string()
				})
				.options({ presence: 'required' })
				.when('authDisabled', requireIf(false))
		})
	})
	.options({ presence: 'required' });

/**
 * @param {*} valueToMatch
 * @returns {import('joi').WhenOptions}
 */
function requireIf(valueToMatch) {
	return {
		is: valueToMatch,
		then: joi.required(),
		otherwise: joi.optional()
	};
}
