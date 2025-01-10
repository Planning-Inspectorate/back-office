import { ODW_GENERAL_S51_CASE_REF } from '@pins/applications';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
import { migrateGeneralS51Advice } from '../common/migrators/general-s51-advice-migration.js';
import { app } from '@azure/functions';

app.setup({ enableHttpStream: true });
app.http('general-s51-advice-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		return handleMigrationWithResponse(context, {
			caseReferences: ODW_GENERAL_S51_CASE_REF,
			entityName: 'General S51 Advice',
			migrationStream: () => migrateGeneralS51Advice(context)
		});
	}
});
