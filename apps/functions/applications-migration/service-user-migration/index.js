import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences, skipValidation } }) {
	await handleMigrationWithResponse(
		context,
		caseReferences,
		() => migrateServiceUsers(context.log, caseReferences, skipValidation),
		'service user'
	);
}
