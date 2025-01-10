import { migrateProjectUpdates } from './src/project-updates-migration.js';
import {
	handleMigrationWithResponse,
	handleRequestValidation
} from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { toBoolean } from '../common/utils.js';

app.setup({ enableHttpStream: true });
app.http('project-updates-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReferences, isWelshCase, migrationOverwrite } = await request.json();
		const entityName = 'Project Updates';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: request.params.caseReference,
			entityName,
			migrationStream: () => migrateProjectUpdates(context, caseReferences, toBoolean(isWelshCase))
		});
	}
});
