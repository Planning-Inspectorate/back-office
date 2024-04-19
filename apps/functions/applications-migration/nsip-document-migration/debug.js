import { migrationNsipDocuments } from '../common/migrators/nsip-document-migration.js';

// @ts-ignore
migrationNsipDocuments(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['EN010007']
);
