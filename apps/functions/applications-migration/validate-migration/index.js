import { validateMigration } from '../common/validate-migration.js';
import { app } from '@azure/functions';

app.http('validate-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const { caseReferences } = await request.json();
		context.log(`Starting migration validation for ${JSON.stringify(caseReferences)}`);
		try {
			const diff = await validateMigration(context, caseReferences);
			context.log(`Migration validation completed with diff: ${JSON.stringify(diff)}`);
			return {
				status: 200,
				jsonBody: diff
			};
		} catch (error) {
			return {
				status: 500,
				jsonBody: {
					message: `Failed to run validation for migration with error: ${error.message}`
				}
			};
		}
	}
});
