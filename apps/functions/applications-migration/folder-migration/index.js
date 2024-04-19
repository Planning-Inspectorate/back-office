import { migrateFolders } from '../common/migrators/folder-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param  {object} message
 */
export default async function (context, { body: { caseReferences } }) {
	context.log('Migrating Folders for', JSON.stringify(caseReferences));

	await migrateFolders(context.log, caseReferences);
}
