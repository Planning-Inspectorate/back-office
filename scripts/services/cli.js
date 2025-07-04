const DatabaseService = require('./database');
const LoggerService = require('./logger');
const cliConfig = require('../config/cli');

/**
 * CLI Service
 * Handles command line interface
 */
class CLIService {
	constructor() {
		this.logger = new LoggerService();
		this.databaseService = new DatabaseService(this.logger);
		this.config = cliConfig;
		this.commandMap = this.buildCommandMap();
	}

	buildCommandMap() {
		const map = new Map();

		Object.entries(this.config.commands).forEach(([command, config]) => {
			// Add primary command
			map.set(command, config.method);

			// Add alias if exists
			if (config.alias) {
				map.set(config.alias, config.method);
			}
		});

		return map;
	}

	async run() {
		const args = process.argv.slice(2);

		if (args.length === 0) {
			this.showHelp();
			return;
		}

		const command = args[0];
		const methodName = this.commandMap.get(command);

		if (!methodName) {
			this.logger.error(`Unknown command: ${command}`);
			this.showHelp();
			process.exit(1);
		}

		try {
			if (methodName === 'showHelp') {
				this.showHelp();
			} else {
				await this.databaseService[methodName]();
			}
		} catch (error) {
			this.logger.error(`Operation failed: ${error.message}`);
			process.exit(1);
		}
	}

	showHelp() {
		console.log(this.config.helpText);
	}
}

module.exports = CLIService;
