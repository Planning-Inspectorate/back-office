import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';
import { app } from '@azure/functions';
import { Readable } from 'stream';
import { validateMigration } from '../common/validate-migration.js';
import { getArchiveFolderInfo } from '../common/get-archive-folder-info.js';
import { startMigrationCleanup } from '../common/migration-cleanup.js';

app.setup({ enableHttpStream: true });
/**
 *  Runs the post migration tasks such as
 *  - Cleanup (s51 unattached documents)
 *  - Data Validation
 *  - Display Archive Folder Information
 */
app.http('post-migration', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		// @ts-ignore
		const { caseReferences, skipHtmlTransform } = await request.json();
		const entityName = 'post-migration';
		return handleMigrationWithResponse(context, {
			caseReferences: caseReferences,
			entityName,
			migrationStream: () => runPostMigrationTasks(context, caseReferences, skipHtmlTransform)
		});
	}
});

/**
 * Migrate a whole case
 *
 * @param {import("@azure/functions").InvocationContext} log
 * @param {string[]} caseReferenceList
 * @param {boolean} skipHtmlTransform
 */
const runPostMigrationTasks = async (log, caseReferenceList, skipHtmlTransform) => {
	/** @type {Function[][]} */
	const listOfCaseReferenceTasks = [];
	caseReferenceList.forEach((caseReference) => {
		const caseReferenceTaskList = [() => startMigrationCleanup(log, caseReference, skipHtmlTransform)];
		listOfCaseReferenceTasks.push(caseReferenceTaskList);
	});

	return Readable.from(
		(async function* () {
			yield `Starting post migration for ${JSON.stringify(caseReferenceList)}`;
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
export async function* handleEntityStream(stream) {
	if (!stream) {
		yield 'No stream received';
		return;
	}

	for await (const chunk of stream) {
		yield chunk;
	}
}
