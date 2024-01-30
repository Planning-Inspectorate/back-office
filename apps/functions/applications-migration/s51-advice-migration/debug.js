import { migrateS51Advice } from './src/s51-advice-migration.js';

// @ts-ignore
await migrateS51Advice(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);
