/**
 * Environment Templates
 * Generates the values that need to be updated
 */
class EnvironmentTemplates {
	/**
	 * Generate the API values that need updating
	 */
	generateApiUpdates(config) {
		return {
			DATABASE_URL: `"sqlserver://127.0.0.1:1433;database=${config.database.name};user=sa;password=${config.database.password};trustServerCertificate=true"`
		};
	}

	/**
	 * Generate the Web values that need updating
	 */
	generateWebUpdates(config) {
		return {
			API_HOST: `http://localhost:${config.api.port}`,
			HTTP_PORT: config.web.port,
			SESSION_SECRET: config.web.sessionSecret
		};
	}
}

module.exports = EnvironmentTemplates;
