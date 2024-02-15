import { migrateRepresentations } from './src/nsip-representation-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param  {object} message
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Representations for', JSON.stringify(caseReferences));

	await migrateRepresentations(context.log, caseReferences);
}
