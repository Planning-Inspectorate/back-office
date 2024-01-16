import { migrateExamTimetables } from './src/exam-timetable-migration.js';

// @ts-ignore
migrateExamTimetables(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	[]
);
