import { migrateRepresentationsForCase } from '../common/migrators/nsip-representation-migration.js';
import {
	handleMigrationWithResponse,
	handleRequestValidation
} from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { toBoolean } from '../common/utils.js';

app.setup({ enableHttpStream: true });
app.http('nsip-representation-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReference, migrationOverwrite } = await request.json();
		const entityName = 'Representation';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences: caseReference,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: caseReference,
			entityName,
			migrationStream: () => migrateRepresentationsForCase(context, caseReference)
		});
	}
});
