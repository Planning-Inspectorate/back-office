import { migrateExamTimetablesForCase } from '../common/migrators/exam-timetable-migration.js';
import { migrateNsipProjectByReference } from '../common/migrators/nsip-project-migration.js';
import { migrationRepresentationsForCase } from '../common/migrators/nsip-representation-migration.js';
import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { migrateServiceUsersForCase } from '../common/migrators/service-user-migration.js';
import { migrateFolders } from '@pins/applications.api/src/server/migration/migrators/folder-migrator.js';
import { migrationNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating cases:', JSON.stringify(caseReferences));
	for (const caseReference of caseReferences) {
		// migrate one at a time
		await migrateCase(context.log, caseReference);
	}
}

/**
 * Migrate a whole case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
async function migrateCase(log, caseReference) {
	// start with the nsip-project
	await migrateNsipProjectByReference(log, caseReference);

	await migrateServiceUsersForCase(log, caseReference);

	await migrateFolders(log, caseReference);
	await migrationNsipDocumentsByReference(log, caseReference);

	// todo: s51-advice attachments, once we have docs
	await migrateS51AdviceForCase(log, caseReference);
	// todo: nsip-representation attachments, once we have docs
	await migrationRepresentationsForCase(log, caseReference);

	await migrateExamTimetablesForCase(log, caseReference);

	// todo: mark case migrated on success
}
