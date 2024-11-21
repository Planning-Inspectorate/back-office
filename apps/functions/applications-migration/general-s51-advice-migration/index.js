import { ODW_GENERAL_S51_CASE_REF } from '@pins/applications';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
import { migrateGeneralS51Advice } from '../common/migrators/general-s51-advice-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 */
export default async (context) => {
	await handleMigrationWithResponse(context, {
		caseReferences: ODW_GENERAL_S51_CASE_REF,
		migrationFunction: () => migrateGeneralS51Advice(context.log),
		entityName: 'General S51 Advice',
		migrationOverwrite: false
	});
};
