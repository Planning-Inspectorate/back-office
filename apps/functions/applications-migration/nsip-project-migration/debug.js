import { migrateNsipProjects } from '../common/migrators/nsip-project-migration.js';

// @ts-ignore
migrateNsipProjects(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['EN010049']
);
