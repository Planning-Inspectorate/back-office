const fs = require('fs');
const path = require('path');

/**
 * File Service
 * Handles file operations
 */
class FileService {
	constructor(logger) {
		this.logger = logger;
	}

	writeDockerCompose(content) {
		fs.writeFileSync('docker-compose.yml', content);
		this.logger.success('Docker Compose file created');
	}

	/**
	 * Create environment file from updates (alias for updateEnvironmentFile)
	 */
	createEnvironmentFile(filePath, updates) {
		return this.updateEnvironmentFile(filePath, updates);
	}

	/**
	 * Update .env file by replacing specific values
	 * Handles both 'apps/api' and 'apps/api/.env' formats
	 */
	updateEnvironmentFile(filePath, updates) {
		// Normalize the file path
		let targetPath = filePath;
		let examplePath;

		if (filePath.endsWith('.env')) {
			// Full path provided: apps/api/.env
			examplePath = filePath + '.example';
		} else {
			// Directory path provided: apps/api
			targetPath = path.join(filePath, '.env');
			examplePath = path.join(filePath, '.env.example');
		}

		// Start with the example file
		if (!fs.existsSync(examplePath)) {
			throw new Error(`Template file not found: ${examplePath}`);
		}

		let content = fs.readFileSync(examplePath, 'utf8');

		// Update each configuration value
		Object.entries(updates).forEach(([key, value]) => {
			// Handle different value formats
			let formattedValue = value;
			if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
				// Keep quoted values as-is
				formattedValue = value;
			} else if (typeof value === 'string' && (value === 'true' || value === 'false')) {
				// Boolean strings without quotes
				formattedValue = value;
			} else if (typeof value === 'string') {
				// Regular strings without quotes
				formattedValue = value;
			}

			// Replace the line if it exists, or add it
			const regex = new RegExp(`^${key}=.*$`, 'm');
			if (regex.test(content)) {
				content = content.replace(regex, `${key}=${formattedValue}`);
			} else {
				content += `\n${key}=${formattedValue}`;
			}
		});

		// Ensure directory exists
		const dir = path.dirname(targetPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		fs.writeFileSync(targetPath, content);
		this.logger.success(`Environment file updated: ${targetPath}`);
	}

	/**
	 * Write complete environment file from config object
	 */
	writeEnvironmentFile(filePath, config) {
		// Normalize the file path
		let targetPath = filePath;
		if (!filePath.endsWith('.env')) {
			targetPath = path.join(filePath, '.env');
		}

		const envContent = Object.entries(config)
			.map(([key, value]) => `${key}=${value}`)
			.join('\n');

		// Ensure directory exists
		const dir = path.dirname(targetPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		fs.writeFileSync(targetPath, envContent + '\n');
		this.logger.success(`Environment file created: ${targetPath}`);
	}

	copyTemplate(source, destination) {
		if (fs.existsSync(source)) {
			fs.copyFileSync(source, destination);
			return true;
		}
		return false;
	}
}

module.exports = FileService;
