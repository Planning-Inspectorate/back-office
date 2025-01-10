import { migrateNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { app } from '@azure/functions';
import {
	handleRequestValidation,
	handleMigrationWithResponse
} from '../common/handle-migration-with-response.js';
import { toBoolean } from '../common/utils.js';

app.setup({ enableHttpStream: true });
app.http('nsip-document-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReference, migrationOverwrite } = await request.json();
		const entityName = 'Document';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences: caseReference,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: caseReference,
			entityName,
			migrationStream: () => migrateNsipDocumentsByReference(context, caseReference)
		});
	}
});
