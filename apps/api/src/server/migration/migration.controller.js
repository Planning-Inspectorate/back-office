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

	for (const model of body) {
		if (!validator(model)) {
			throw Error(
				JSON.stringify({
					message: `Model ${modelType} failed validation`,
					validationErrors: validator.errors
				})
			);
		}
	}
	// await migrator(body);
	// response.sendStatus(200);

	// this method doesn't handle errors!! NEED TO HANDLE
	response.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });

	let progressMessageCount = 0;
	const progressInterval = setInterval(() => {
		progressMessageCount++;
		response.write(`Still processing... (${progressMessageCount * 10} seconds elapsed)\n)`);
	}, 10000);

	try {
		response.write(`Starting migration for model type: ${modelType}...\n`);
		await migrator(body);
		// await new Promise((resolve) => {
		// 	setTimeout(() => {
		// 		resolve(console.log('doing stuff'));
		// 	}, 40000);
		// });

		response.write(`Migration completed successfully.\n`);
	} catch (error) {
		// response.write(`Error during migration: ${error.message}\n`);
		throw Error(`Error during migration: ${error.message}`);
	} finally {
		clearInterval(progressInterval);
		response.end();
	}
};

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateFolders = async ({ body }, response) => {
	await migrateFolders(logger, body.caseReference);

	response.sendStatus(200);
};
