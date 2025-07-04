module.exports = {
	database: {
		name: 'pins_development',
		port: 1433,
		password: 'd0ck3r_P@ssw0rd!',
		healthTimeout: 60000
	},

	apps: {
		api: { port: 3000, workspace: '@pins/applications.api' },
		web: { port: 8080, workspace: '@pins/applications.web' }
	},

	validation: {
		nodeMinVersion: '20.0.0',
		requiredPorts: [1433, 3000, 8080],
		requiredCommands: ['docker', 'docker-compose']
	},

	environment: {
		api: {
			NODE_ENV: 'development',
			PORT: '3000',
			DATABASE_URL:
				'"sqlserver://127.0.0.1:1433;database=pins_development;user=sa;password=d0ck3r_P@ssw0rd!;trustServerCertificate=true"',
			AUTH_DISABLED: 'true',
			VIRUS_SCANNING_DISABLED: 'true',
			STATIC_FEATURE_FLAGS_ENABLED: 'false',
			APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID: 'applications_case_admin_officer',
			APPLICATIONS_CASETEAM_GROUP_ID: 'applications_case_officer',
			APPLICATIONS_INSPECTOR_GROUP_ID: 'applications_inspector',
			AZURE_BLOB_STORE_HOST: '"http://127.0.0.1:10000/devstoreaccount1"',
			PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING: '"azure-connection-string"',
			RETRY_MAX_ATTEMPTS: '3',
			RETRY_STATUS_CODES: '"500,501,502"'
		},
		web: {
			AUTH_DISABLED: 'true',
			AUTH_DISABLED_GROUP_IDS: '*',
			API_HOST: 'http://localhost:3000',
			HTTP_PORT: '8080',
			DUMMY_USER_DATA: 'false',
			STATIC_FEATURE_FLAGS_ENABLED: 'false',
			AUTH_CLIENT_ID: '"auth-client-id"',
			AUTH_TENANT_ID: '"auth-tenant-id"',
			AUTH_REDIRECT_URI: '"http://localhost:8080/auth/callback"',
			AUTH_CLIENT_SECRET: '"auth-client-secret"',
			AUTH_CLOUD_INSTANCE_ID: '"auth-cloud-instance"',
			APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID: 'applications_case_admin_officer',
			APPLICATIONS_CASETEAM_GROUP_ID: 'applications_case_officer',
			APPLICATIONS_INSPECTOR_GROUP_ID: 'applications_inspector',
			SSL_CERT_FILE: '"ssl-cert-file"',
			SSL_KEY_FILE: '"ssl-key-file"',
			OS_PLACES_API_KEY: '"os-places-api-key"',
			SESSION_SECRET: 'SomeSecretHere',
			SAS_TOKEN: '"sas-token"',
			AZURE_BLOB_STORE_HOST: '"http://127.0.0.1:10000/devstoreaccount1"',
			AZURE_BLOB_STORE_ACCOUNT_NAME: '"blob-store-account-name"',
			AZURE_BLOB_STORE_ACCOUNT_KEY: '"blob-store-account-key"',
			PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING: '"azure-connection-string"',
			RETRY_MAX_ATTEMPTS: '3',
			RETRY_STATUS_CODES: '"500,501,502"'
		}
	}
};
