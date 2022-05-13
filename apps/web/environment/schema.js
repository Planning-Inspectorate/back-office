import joi from 'joi';

export default joi
	.object({
		apiUrl: joi.string().uri(),
		authDisabled: joi.boolean(),
		authRedirectTo: joi.string(),
		bundleAnalyzer: joi.boolean(),
		env: joi.string().valid('development', 'production', 'test'),
		msal: joi
			.object({
				msalClientId: joi.string(),
				msalCloudInstanceId: joi.string(),
				msalTenantId: joi.string(),
				msalClientSecret: joi.string()
			})
			.options({ presence: 'required' })
			.when('authDisabled', requireIf(false)),
		release: joi.boolean(),
		serverProtocol: joi.string().valid('http', 'https'),
		serverPort: joi.number(),
		sslCertificateFile: joi.string().when('serverProtocol', requireIf('https')),
		sslCertificateKeyFile: joi.string().when('serverProtocol', requireIf('https')),
		referencedata: joi.object({
			groups: joi
				.object({
					inspectorGroupId: joi.string(),
					caseOfficeGroupId: joi.string(),
					validationOfficerGroupId: joi.string()
				})
				.options({ presence: 'required' })
				.when('msalEnabled', requireIf(true))
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
