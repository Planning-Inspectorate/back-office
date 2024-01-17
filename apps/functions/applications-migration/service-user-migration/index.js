import { migrateServiceUsers } from './src/service-user-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param  {object} message
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Service Users for', JSON.stringify(caseReferences));

	await migrateServiceUsers(context.log, caseReferences);
}
