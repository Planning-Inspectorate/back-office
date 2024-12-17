import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async (
	context,
	req
	// { body: { caseReference, migrationOverwrite = false } }
) => {
	context.log('CONTEXT1: ' + JSON.stringify(context));
	context.log('CONTEXT2: ' + JSON.stringify(context.res));
	context.log('REQ1: ' + JSON.stringify(req));
	context.log('REQ2: ' + JSON.stringify(req.raw));
	const caseRef = req.body.caseReference;
	context.log({ caseRef });
	await handleMigrationWithResponse(context, req, {
		caseReferences: caseRef,
		entityName: 'document',
		migrationFunction: () => migrationNsipDocumentsByReference(context.log, req.body.caseReference),
		migrationOverwrite: req.body.migrationOverwrite
	});
};
