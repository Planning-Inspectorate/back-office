import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Service Users for', JSON.stringify(caseReferences));

	await migrateServiceUsers(context.log, caseReferences);
}
