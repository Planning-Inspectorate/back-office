import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import {
	handleMigrationWithResponse,
	handleRequestValidation
} from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { toBoolean } from '../common/utils.js';

app.setup({ enableHttpStream: true });
app.http('s51-advice-migration', {
	methods: ['POST'],
	handler: async (request, context) => {
		const { caseReference, migrationOverwrite } = await request.json();
		const entityName = 'S51 Advice';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences: caseReference,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: caseReference,
			entityName,
			migrationStream: () => migrateS51AdviceForCase(context, caseReference)
		});
	}
});
