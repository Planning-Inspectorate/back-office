#!/usr/bin/env node

const CLIService = require('./services/cli');

/**
 * Database Operations CLI Entry Point
 * Lightweight wrapper that delegates to services
 */
async function main() {
	const cli = new CLIService();
	await cli.run();
}

// Run only if called directly
if (require.main === module) {
	main().catch((error) => {
		console.error('Fatal error:', error.message);
		process.exit(1);
	});
}

module.exports = { main };
