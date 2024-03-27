import { migrateFolder } from './src/folder-migration.js';

// @ts-ignore
await migrateFolder(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);
