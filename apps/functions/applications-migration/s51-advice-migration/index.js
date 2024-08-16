import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async (context, { body: { caseReferences } }) => {
	await handleMigrationWithResponse(
		context,
		caseReferences,
		() => migrateS51AdviceForCase(context.log, caseReferences),
		'S51 advice'
	);
};
