import { migrateRepresentations } from '../common/migrators/nsip-representation-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	await handleMigrationWithResponse(
		context,
		caseReferences,
		() => migrateRepresentations(context.log, caseReferences),
		'representation'
	);
}
