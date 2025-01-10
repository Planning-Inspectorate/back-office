import { makeGetRequest } from './back-office-api-client.js';

const headers = { 'Content-Type': 'application/json; charset=utf-8' };

export const handleRequestValidation = async (
	context,
	{ entityName, caseReferences, isSingleCaseReference = true, migrationOverwrite = false }
) => {
	context.log(`Starting validation for ${entityName}s:`, JSON.stringify(caseReferences));

	const requestValidator = isSingleCaseReference
		? validateCaseReferenceParam
		: validateCaseReferenceListParam;
	const validationError = requestValidator(caseReferences);
	if (validationError) {
		return {
			headers,
			status: validationError.status,
			jsonBody: { message: validationError.message }
		};
	}
	if (!migrationOverwrite) {
		const areCasesMigrated = await getCaseMigrationStatuses(context, caseReferences);
		if (areCasesMigrated.areMigrated) {
			return {
				headers,
				status: 200,
				jsonBody: {
					migration: areCasesMigrated.error
				}
			};
		}
	}
	return null;
};

/**
 * Wrapper function for migration functions that handles error handling and sends useful responses.
 * @param {import("@azure/functions").Context} context - The Azure function context object.
 * @param {Object} params - The parameters object.
 * @param {string | string[]} params.caseReferences - The case reference(s) to be migrated.
 * @param {Function} params.migrationStream - The migration function to be executed.
 * @param {string} params.entityName - The name of the entity being migrated.
 */
export const handleMigrationWithResponse = async (
	context,
	{ caseReferences, migrationStream, entityName }
) => {
	context.log(`Starting migration for ${entityName}s:`, JSON.stringify(caseReferences));
	try {
		return {
			headers: { 'Content-Type': 'application/event-stream' },
			status: 200,
			body: await migrationStream()
		};
	} catch (error) {
		context.error(`Failed to run migration for ${entityName}`, error);

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

		return {
			status: 500,
			jsonBody: responseBody,
			headers
		};
	}
};

/**
 *
 * @param {string} caseReference
 */
const validateCaseReferenceParam = (caseReference) => {
	if (!caseReference || caseReference === ' ') {
		return {
			status: 400,
			message: 'Invalid request: You must provide a single "caseReference" as a string'
		};
	}
};
/**
 *
 * @param {string[]} caseReferences
 */
const validateCaseReferenceListParam = (caseReferences) => {
	if (!Array.isArray(caseReferences) || caseReferences.length === 0) {
		return {
			status: 400,
			message: 'Invalid request: You must provide an array of caseReferences'
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
