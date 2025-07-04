#!/usr/bin/env node

const SystemService = require('./services/system-service');
const UserInputService = require('./services/user-input-service');
const LoggerService = require('./services/logger-service');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Cleanup Command - Reset Development Environment
 */
class CleanupCommand {
	constructor() {
		this.logger = new LoggerService();
		this.systemService = new SystemService(this.logger);
		this.userInputService = new UserInputService(this.logger);
		this.autoConfirm = process.argv.includes('--yes') || process.argv.includes('-y');
	}

	async run() {
		try {
			this.logger.header('PINS Back Office System Cleanup');

			this._showWarning();

			if (!this.autoConfirm) {
				const confirmed = await this._confirmCleanup();
				if (!confirmed) {
					this.logger.info('Cleanup cancelled');
					return;
				}
			} else {
				this.logger.info('Auto-confirmed with --yes flag');
			}

			this.logger.info('Starting cleanup process:');

			// Stop Docker services
			await this._stopDockerServices();

			// Remove environment files
			await this._removeEnvironmentFiles();

			// Clean generated files
			await this._cleanGeneratedFiles();

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

	_showWarning() {
		this.logger.warning('This will completely reset your development environment');
		this.logger.info('What will be removed:');
		this.logger.list([
			'Stop and remove all Docker containers',
			'Remove Docker volumes (database data will be lost)',
			'Delete environment files (.env)',
			'Clean Docker system cache'
		]);
	}

	async _confirmCleanup() {
		const answer = await this.userInputService.askQuestion(
			'Are you sure you want to continue? (yes/no): '
		);
		return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
	}

	async _stopDockerServices() {
		this.logger.info('Stopping Docker services...');

		// Check which containers are actually running
		const runningContainers = this._getRunningPinsContainers();

		if (runningContainers.length === 0) {
			this.logger.info('No PINS containers found running');
		} else {
			this.logger.info(`Found running containers: ${runningContainers.join(', ')}`);

			// Stop each running container
			runningContainers.forEach((container) => {
				try {
					this.logger.info(`Stopping container: ${container}`);
					this._runCommand(`docker stop ${container}`, false);
					this._runCommand(`docker rm ${container}`, false);
					this.logger.success(`Stopped and removed: ${container}`);
				} catch (error) {
					this.logger.error(`Failed to stop ${container}: ${error.message}`);
				}
			});
		}

		// Try docker-compose cleanup (handles both profiles)
		try {
			this.logger.info('Running docker-compose cleanup...');
			this._runCommand('docker-compose --profile default --profile arm64 down -v', false);
			this.logger.success('Docker-compose cleanup completed');
		} catch (error) {
			this.logger.warning('Docker-compose cleanup failed (this is usually fine)');
		}

		// Remove volumes if they exist
		this._removeDockerVolumes();

		// Prune Docker system
		try {
			this.logger.info('Pruning Docker system...');
			this._runCommand('docker system prune -f', true);
			this.logger.success('Docker system pruned');
		} catch (error) {
			this.logger.warning('Docker system prune failed (not critical)');
		}

		// Verify cleanup
		const remainingContainers = this._getRunningPinsContainers();
		if (remainingContainers.length === 0) {
			this.logger.success('All PINS containers stopped successfully');
		} else {
			this.logger.warning(`Some containers still running: ${remainingContainers.join(', ')}`);
		}
	}

	_getRunningPinsContainers() {
		try {
			const output = this._runCommand(
				'docker ps --filter "name=pins_sql" --format "{{.Names}}"',
				true
			);
			return output
				.trim()
				.split('\n')
				.filter((name) => name.length > 0);
		} catch (error) {
			return [];
		}
	}

	_removeDockerVolumes() {
		const volumes = ['sql_data', 'sql_data_arm'];

		volumes.forEach((volume) => {
			try {
				// Check if volume exists first
				const volumeExists = this._runCommand(
					`docker volume ls -q --filter "name=${volume}"`,
					true
				).trim();
				if (volumeExists) {
					this.logger.info(`Removing volume: ${volume}`);
					this._runCommand(`docker volume rm ${volume}`, false);
					this.logger.success(`Removed volume: ${volume}`);
				}
			} catch (error) {
				this.logger.warning(`Could not remove volume ${volume} (might not exist)`);
			}
		});
	}

	async _removeEnvironmentFiles() {
		this.logger.info('Removing environment files...');

		const envFiles = [
			'apps/api/.env',
			'apps/web/.env',
			'apps/functions/applications-command-handlers/local.settings.json'
		];

		envFiles.forEach((file) => {
			try {
				if (fs.existsSync(file)) {
					fs.unlinkSync(file);
					this.logger.success(`Removed: ${file}`);
				}
			} catch (error) {
				this.logger.warning(`Could not remove ${file}: ${error.message}`);
			}
		});
	}

	async _cleanGeneratedFiles() {
		this.logger.info('Cleaning generated files...');

		const filesToClean = ['docker-compose.yml'];

		filesToClean.forEach((file) => {
			try {
				if (fs.existsSync(file)) {
					fs.unlinkSync(file);
					this.logger.success(`Removed: ${file}`);
				}
			} catch (error) {
				this.logger.warning(`Could not remove ${file}: ${error.message}`);
			}
		});
	}

	_runCommand(command, silent = false) {
		try {
			const result = execSync(command, {
				encoding: 'utf8',
				stdio: silent ? 'pipe' : 'inherit'
			});
			return result;
		} catch (error) {
			if (!silent) {
				throw error;
			}
			return '';
		}
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
