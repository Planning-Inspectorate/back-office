import { validateMigration } from './validate-migration.js';

/**
 * Wrapper function for migration functions that handles error handling and sends useful responses
 * @param {import('@azure/functions').Context} context
 * @param {string[]} caseReferences
 * @param {Function} migrationFunction
 * @param {string} entityName
 */
export const handleMigrationWithResponse = async (
	context,
	caseReferences,
	migrationFunction,
	entityName
) => {
	if (!caseReferences || caseReferences.length === 0) {
		context.res = {
			status: 400,
			body: { message: 'caseReferences are required' }
		};
		return;
	}
	context.log(`Starting migration for ${entityName}s:`, JSON.stringify(caseReferences));

	try {
		await migrationFunction();
		context.res = {
			status: 200,
			body: {
				migration: `Successfully ran migration for ${entityName}`,
				validation:
					entityName === 'case' ? await validateMigration(context.log, caseReferences) : null
			},
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		};
	} catch (error) {
		context.log.error(`Failed to run migration for ${entityName}`, error);

		let responseBody;
		if (error?.cause?.response?.body) {
			responseBody = {
				message: error.message,
				...JSON.parse(error.cause.response.body)
			};
		} else {
			responseBody = {
				message: `Failed to run migration for ${entityName} with error: ${
					error?.cause?.message || error?.message
				}`
			};
		}

		context.res = {
			status: 500,
			body: responseBody,
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		};
	}
};
