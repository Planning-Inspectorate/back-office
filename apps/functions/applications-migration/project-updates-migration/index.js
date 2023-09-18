import { migrateProjectUpdates } from './src/project-updates-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating project updates for', JSON.stringify(caseReferences));

	await migrateProjectUpdates(context.log, caseReferences);
}
