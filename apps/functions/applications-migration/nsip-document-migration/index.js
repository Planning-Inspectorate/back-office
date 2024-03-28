import { migrationNsipDocuments } from './src/nsip-document-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating NSIP Projects for', JSON.stringify(caseReferences));

	await migrationNsipDocuments(context.log, caseReferences);
}
