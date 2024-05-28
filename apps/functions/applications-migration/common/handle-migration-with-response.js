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
	console.info(`Starting migration for ${entityName}s:`, JSON.stringify(caseReferences));

	try {
		await migrationFunction();
		context.res = {
			status: 200,
			body: {
				migration: `Successfully ran migration for ${entityName}`,
				validation:
					entityName === 'case' ? await validateMigration(context.log, caseReferences) : null
			}
		};
	} catch (error) {
		console.error(`Failed to run migration for ${entityName}`, error);
		context.res = {
			status: 500,
			body: {
				message: `Failed to run migration for ${entityName} with error: ${error.message}`
			}
		};
	}
};
