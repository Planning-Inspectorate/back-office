import { migrateFolders } from '../common/migrators/folder-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	await handleMigrationWithResponse(
		context,
		caseReferences,
		() => migrateFolders(context.log, caseReferences),
		'folder'
	);
}
