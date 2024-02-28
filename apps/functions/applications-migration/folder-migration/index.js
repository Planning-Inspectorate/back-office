import { migrateFolder } from './src/folder-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param  {object} message
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Folders for', JSON.stringify(caseReferences));

	await migrateFolder(context.log, caseReferences);
}
