const { DockerTemplates, EnvironmentTemplates } = require('../templates/docker');
const RandomService = require('./random');

/**
 * Configuration Service
 * Generates configurations for updates (not complete files)
 */
class ConfigurationService {
	constructor(logger) {
		this.logger = logger;
		this.envTemplates = new EnvironmentTemplates();
		this.dockerTemplates = new DockerTemplates();
	}

	generateConfiguration(userInput) {
		// Generate session secret if not provided or if it's the placeholder
		let sessionSecret = userInput.sessionSecret;
		if (
			!sessionSecret ||
			sessionSecret === 'SomeSecretHere' ||
			sessionSecret === 'GENERATED_RANDOM_SECRET'
		) {
			sessionSecret = RandomService.generateSessionSecret();
			this.logger.info(`Generated secure session secret: ${sessionSecret.substring(0, 8)}...`);
		}

		return {
			database: {
				password: userInput.dbPassword,
				name: 'pins_development'
			},
			api: {
				port: userInput.apiPort
			},
			web: {
				port: userInput.webPort,
				sessionSecret: sessionSecret
			}
		};
	}

	generateDockerCompose(config) {
		return this.dockerTemplates.generateCompose(config);
	}

	/**
	 * Generate ALL values that need to be updated in .env files
	 */
	generateEnvironmentUpdates(config) {
		return {
			api: this.envTemplates.generateApiUpdates(config),
			web: this.envTemplates.generateWebUpdates(config)
		};
	}
}

module.exports = ConfigurationService;
