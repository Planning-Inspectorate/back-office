import { migrateNsipProjectByReference } from '../common/migrators/nsip-project-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async (context, { body: { caseReferences } }) => {
	await handleMigrationWithResponse(
		context,
		caseReferences,
		() => migrateNsipProjectByReference(context.log, caseReferences),
		'project'
	);
};
