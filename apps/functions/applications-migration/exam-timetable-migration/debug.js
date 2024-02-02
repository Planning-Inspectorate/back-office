import { migrateExamTimetables } from './src/exam-timetable-migration.js';

/**
 * CONFIG
 * SYNAPSE_SQL_HOST=pins-synw-odw-dev-uks-ondemand.sql.azuresynapse.net
 */

// @ts-ignore
migrateExamTimetables(
	// @ts-ignore
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['BC010014']
);
