const kleur = require('kleur');

/**
 * Centralized Logging Service
 * Handles all console output formatting
 */
class LoggerService {
	constructor(options = {}) {
		this.silent = options.silent || false;
		this.prefix = options.prefix || '';
	}

	info(message) {
		if (!this.silent) {
			console.log(kleur.blue(`[INFO] ${this.prefix}${message}`));
		}
	}

	success(message) {
		if (!this.silent) {
			console.log(kleur.green(`[SUCCESS] ${this.prefix}${message}`));
		}
	}

	warning(message) {
		if (!this.silent) {
			console.log(kleur.yellow(`[WARNING] ${this.prefix}${message}`));
		}
	}

	error(message) {
		if (!this.silent) {
			console.log(kleur.red(`[ERROR] ${this.prefix}${message}`));
		}
	}

	debug(message) {
		if (!this.silent && process.env.DEBUG) {
			console.log(kleur.gray(`[DEBUG] ${this.prefix}${message}`));
		}
	}

	header(title) {
		if (!this.silent) {
			console.log(kleur.bold().blue(`\n${title}`));
			console.log(kleur.blue('='.repeat(title.length)));
		}
	}

	section(title) {
		if (!this.silent) {
			console.log(kleur.bold(`\n${title}:`));
		}
	}

	list(items) {
		if (!this.silent) {
			items.forEach((item) => {
				console.log(`  ${kleur.gray('-')} ${item}`);
			});
		}
	}

	table(data) {
		if (!this.silent) {
			data.forEach(({ key, value, status }) => {
				const statusColor =
					status === 'pass' ? kleur.green : status === 'fail' ? kleur.red : kleur.yellow;
				console.log(`  ${key.padEnd(20)} ${statusColor(value)}`);
			});
		}
	}
}

module.exports = LoggerService;
