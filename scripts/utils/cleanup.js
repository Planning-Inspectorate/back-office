#!/usr/bin/env node

const SystemService = require('../services/system');
const UserInputService = require('../services/user-input');
const LoggerService = require('../services/logger');
const fs = require('fs');

/**
 * Cleanup Command - Complete System Reset
 * Cleans and resets the development environment
 */
class CleanupCommand {
	constructor() {
		this.logger = new LoggerService();
		this.systemService = new SystemService(this.logger);
		this.userInputService = new UserInputService(this.logger);
		this.forceYes = this._checkForceFlag();
	}

	async run() {
		try {
			this.logger.header('PINS Back Office System Cleanup');

			this._showWarning();

			// Ask for confirmation unless --yes flag is provided
			if (!this.forceYes) {
				const confirmed = await this._askForConfirmation();
				if (!confirmed) {
					this.logger.info('Cleanup cancelled');
					return;
				}
			} else {
				this.logger.info('Auto-confirmed with --yes flag');
			}

			// Perform cleanup
			await this._performCleanup();

			this.logger.success('Cleanup completed successfully');
			this._showNextSteps();
		} catch (error) {
			this.logger.error('Cleanup failed');
			this.logger.error(error.message);
			process.exit(1);
		} finally {
			if (this.userInputService) {
				this.userInputService.close();
			}
		}
	}

	_checkForceFlag() {
		const args = process.argv.slice(2);
		return args.includes('--yes') || args.includes('--y') || args.includes('-y');
	}

	_showWarning() {
		this.logger.warning('This will completely reset your development environment');
		this.logger.section('What will be removed');
		this.logger.list([
			'Stop and remove all Docker containers',
			'Remove Docker volumes (database data will be lost)',
			'Delete environment files (.env)',
			'Clean Docker system cache'
		]);
	}

	async _askForConfirmation() {
		const answer = await this.userInputService.askQuestion(
			'\nAre you sure you want to proceed? This will delete all local data (yes/no): '
		);

		const normalizedAnswer = answer.toLowerCase().trim();

		if (normalizedAnswer === 'yes' || normalizedAnswer === 'y') {
			return true;
		} else if (normalizedAnswer === 'no' || normalizedAnswer === 'n') {
			return false;
		} else {
			this.logger.warning('Please answer "yes" or "no"');
			return await this._askForConfirmation();
		}
	}

	async _performCleanup() {
		this.logger.section('Starting cleanup process');

		// Stop and remove containers
		this.logger.info('Stopping Docker services...');
		await this.systemService.cleanup();

		// Remove environment files
		this.logger.info('Removing environment files...');
		this._removeEnvFiles();

		// Remove generated files
		this.logger.info('Cleaning generated files...');
		this._removeGeneratedFiles();
	}

	_removeEnvFiles() {
		const envFiles = ['apps/api/.env', 'apps/web/.env'];

		envFiles.forEach((file) => {
			if (fs.existsSync(file)) {
				fs.unlinkSync(file);
				this.logger.success(`Removed: ${file}`);
			}
		});
	}

	_removeGeneratedFiles() {
		const generatedFiles = ['docker-compose.yml'];

		generatedFiles.forEach((file) => {
			if (fs.existsSync(file)) {
				const content = fs.readFileSync(file, 'utf8');
				if (content.includes('pins_sql_server')) {
					fs.unlinkSync(file);
					this.logger.success(`Removed: ${file}`);
				}
			}
		});
	}

	_showNextSteps() {
		this.logger.section('Next Steps');
		this.logger.list([
			'Run: npm run setup (to recreate environment)',
			'Run: npm run doctor (to verify clean state)'
		]);
	}
}

// Run the cleanup
new CleanupCommand().run();
