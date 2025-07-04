const SystemService = require('./system');
const LoggerService = require('./logger');
const dbConfig = require('../config/database');

/**
 * Database Service
 * Handles all database operations
 */
class DatabaseService {
	constructor(logger = null, systemService = null) {
		this.logger = logger || new LoggerService();
		this.systemService = systemService || new SystemService(this.logger);
		this.platform = this.systemService.getPlatform();
		this.config = dbConfig;
	}

	/**
	 * Starts database based on platform
	 */
	async start() {
		try {
			const platformType = this.platform.isArm ? 'arm64' : 'standard';
			this.logger.info(`Starting database for ${this.platform.isArm ? 'ARM64' : 'x64'}...`);

			const command = this.config.commands.start[platformType];
			this.systemService._runCommand(command);

			this.logger.success('Database started successfully!');
			this.logger.info('Use "npm run db:status" to check status');
		} catch (error) {
			this.logger.error('Failed to start database');
			throw error;
		}
	}

	/**
	 * Stops database (universal)
	 */
	async stop() {
		try {
			this.logger.info('Stopping database...');

			const command = this.config.commands.stop.universal;
			this.systemService._runCommand(command);

			this.logger.success('Database stopped successfully!');
		} catch (error) {
			this.logger.error('Failed to stop database');
			throw error;
		}
	}

	/**
	 * Shows database logs
	 */
	async logs() {
		try {
			this.logger.info('Showing database logs (Ctrl+C to exit)...');

			const command = this.config.commands.logs.universal;
			this.systemService._runCommand(command);
		} catch (error) {
			this.logger.error('Failed to show database logs');
			throw error;
		}
	}

	/**
	 * Opens database shell (platform-aware)
	 */
	async shell() {
		try {
			// Check if database is running
			const isRunning = await this.isDatabaseRunning();
			if (!isRunning) {
				this.logger.error('Database is not running. Start it first with: npm run db:start');
				return;
			}

			const platformType = this.platform.isArm ? 'arm64' : 'standard';
			this.logger.info(`Opening database shell for ${this.platform.isArm ? 'ARM64' : 'x64'}...`);
			this.logger.info('Type "exit" to close the shell');

			const command = this.config.commands.shell[platformType];
			this.systemService._runCommand(command, false);
		} catch (error) {
			this.logger.error('Failed to open database shell');
			this.logger.info('Make sure the database is running: npm run db:start');
			throw error;
		}
	}

	/**
	 * Cleans up old database containers and volumes
	 */
	async cleanup() {
		try {
			this.logger.info('Cleaning up old database containers...');

			// Get list of containers to be removed
			const containers = await this.getContainersList();

			if (containers.length === 0) {
				this.logger.info('No PINS database containers found to cleanup');
				return;
			}

			// Show what will be removed
			this.logger.info(`Found containers to remove: ${containers.join(', ')}`);

			// Remove containers
			await this.removeContainers();
			this.logger.success(`Cleaned up ${containers.length} container(s)`);

			// Cleanup volumes
			await this.cleanupVolumes();
		} catch (error) {
			this.logger.error('Failed to cleanup database containers');
			throw error;
		}
	}

	/**
	 * Shows database status
	 */
	async status() {
		try {
			this.logger.info('Database Status:');

			// Show running containers
			const command = this.config.commands.status.containers;
			this.systemService._runCommand(command);

			// Show health check
			await this.showHealthStatus();
		} catch (error) {
			this.logger.error('Failed to check database status');
			throw error;
		}
	}

	/**
	 * Resets database (stop + cleanup + setup)
	 */
	async reset() {
		try {
			this.logger.info('Resetting database (stop + cleanup + setup)...');

			await this.stop();
			await this.cleanup();

			// Run setup
			this.systemService._runCommand('npm run setup');

			this.logger.success('Database reset completed!');
		} catch (error) {
			this.logger.error('Failed to reset database');
			throw error;
		}
	}

	// Private helper methods
	async isDatabaseRunning() {
		try {
			const health = await this.systemService.checkHealth();
			return health.database.status === 'running';
		} catch {
			return false;
		}
	}

	async getContainersList() {
		try {
			const result = this.systemService._runCommand(this.config.commands.status.list, true);
			return result.trim()
				? result
						.trim()
						.split('\n')
						.filter((name) => name.trim())
				: [];
		} catch {
			return [];
		}
	}

	async removeContainers() {
		const command = this.platform.isWindows
			? this.config.commands.cleanup.containers.windows
			: this.config.commands.cleanup.containers.unix;

		this.systemService._runCommand(command);
	}

	async cleanupVolumes() {
		try {
			this.logger.info('Cleaning up database volumes...');
			this.systemService._runCommand(this.config.commands.cleanup.volumes, true);
			this.logger.success('Database volumes cleaned up');
		} catch {
			this.logger.info('No volumes found to cleanup');
		}
	}

	async showHealthStatus() {
		try {
			const health = await this.systemService.checkHealth();

			this.logger.section('Health Check');
			this.logger.table([
				{
					key: 'Database',
					value:
						health.database.status === 'running' ? `Running (${health.database.type})` : 'Stopped',
					status: health.database.status === 'running' ? 'pass' : 'fail'
				}
			]);
		} catch (error) {
			this.logger.warning('Could not perform health check');
		}
	}
}

module.exports = DatabaseService;
