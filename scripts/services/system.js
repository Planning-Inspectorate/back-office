const { execSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const semver = require('semver');
const config = require('../config/setup');

/**
 * Unified System Service
 * Handles all system-related operations: detection, validation, setup
 */
class SystemService {
	constructor(logger) {
		this.logger = logger;
		this.platform = this._detectPlatform();
	}

	// PLATFORM DETECTION
	_detectPlatform() {
		const isWindows = process.platform === 'win32';
		const isLinux = process.platform === 'linux';
		const isMac = process.platform === 'darwin';
		const isArm = process.arch === 'arm64';
		const isWSL = this._detectWSL();

		return {
			os: process.platform,
			arch: process.arch,
			isWindows,
			isMac,
			isLinux,
			isArm,
			isWSL,
			nodeVersion: process.version,
			// Docker commands based on platform
			dockerProfile: isArm ? 'arm64' : 'default',
			shellSleep: isWindows ? 'ping 127.0.0.1 -n 10 > nul' : 'sleep 10'
		};
	}

	_detectWSL() {
		if (process.platform !== 'linux') return false;
		try {
			return (
				process.env.WSL_DISTRO_NAME !== undefined ||
				(fs.existsSync('/proc/version') &&
					fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft'))
			);
		} catch {
			return false;
		}
	}

	getPlatform() {
		return this.platform;
	}

	// SYSTEM VALIDATION
	async validateSystem(skipPortCheck = false) {
		const checks = [
			{ name: 'Node.js Version', check: () => this.checkNodeVersion() },
			{ name: 'Docker', check: () => this.checkDocker() },
			{ name: 'Docker Compose', check: () => this.checkDockerCompose() }
		];

		if (!skipPortCheck) {
			checks.push({ name: 'Required Ports', check: () => this._checkPorts() });
		}

		for (const { name, check } of checks) {
			try {
				const result = await check();
				this.logger.success(`${name}: ${result.message || 'OK'}`);
			} catch (error) {
				this.logger.error(`${name}: ${error.message}`);
				throw new Error(`System validation failed: ${name} - ${error.message}`);
			}
		}
	}

	async checkNodeVersion() {
		const current = process.version;
		const required = config.validation.nodeMinVersion;

		if (!semver.gte(current, required)) {
			throw new Error(`Node.js ${required}+ required, found ${current}`);
		}

		return { message: current };
	}

	async checkDocker() {
		try {
			const version = this._runCommand('docker --version', true);
			this._runCommand('docker info', true);
			return { message: version.trim() };
		} catch {
			throw new Error('Docker not running. Start Docker Desktop');
		}
	}

	async checkDockerCompose() {
		try {
			const version = this._runCommand('docker-compose --version', true);
			return { message: version.trim() };
		} catch {
			throw new Error('Docker Compose not available');
		}
	}

	async _checkPorts() {
		const busyPorts = [];
		for (const port of config.validation.requiredPorts) {
			if (await this._isPortBusy(port)) {
				busyPorts.push(port);
			}
		}

		if (busyPorts.length > 0) {
			throw new Error(`Ports in use: ${busyPorts.join(', ')}`);
		}

		return { message: 'All ports available' };
	}

	async _isPortBusy(port) {
		return new Promise((resolve) => {
			const server = net.createServer();
			server.listen(port, () => {
				server.once('close', () => resolve(false));
				server.close();
			});
			server.on('error', () => resolve(true));
		});
	}

	// DATABASE SETUP
	async setupDatabase() {
		this.logger.info('Starting database container...');
		this._startDatabase();

		this.logger.info('Waiting for database to be ready...');
		await this._waitForDatabase();

		this.logger.info('Creating database...');
		this._createDatabase();

		this.logger.info('Running database migrations...');
		this._runMigrations();

		this.logger.info('Adding seed data...');
		this._runSeeds();
	}

	_startDatabase() {
		const profile = this.platform.dockerProfile;
		const service = this.platform.isArm ? 'database-arm' : 'database';

		this._runCommand(`docker-compose --profile ${profile} up -d ${service}`);
	}

	async _waitForDatabase() {
		const maxAttempts = 30;
		const delay = 2000;

		for (let i = 0; i < maxAttempts; i++) {
			try {
				if (this.platform.isArm) {
					// ARM64: Check if container is running
					this._runCommand('docker-compose --profile arm64 ps database-arm', true);
					// Give ARM systems more time to fully initialize
					if (i >= 10) {
						await new Promise((resolve) => setTimeout(resolve, 3000));
						break;
					}
				} else {
					// x64: Check health status
					const result = this._runCommand('docker-compose --profile default ps database', true);
					if (result.includes('healthy') || result.includes('Up')) {
						break;
					}
				}
			} catch {
				process.stdout.write('.');
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		// Extra wait for database to be fully ready
		this._runCommand(this.platform.shellSleep, true);
		this.logger.success('Database is ready');
	}

	_createDatabase() {
		const profile = this.platform.dockerProfile;
		const service = this.platform.isArm ? 'db-create-arm' : 'db-create';

		this._runCommand(`docker-compose --profile ${profile} run --rm ${service}`);
	}

	_runMigrations() {
		this._runCommand(`npm run db:migrate --workspace=${config.apps.api.workspace}`);
	}

	_runSeeds() {
		this._runCommand(`npm run db:seed --workspace=${config.apps.api.workspace}`);
	}

	// HEALTH CHECK - Fixed Windows compatibility
	async checkHealth() {
		return {
			platform: this.platform,
			environment: this._checkEnvFiles(),
			database: await this._checkDatabaseHealth(),
			services: this._checkServices()
		};
	}

	_checkEnvFiles() {
		const requiredFiles = ['apps/api/.env', 'apps/web/.env'];
		return requiredFiles.map((file) => ({
			file,
			exists: fs.existsSync(file)
		}));
	}

	async _checkDatabaseHealth() {
		try {
			// Check for our specific PINS containers by exact name
			const standardCheck = await this._checkPinsContainer('pins_sql_server', 'standard');
			if (standardCheck.running) {
				return {
					status: 'running',
					type: 'standard',
					accessible: standardCheck.accessible
				};
			}

			const armCheck = await this._checkPinsContainer('pins_sql_server_arm', 'arm64');
			if (armCheck.running) {
				return {
					status: 'running',
					type: 'arm64',
					accessible: armCheck.accessible
				};
			}

			return { status: 'stopped' };
		} catch (error) {
			return { status: 'stopped', error: error.message };
		}
	}

	async _checkPinsContainer(containerName, type) {
		try {
			// Step 1: Check if our specific container is running
			const psResult = this._runCommand(
				`docker ps --filter "name=^${containerName}$" --format "{{.Names}}"`,
				true
			);

			if (psResult.trim() !== containerName) {
				return { running: false, accessible: false };
			}

			// Step 2: Test if database is actually accessible
			let accessible = false;

			if (type === 'standard') {
				try {
					// Quick connection test with timeout
					this._runCommand(
						`docker exec ${containerName} timeout 5 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'd0ck3r_P@ssw0rd!' -Q "SELECT 1" -h -1`,
						true
					);
					accessible = true;
				} catch {
					accessible = false;
				}
			} else if (type === 'arm64') {
				try {
					// For ARM, just check if container is responding
					this._runCommand(
						`docker exec ${containerName} timeout 3 sh -c "echo 'test' > /dev/null"`,
						true
					);
					accessible = true;
				} catch {
					accessible = false;
				}
			}

			return { running: true, accessible };
		} catch (error) {
			return { running: false, accessible: false };
		}
	}

	_checkServices() {
		const services = [
			{ name: 'Docker', command: 'docker --version' },
			{ name: 'Docker Compose', command: 'docker-compose --version' }
		];

		return services.map(({ name, command }) => {
			try {
				this._runCommand(command, true);
				return { service: name, status: 'available' };
			} catch {
				return { service: name, status: 'unavailable' };
			}
		});
	}

	// UTILITY METHODS
	_runCommand(command, silent = false) {
		try {
			const result = execSync(command, {
				encoding: 'utf8',
				stdio: silent ? 'pipe' : 'inherit'
			});
			return result;
		} catch (error) {
			if (silent) {
				throw error;
			} else {
				throw new Error(`Command failed: ${command}`);
			}
		}
	}

	// CLEANUP OPERATIONS
	async cleanup() {
		this.logger.info('Stopping all services...');
		try {
			this._runCommand('docker-compose --profile default --profile arm64 down -v', true);
		} catch {
			// Ignore errors during cleanup
		}

		this.logger.info('Pruning Docker system...');
		try {
			this._runCommand('docker system prune -f', true);
		} catch {
			// Ignore errors during cleanup
		}

		this.logger.success('Cleanup completed');
	}
}

module.exports = SystemService;
