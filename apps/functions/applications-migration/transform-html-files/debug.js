import { transformMigratedHtmlFiles } from './transform-migrated-html-files.js';

await transformMigratedHtmlFiles(
	{
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	},
	{ applicationRef: 'EN010049' }
);
