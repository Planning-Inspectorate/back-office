import { validateMigration } from './validate-migration.js';

/**
 * Wrapper function for migration functions that handles error handling and sends useful responses
 * @param {import('@azure/functions').Context} context
 * @param {string | string[]} caseReferences
 * @param {Function} migrationFunction
 * @param {string} entityName
 * @param {boolean} allowCaseReferencesArray
 */
export const handleMigrationWithResponse = async (
	context,
	caseReferences,
	migrationFunction,
	entityName,
	allowCaseReferencesArray = false
) => {
	const validationError = validateRequest(caseReferences, allowCaseReferencesArray);
	if (validationError) {
		context.res = {
			status: validationError.status,
			body: { message: validationError.message }
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
					entityName === 'case'
						? await validateMigration(context.log, [caseReferences].flat())
						: null
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
/**
 *
 * @param {string | string[]} caseReferences
 * @param {boolean} allowCaseReferencesArray
 */
const validateRequest = (caseReferences, allowCaseReferencesArray) => {
	if (!caseReferences || caseReferences.length === 0) {
		return {
			status: 400,
			message:
				'Invalid request: You must provide a single "caseReference" as a string' +
				(allowCaseReferencesArray ? ' or "caseReferences" as a non-empty array of strings.' : '')
		};
	}

	if (!allowCaseReferencesArray && Array.isArray(caseReferences)) {
		return {
			status: 400,
			message: 'Invalid request: You must provide a single "caseReference" as a string'
		};
	}
};
