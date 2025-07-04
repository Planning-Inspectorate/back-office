#!/usr/bin/env node

const SystemService = require('./services/system');
const LoggerService = require('./services/logger');

/**
 * Doctor Command - System Health Check
 * Diagnose system health
 */
class DoctorCommand {
	constructor() {
		this.logger = new LoggerService();
		this.systemService = new SystemService(this.logger);
	}

	async run() {
		let hasErrors = false;

		try {
			this.logger.header('PINS Back Office System Doctor');

			// Check basic system requirements
			await this._checkSystemRequirements();

			// Check application health
			hasErrors = await this._checkApplicationHealth();

			if (hasErrors) {
				this.logger.error('System issues detected');
				this.logger.section('Recommended Actions');
				this.logger.list([
					'Run: npm run setup (to fix environment and database)',
					'Run: npm run cleanup && npm run setup (for clean setup)'
				]);
				process.exit(1);
			} else {
				this.logger.success('All systems operational');
				this._showUsageInstructions();
			}
		} catch (error) {
			this.logger.error('Critical system issues detected');
			this.logger.error(error.message);
			this.logger.section('Recommended Actions');
			this.logger.list([
				'Install missing dependencies',
				'Start Docker Desktop',
				'Check system requirements in README.md'
			]);
			process.exit(1);
		}
	}

	async _checkSystemRequirements() {
		// Platform Information
		const platform = this.systemService.getPlatform();
		this.logger.section('Platform Information');
		this.logger.table([
			{ key: 'Operating System', value: platform.os, status: 'info' },
			{ key: 'Architecture', value: platform.arch, status: 'info' },
			{ key: 'Node.js Version', value: platform.nodeVersion, status: 'info' },
			{ key: 'WSL', value: platform.isWSL ? 'Yes' : 'No', status: 'info' },
			{ key: 'ARM64', value: platform.isArm ? 'Yes' : 'No', status: 'info' }
		]);

		// System Validation - Skip port check since we want to check service health instead
		this.logger.section('System Requirements');
		await this.systemService.validateSystem(true); // true = skip port check
	}

	async _checkApplicationHealth() {
		let hasErrors = false;

		this.logger.section('Application Status');
		const health = await this.systemService.checkHealth();

		// Check Environment Files
		health.environment.forEach(({ file, exists }) => {
			this.logger.table([
				{
					key: file,
					value: exists ? 'Found' : 'Missing',
					status: exists ? 'pass' : 'fail'
				}
			]);

			if (!exists) {
				hasErrors = true;
			}
		});

		// Check Database Status
		const dbRunning = health.database.status === 'running';
		this.logger.table([
			{
				key: 'Database',
				value: dbRunning ? `Running (${health.database.type}) on port 1433` : 'Stopped',
				status: dbRunning ? 'pass' : 'fail'
			}
		]);

		if (!dbRunning) {
			hasErrors = true;
		}

		// Check Services
		health.services.forEach(({ service, status }) => {
			this.logger.table([
				{
					key: service,
					value: status === 'available' ? 'Available' : 'Not Available',
					status: status === 'available' ? 'pass' : 'info'
				}
			]);
		});

		return hasErrors;
	}

	_showUsageInstructions() {
		this.logger.section('Ready to Develop');
		this.logger.list(['Start development: npm run dev']);

		this.logger.section('Useful Commands');
		this.logger.list([
			'npm run api        - Start API only',
			'npm run web        - Start Web only',
			'npm run db:logs    - View database logs',
			'npm run db:stop    - Stop database',
			'npm run cleanup    - Clean reset'
		]);
	}
}

// Run the doctor
new DoctorCommand().run();
