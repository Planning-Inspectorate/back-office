import { migrateS51Advice } from './src/s51-advice-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param  {object} message
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Service Users for', JSON.stringify(caseReferences));

	await migrateS51Advice(context.log, caseReferences);
}
