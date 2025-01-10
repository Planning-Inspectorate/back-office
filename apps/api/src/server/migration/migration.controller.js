import { getMigratorForModel } from './migrator.service.js';
import { migrateFolders } from './migrators/folder-migrator.js';
import logger from '#utils/logger.js';

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateModel = async ({ body, params: { modelType } }, response) => {
	const migrationMap = await getMigratorForModel(modelType);

	if (!migrationMap) {
		throw Error(`Unsupported model type ${modelType}`);
	}

	const { migrator, validator } = migrationMap;

	const caseReference = extractCaseReferenceFromBody(body);
	response.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });

	for (const model of body) {
		if (!validator(model)) {
			response.write(`Model ${modelType} failed validation\n`);
			response.write(`${JSON.stringify(validator.errors, null, 2)}\n`);
			response.end();
			return;
		}
	}

	let progressMessageCount = 0;
	let currentIndex = 0;
	let totalCount = 0;
	const progressInterval = setInterval(() => {
		progressMessageCount++;
		response.write(`still processing... (${progressMessageCount * 10} seconds elapsed)\n`);
		response.write(`completed ${currentIndex} of ${totalCount} ${modelType}\n`);
		response.flush();
	}, 10000);

	try {
		response.write(
			`\nStarting migration for model type: ${modelType} for case ${caseReference}...\n`
		);
		response.flush();
		await migrator(body, (index, total) => {
			currentIndex = index;
			totalCount = total;
		});
		response.write(`Completed migration of ${modelType} successfully for case ${caseReference}.\n`);
	} catch (error) {
		logger.error(`Error during migration of ${modelType} for case ${caseReference}: ${error}`);
		response.write(`Error during migration of ${modelType} for case ${caseReference}: ${error}\n`);
	} finally {
		response.end();
		clearInterval(progressInterval);
	}
};

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateFolders = async ({ body }, response) => {
	await migrateFolders(logger, body.caseReference);
	response.sendStatus(200);
};

const extractCaseReferenceFromBody = (body) => {
	return body.caseReference || body.caseRef || body[0]?.caseReference || body[0]?.caseRef;
};
