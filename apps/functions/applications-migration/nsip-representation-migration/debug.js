import { migrateRepresentations } from './src/nsip-representation-migration.js';

// @ts-ignore
await migrateRepresentations(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);