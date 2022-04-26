export const authConfig = {
	auth: {
		sso: {
			clientId: process.env.AUTH_CLIENT_ID,
			cloudInstanceId: process.env.AUTH_CLOUD_INSTANCE_ID,
			tenantId: process.env.AUTH_TENANT_ID,
			clientSecret: process.env.AUTH_CLIENT_SECRET,
		},
		redirectUri: process.env.AUTH_REDIRECT_URI || '/auth/redirect',
		inspectorGroupID: process.env.AUTH_INSPECTOR_GROUP_ID || '',
		caseOfficerGroupID: process.env.AUTH_CASEOFFICER_GROUP_ID || '',
		validationOfficerGroupID: process.env.AUTH_VALIDATIONOFFICER_GROUP_ID || ''
	}
};
