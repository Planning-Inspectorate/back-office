import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
import { migrateGeneralS51Advice } from '../common/migrators/general-s51-advice-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 */
export default async (context, { migrationOverwrite = false }) => {
	await handleMigrationWithResponse(context, {
		caseReferences: 'General',
		migrationFunction: () => migrateGeneralS51Advice(context.log),
		entityName: 'General S51 Advice',
		migrationOverwrite
	});
};
