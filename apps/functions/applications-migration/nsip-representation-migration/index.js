import { migrateRepresentations } from '../common/migrators/nsip-representation-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Representations for', JSON.stringify(caseReferences));

	await migrateRepresentations(context.log, caseReferences);
}
