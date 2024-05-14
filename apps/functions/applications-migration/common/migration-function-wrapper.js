/**
 * Wrapper function for migration functions that handles error handling and sends useful responses
 * @param {import('@azure/functions').Context} context
 * @param {string[]} caseReferences
 * @param {Function} migrationFunction
 * @param {string} entityName
 */
export const migrationFunctionWrapper = async (
	context,
	caseReferences,
	migrationFunction,
	entityName
) => {
	if (!caseReferences) {
		context.res = {
			status: 400,
			body: { message: 'CaseReferences are required' }
		};
		return;
	}
	console.info(`Migrating ${entityName}s:`, JSON.stringify(caseReferences));
	try {
		await migrationFunction();
		context.res = {
			status: 200,
			body: { message: `Successfully ran migration for ${entityName}` }
		};
	} catch (error) {
		console.error(`Failed to run migration for ${entityName}`, error);
		context.res = {
			status: 500,
			body: { message: `Failed to run migration for ${entityName} with error: ${error.message}` }
		};
	}
};
