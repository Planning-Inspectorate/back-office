import { migrateExamTimetablesForCase } from '../common/migrators/exam-timetable-migration.js';
import { migrateNsipProjectByReference } from '../common/migrators/nsip-project-migration.js';
import { migrateRepresentationsForCase } from '../common/migrators/nsip-representation-migration.js';
import { migrateS51AdviceForCase } from '../common/migrators/s51-advice-migration.js';
import { migrateServiceUsers } from '../common/migrators/service-user-migration.js';
import { migrateNsipDocumentsByReference } from '../common/migrators/nsip-document-migration.js';
import {
	handleMigrationWithResponse,
	handleRequestValidation
} from '../common/handle-migration-with-response.js';
import { migrateProjectUpdates } from '../project-updates-migration/src/project-updates-migration.js';
import { app } from '@azure/functions';
import { Readable } from 'stream';
import { validateMigration } from '../common/validate-migration.js';
import { toBoolean } from '../common/utils.js';
import { getArchiveFolderInfo } from '../common/get-archive-folder-info.js';
import { startMigrationCleanup } from '../common/migration-cleanup.js';

app.setup({ enableHttpStream: true });
app.http('migrate-case', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		// @ts-ignore
		const { caseReferences, migrationOverwrite, isWelshCase, dryRun } = await request.json();
		const entityName = 'case';
		const validationErrorResponse = await handleRequestValidation(context, {
			entityName,
			caseReferences,
			isSingleCaseReference: false,
			migrationOverwrite: toBoolean(migrationOverwrite)
		});
		if (validationErrorResponse) return validationErrorResponse;

		return handleMigrationWithResponse(context, {
			caseReferences: caseReferences,
			entityName,
			migrationStream: () =>
				migrateCase(context, caseReferences, toBoolean(dryRun), toBoolean(isWelshCase))
		});
	}
});

/**
 * Migrate a whole case
 *
 * @param {import("@azure/functions").InvocationContext} log
 * @param {string[]} caseReferenceList
 * @param {boolean} dryRun
 * @param {boolean} isWelshCase
 */
const migrateCase = async (log, caseReferenceList, dryRun = false, isWelshCase = false) => {
	/** @type {Function[][]} */
	const listOfCaseReferenceTasks = [];
	caseReferenceList.forEach((caseReference) => {
		const caseReferenceTaskList = [];
		caseReferenceTaskList.push(
			() => migrateNsipProjectByReference(log, caseReference, false),
			() => migrateServiceUsers(log, caseReference),
			() => migrateNsipDocumentsByReference(log, caseReference),
			() => migrateS51AdviceForCase(log, caseReference),
			() => migrateRepresentationsForCase(log, caseReference),
			() => migrateExamTimetablesForCase(log, caseReference)
		);
		if (isWelshCase) {
			caseReferenceTaskList.push(() => migrateProjectUpdates(log, [caseReference], isWelshCase));
		}

		caseReferenceTaskList.push(() => startMigrationCleanup(log, caseReference));

		// re-run the nsip-project migration to update the status and broadcast
		if (!dryRun) {
			caseReferenceTaskList.push(() => migrateNsipProjectByReference(log, caseReference, true));
		}

		listOfCaseReferenceTasks.push(caseReferenceTaskList);
	});

	return Readable.from(
		(async function* () {
			for (const caseReferenceTaskList of listOfCaseReferenceTasks) {
				for (const task of caseReferenceTaskList) {
					let isError = false;
					const entityStream = await task();

					for await (const chunk of handleEntityStream(entityStream)) {
						const chunkString = chunk.toString();
						if (chunkString?.toLowerCase()?.includes('error')) {
							log.error(`Error detected in chunk: ${chunkString}`);
							isError = true;
						}
						yield chunk;
					}

					if (isError) break;
				}
				yield '\n-------------------------------------\n';
			}
			yield '\nStarting validation process...\n';
			const validationResult = await validateMigration(log, caseReferenceList);
			yield 'Validation Result: \n' + JSON.stringify(validationResult, null, 2);
			yield '\nGetting archive folder information... \n';
			const folderInformationResult = await getArchiveFolderInfo(log, caseReferenceList);
			yield `Archive Folder Information is in format {folderPath}: {documentCount} \n`;
			yield 'Archive Folder Information: \n' + JSON.stringify(folderInformationResult, null, 2);
		})()
	);
};

/**
 *
 * @param {Readable | undefined} stream
 */
async function* handleEntityStream(stream) {
	if (!stream) {
		yield 'No stream received';
		return;
	}

	for await (const chunk of stream) {
		yield chunk;
	}
}
