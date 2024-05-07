import { migrateCase } from './index.js';

// @ts-ignore
migrateCase(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	'BC010006',
	true
);
