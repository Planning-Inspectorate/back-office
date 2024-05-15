import { migrateExamTimetablesForCase } from '../common/migrators/exam-timetable-migration.js';
import { migrateNsipProjectByReference } from '../common/migrators/nsip-project-migration.js';
import { migrationRepresentationsForCase } from '../common/migrators/nsip-representation-migration.js';
import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { migrateServiceUsersForCase } from '../common/migrators/service-user-migration.js';
import { migrateFolders } from '@pins/applications.api/src/server/migration/migrators/folder-migrator.js';
import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences, dryRun } }) {
	const migrationFunction = async () => {
		for (const caseReference of caseReferences) {
			await migrateCase(context.log, caseReference, dryRun);
		}
	};
	await handleMigrationWithResponse(context, caseReferences, migrationFunction, 'case');
}

/**
 * Migrate a whole case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} dryRun
 */
export async function migrateCase(log, caseReference, dryRun = true) {
	// start with the nsip-project
	await migrateNsipProjectByReference(log, caseReference, false);

	await migrateServiceUsersForCase(log, caseReference);

	await migrateFolders(log, caseReference);
	await migrationNsipDocumentsByReference(log, caseReference);

	// todo: s51-advice attachments, once we have docs
	await migrateS51AdviceForCase(log, caseReference);
	// todo: nsip-representation attachments, once we have docs
	await migrationRepresentationsForCase(log, caseReference);

	await migrateExamTimetablesForCase(log, caseReference);

	// re-run the nsip-project migration to update the status and broadcast
	if (!dryRun) {
		await migrateNsipProjectByReference(log, caseReference, true);
	}
}
