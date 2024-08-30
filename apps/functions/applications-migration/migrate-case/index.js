import { migrateExamTimetablesForCase } from '../common/migrators/exam-timetable-migration.js';
import { migrateNsipProjectByReference } from '../common/migrators/nsip-project-migration.js';
import { migrationRepresentationsForCase } from '../common/migrators/nsip-representation-migration.js';
import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';
import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async (
	context,
	{ body: { caseReference = '', caseReferences = [], dryRun, migrationOverwrite = false } }
) => {
	if (typeof caseReference !== 'string') {
		context.res = {
			status: 400,
			body: {
				message:
					'Invalid request: "caseReference" should be a string. If you want to provide multiple case references, use the "caseReferences" property as an array.'
			}
		};
		return;
	}
	if (!Array.isArray(caseReferences)) {
		context.res = {
			status: 400,
			body: {
				message: 'Invalid request: "caseReferences" should be an array of strings.'
			}
		};
		return;
	}

	const isSingleCase = Boolean(caseReference);

	const migrateFunction = isSingleCase
		? async () => await migrateCase(context.log, caseReference, dryRun)
		: async () => {
				for (const reference of caseReferences) {
					await migrateCase(context.log, reference, dryRun);
				}
		  };

	await handleMigrationWithResponse(context, {
		caseReferences: isSingleCase ? caseReference : caseReferences,
		migrationFunction: migrateFunction,
		entityName: 'case',
		allowCaseReferencesArray: true,
		migrationOverwrite
	});
};

/**
 * Migrate a whole case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} dryRun
 */
const migrateCase = async (log, caseReference, dryRun = false) => {
	await migrateNsipProjectByReference(log, caseReference, false);
	await migrateServiceUsers(log, caseReference);
	await migrationNsipDocumentsByReference(log, caseReference);
	await migrateS51AdviceForCase(log, caseReference);
	await migrationRepresentationsForCase(log, caseReference);
	await migrateExamTimetablesForCase(log, caseReference);

	if (!dryRun) {
		// re-run the nsip-project migration to update the status and broadcast
		await migrateNsipProjectByReference(log, caseReference, true);
	}
};
