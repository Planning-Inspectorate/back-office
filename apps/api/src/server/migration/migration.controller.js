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

	// temporary for docs until response streaming is implemented everywhere
	if (modelType === 'nsip-document') {
		response.writeHead(200, { 'Content-Type': 'text/plain', 'transfer-encoding': 'chunked' });
		let progressMessageCount = 0;
		let currentIndex = 0;
		let totalCount = 0;
		const progressInterval = setInterval(() => {
			progressMessageCount++;
			response.write(`Still processing... (${progressMessageCount * 10} seconds elapsed)\n`);
			response.write(`Completed ${currentIndex} of ${totalCount} ${modelType}\n`);
			response.flush();
		}, 10000);

		let err;
		try {
			response.write(`Starting migration for model type: ${modelType}...\n`);
			await migrator(body, (index, total) => {
				currentIndex = index;
				totalCount = total;
			});
		} catch (error) {
			logger.error(`Error during migration of ${modelType}: ${error}`);
			err = error;
		} finally {
			response.end(
				err ? `Error during migration of ${modelType}: ${err}` : 'Migration completed successfully.'
			);
			clearInterval(progressInterval);
		}
	} else {
		await migrator(body);
		response.sendStatus(200);
	}
};

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateFolders = async ({ body }, response) => {
	await migrateFolders(logger, body.caseReference);

	response.sendStatus(200);
};
