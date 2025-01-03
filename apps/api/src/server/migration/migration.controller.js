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

	// const { migrator, validator } = migrationMap;
	const { validator } = migrationMap;

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

	response.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });

	let progressMessageCount = 0;
	const progressInterval = setInterval(() => {
		progressMessageCount++;
		response.write(`Still processing... (${progressMessageCount * 10} seconds elapsed)\n`);
		response.flush();
	}, 10000);

	try {
		response.flushHeaders();
		response.write(`Starting migration for model type: ${modelType}...(not really)\n`);
		response.flush();
		await new Promise((resolve) =>
			setTimeout(() => {
				resolve('done');
			}, 600000)
		);
		response.write(`Migration completed successfully.\n`);
		response.flush();
	} catch (error) {
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
