import { migrateServiceUsers } from './src/service-user-migration.js';

// @ts-ignore
await migrateServiceUsers(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);
