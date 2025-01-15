import { migrateFoldersForCase } from '../common/migrators/folder-migration.js';
import { handleRequestValidation } from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { toBoolean } from '../common/utils.js';

app.http('nsip-folder-creation', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReference, migrationOverwrite } = await request.json();
		const entityName = 'Folder';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences: caseReference,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;
		await migrateFoldersForCase(context, caseReference);
		return {
			status: 200,
			jsonBody: { message: 'Folder creation complete' }
		};
	}
});
