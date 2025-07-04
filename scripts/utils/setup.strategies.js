/**
 * Setup Strategies
 */
class SetupStrategies {
	static INTERACTIVE = 'interactive';
	static AUTOMATED = 'automated';
	static QUICK = 'quick';

	static getStrategy(type, dependencies) {
		switch (type) {
			case this.INTERACTIVE:
				return new InteractiveSetupStrategy(dependencies);
			case this.AUTOMATED:
				return new AutomatedSetupStrategy(dependencies);
			case this.QUICK:
				return new QuickSetupStrategy(dependencies);
			default:
				throw new Error(`Unknown setup strategy: ${type}`);
		}
	}
}

class InteractiveSetupStrategy {
	constructor({ userInputService, configurationService, fileService, systemService, logger }) {
		this.userInputService = userInputService;
		this.configurationService = configurationService;
		this.fileService = fileService;
		this.systemService = systemService;
		this.logger = logger;
	}

	async execute() {
		// Get user input
		const dbPassword = await this.userInputService.askForDatabasePassword();
		const preferences = await this.userInputService.askForPreferences();

		// Generate configuration
		const config = this.configurationService.generateConfiguration({
			dbPassword,
			...preferences
		});

		// Create Docker Compose
		const dockerCompose = this.configurationService.generateDockerCompose(config);
		this.fileService.writeDockerCompose(dockerCompose);

		// Create environment files by copying examples and updating values
		const envUpdates = this.configurationService.generateEnvironmentUpdates(config);

		this.fileService.createEnvironmentFile('apps/api', envUpdates.api);
		this.fileService.createEnvironmentFile('apps/web', envUpdates.web);

		// Setup database
		await this.systemService.setupDatabase();

		return config;
	}
}

class AutomatedSetupStrategy {
	constructor({ configurationService, fileService, systemService, logger }) {
		this.configurationService = configurationService;
		this.fileService = fileService;
		this.systemService = systemService;
		this.logger = logger;
	}

	async execute() {
		// Use configuration with auto-generated session secret
		const config = this.configurationService.generateConfiguration({
			dbPassword: 'd0ck3r_P@ssw0rd!',
			apiPort: '3000',
			webPort: '8080',
			sessionSecret: null
		});

		// Create Docker Compose
		const dockerCompose = this.configurationService.generateDockerCompose(config);
		this.fileService.writeDockerCompose(dockerCompose);

		// Create environment files by copying examples and updating values
		const envUpdates = this.configurationService.generateEnvironmentUpdates(config);

		this.fileService.createEnvironmentFile('apps/api', envUpdates.api);
		this.fileService.createEnvironmentFile('apps/web', envUpdates.web);

		// Setup database
		await this.systemService.setupDatabase();

		return config;
	}
}

class QuickSetupStrategy {
	constructor({ fileService, systemService, logger }) {
		this.fileService = fileService;
		this.systemService = systemService;
		this.logger = logger;
	}

	async execute() {
		// Copy .env.example files and update database password to match docker-compose.yml
		this.fileService.createEnvironmentFile('apps/api', {
			DATABASE_URL:
				'"sqlserver://127.0.0.1:1433;database=pins_development;user=sa;password=d0ck3r_P@ssw0rd!;trustServerCertificate=true"'
		});

		this.fileService.createEnvironmentFile('apps/web');

		// Setup database using existing docker-compose.yml
		await this.systemService.setupDatabase();

		return { strategy: 'quick' };
	}
}

module.exports = SetupStrategies;
