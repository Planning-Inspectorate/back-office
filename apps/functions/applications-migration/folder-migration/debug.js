import { migrateFolders } from '../common/migrators/folder-migration.js';

// @ts-ignore
await migrateFolders(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	['TR020002']
);
