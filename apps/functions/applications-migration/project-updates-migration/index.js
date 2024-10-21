import { migrateProjectUpdates } from './src/project-updates-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async (
	context,
	{ body: { caseReferences, migrationOverwrite = false, isWelshCase = false } }
) => {
	await handleMigrationWithResponse(context, {
		caseReferences,
		entityName: 'project update',
		migrationFunction: () => migrateProjectUpdates(context.log, caseReferences, isWelshCase),
		migrationOverwrite,
		allowCaseReferencesArray: true
	});
};
