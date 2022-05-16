import joi from 'joi';

export default joi
	.object({
		apiUrl: joi.string().uri(),
		authDisabled: joi.boolean(),
		authRedirectTo: joi.string(),
		bundleAnalyzer: joi.boolean(),
		env: joi.string().valid('development', 'production', 'test'),
		isRelease: joi.boolean().optional(),
		msal: joi
			.object({
				clientId: joi.string(),
				clientSecret: joi.string(),
				cloudInstanceId: joi.string(),
				tenantId: joi.string()
			})
			.options({ presence: 'required' })
			.when('authDisabled', requireIf(false)),
		serverProtocol: joi.string().valid('http', 'https'),
		serverPort: joi.number(),
		sslCertificateFile: joi.string().when('serverProtocol', requireIf('https')),
		sslCertificateKeyFile: joi.string().when('serverProtocol', requireIf('https')),
		referencedata: joi.object({
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
