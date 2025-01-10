import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';
import {
	handleMigrationWithResponse,
	handleRequestValidation
} from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { toBoolean } from '../common/utils.js';

app.setup({ enableHttpStream: true });
app.http('service-user-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReference, migrationOverwrite } = await request.json();
		const entityName = 'Service User';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences: caseReference,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: caseReference,
			entityName,
			migrationStream: () => migrateServiceUsers(context, caseReference)
		});
	}
});
