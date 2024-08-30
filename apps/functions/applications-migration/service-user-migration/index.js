import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async (context, { body: { caseReference, migrationOverwrite = false } }) => {
	await handleMigrationWithResponse(context, {
		caseReferences: caseReference,
		migrationFunction: () => migrateServiceUsers(context.log, caseReference),
		entityName: 'service user',
		migrationOverwrite
	});
};
