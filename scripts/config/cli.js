/**
 * CLI Configuration
 * Command mappings and help text
 */
module.exports = {
	commands: {
		start: {
			method: 'start',
			alias: 's',
			description: 'Start the database'
		},
		stop: {
			method: 'stop',
			alias: 'x',
			description: 'Stop the database'
		},
		status: {
			method: 'status',
			alias: 'st',
			description: 'Show database status'
		},
		logs: {
			method: 'logs',
			alias: 'l',
			description: 'Show database logs'
		},
		shell: {
			method: 'shell',
			alias: 'sh',
			description: 'Open database shell'
		},
		cleanup: {
			method: 'cleanup',
			alias: 'c',
			description: 'Clean up database containers'
		},
		reset: {
			method: 'reset',
			alias: 'r',
			description: 'Reset database (stop + cleanup + setup)'
		},
		help: {
			method: 'showHelp',
			alias: 'h',
			description: 'Show this help'
		}
	},

	helpText: `
PINS Back Office Database CLI

Usage: npm run db:ops <command>

Commands:
  start, s      Start the database
  stop, x       Stop the database
  status, st    Show database status
  logs, l       Show database logs
  shell, sh     Open database shell
  cleanup, c    Clean up database containers
  reset, r      Reset database (stop + cleanup + setup)
  help, h       Show this help

Examples:
  npm run db:ops start
  npm run db:ops status
  npm run db:ops shell
`
};
