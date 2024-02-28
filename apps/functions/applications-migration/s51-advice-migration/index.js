import { migrateS51Advice } from '../common/migrators/s51-advice-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating S51 Advice for', JSON.stringify(caseReferences));

	await migrateS51Advice(context.log, caseReferences);
}
