import { migrationNsipProjects } from './src/nsip-project-migration.js';

// @ts-ignore
migrationNsipProjects(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);
