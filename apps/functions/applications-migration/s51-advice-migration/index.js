import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async (context, { body: { caseReference, migrationOverwrite = false } }) => {
	await handleMigrationWithResponse(context, {
		caseReferences: caseReference,
		migrationFunction: () => migrateS51AdviceForCase(context.log, caseReference),
		entityName: 'S51 advice',
		migrationOverwrite
	});
};
