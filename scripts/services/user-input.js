/**
 * User Input Service
 * Handles user interaction
 */
class UserInputService {
	constructor(logger) {
		this.logger = logger;
		this.readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}

	async askForDatabasePassword() {
		this.logger.info('Choose a password for your local SQL Server database:');
		this.logger.info('Requirements: 8+ characters, uppercase, lowercase, digit, special character');
		this.logger.info('Press Enter to use default: d0ck3r_P@ssw0rd!');

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const password = await this.askQuestion('Database password (or Enter for default): ');

			// Use default if empty
			if (!password.trim()) {
				return 'd0ck3r_P@ssw0rd!';
			}

			if (this._validatePassword(password)) {
				const confirm = await this.askQuestion(`Confirm password: `);
				if (password === confirm) {
					return password;
				} else {
					this.logger.error('Passwords do not match. Please try again.');
				}
			} else {
				this.logger.error('Password does not meet requirements. Please try again.');
			}
		}
	}

	async askForPreferences() {
		this.logger.info('Additional configuration (press Enter for defaults):');

		const sessionSecretPrompt = 'Session secret (Enter to auto-generate): ';
		const userSessionSecret = await this.askQuestion(sessionSecretPrompt);

		return {
			apiPort: (await this.askQuestion('API port (3000): ')) || '3000',
			webPort: (await this.askQuestion('Web port (8080): ')) || '8080',
			sessionSecret: userSessionSecret.trim() || null // null will trigger auto-generation
		};
	}

	_validatePassword(password) {
		if (password.length < 8) return false;
		if (!/[A-Z]/.test(password)) return false;
		if (!/[a-z]/.test(password)) return false;
		if (!/[0-9]/.test(password)) return false;
		if (!/[^A-Za-z0-9]/.test(password)) return false;
		return true;
	}

	async askQuestion(question) {
		return new Promise((resolve) => {
			this.readline.question(question, resolve);
		});
	}

	close() {
		this.readline.close();
	}
}

module.exports = UserInputService;
