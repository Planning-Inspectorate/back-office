// @ts-nocheck
import {
	migrateGeneralS51Advice,
	migrateSelectGeneralS51Advice
} from '../common/migrators/general-s51-advice-migration.js';

if (process.argv[2]) {
	migrateSelectGeneralS51Advice(
		{
			info: console.log,
			error: console.error,
			warn: console.warn,
			verbose: console.log
		},
		process.argv.slice(2)
	);
} else {
	migrateGeneralS51Advice({
		info: console.log,
		error: console.error,
		warn: console.warn,
		verbose: console.log
	});
}
