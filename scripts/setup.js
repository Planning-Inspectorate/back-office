#!/usr/bin/env node

const SystemService = require('./services/system');
const UserInputService = require('./services/user-input');
const ConfigurationService = require('./services/configuration');
const FileService = require('./services/file');
const LoggerService = require('./services/logger');
const SetupStrategies = require('./utils/setup.strategies');

//TODO: Ask question for HTTPS port
//TODO: Replace HTTP_PORT in AUTH_REDIRECT_URI
//TODO: Remove db ops

/**
 * Setup Command - Single Responsibility: Orchestrate setup process
 * Uses Dependency Injection and Strategy Pattern
 */
class SetupCommand {
	constructor() {
		this.logger = new LoggerService();
		this.dependencies = this._createDependencies();
	}

	_createDependencies() {
		return {
			logger: this.logger,
			systemService: new SystemService(this.logger),
			userInputService: new UserInputService(this.logger),
			configurationService: new ConfigurationService(this.logger),
			fileService: new FileService(this.logger)
		};
	}

	async run() {
		try {
			this.logger.header('PINS Back Office Setup Wizard');

			// Validate system first
			this.logger.section('Checking System Requirements');
			await this.dependencies.systemService.validateSystem();

			// Determine setup strategy
			const strategyType = this._determineStrategy();
			const strategy = SetupStrategies.getStrategy(strategyType, this.dependencies);

			// Execute setup strategy
			this.logger.section(`Running ${strategyType} setup`);
			const result = await strategy.execute();

			// Show completion message
			this._showCompletion(result);
		} catch (error) {
			this.logger.error('Setup failed');
			this.logger.error(error.message);
			process.exit(1);
		} finally {
			this._cleanup();
		}
	}

	_determineStrategy() {
		const args = process.argv.slice(2);

		if (args.includes('--quick')) {
			return SetupStrategies.QUICK;
		} else if (args.includes('--auto')) {
			return SetupStrategies.AUTOMATED;
		} else {
			return SetupStrategies.INTERACTIVE;
		}
	}

	_showCompletion(result) {
		this.logger.success('Setup completed successfully!');
		this.logger.section('Next Steps');
		this.logger.list([
			'Run: npm run doctor (to verify setup)',
			'Run: npm run dev (to start development)',
			`API will be at: http://localhost:${result.api?.port || '3000'}`,
			`Web will be at: http://localhost:${result.web?.port || '8080'}`
		]);

		if (result.database?.password) {
			this.logger.section('Database Info');
			this.logger.info(`Database: pins_development`);
			this.logger.info(`Username: sa`);
			this.logger.info(`Password: ${result.database.password}`);
		}
	}

	_cleanup() {
		if (this.dependencies.userInputService) {
			this.dependencies.userInputService.close();
		}
	}
}

// Run the setup
new SetupCommand().run();
