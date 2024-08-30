import { makeGetRequest } from './back-office-api-client.js';
import { validateMigration } from './validate-migration.js';

const headers = { 'Content-Type': 'application/json; charset=utf-8' };
/**
 * Wrapper function for migration functions that handles error handling and sends useful responses.
 * @param {import('@azure/functions').Context} context - The Azure function context object.
 * @param {Object} params - The parameters object.
 * @param {string | string[]} params.caseReferences - The case reference(s) to be migrated.
 * @param {Function} params.migrationFunction - The migration function to be executed.
 * @param {string} params.entityName - The name of the entity being migrated.
 * @param {boolean} [params.allowCaseReferencesArray=false] - Whether to allow multiple case references as an array.
 * @param {boolean} [params.migrationOverwrite=false] - Whether to overwrite existing migration data.
 */
export const handleMigrationWithResponse = async (
	context,
	{
		caseReferences,
		migrationFunction,
		entityName,
		allowCaseReferencesArray = false,
		migrationOverwrite = false
	}
) => {
	const validationError = validateRequest(caseReferences, allowCaseReferencesArray);
	if (!migrationOverwrite) {
		const areCasesMigrated = await getCaseMigrationStatuses(context.log, caseReferences);
		if (areCasesMigrated.areMigrated) {
			context.res = {
				status: 200,
				body: {
					migration: areCasesMigrated.error
				},
				headers
			};
			return;
		}
	}

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
			headers
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
			headers
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

const getCaseMigrationStatuses = async (logger, caseReferences) => {
	if (!Array.isArray(caseReferences)) {
		caseReferences = [caseReferences];
	}
	const migrationStatuses = {
		areMigrated: false,
		error: 'The following cases are already migrated: '
	};
	for (const caseReference of caseReferences) {
		try {
			const { migrationStatus } = await makeGetRequest(
				logger,
				`/applications/reference/${caseReference}`
			);
			logger.info(`migrationStatus set to ${migrationStatus}`);
			if (migrationStatus) {
				migrationStatuses.areMigrated = true;
				migrationStatuses.error = migrationStatuses.error + caseReference + ', ';
			}
		} catch (error) {
			logger.info(
				`Case with caseReference ${caseReference} not found in CBOS. Continuing with migration`
			);
		}
	}
	migrationStatuses.error =
		migrationStatuses.error + 'Set "migrationOverwrite": true in request body to force migration.';
	return migrationStatuses;
};
