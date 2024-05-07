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
			throw Error(`Model ${modelType} failed with errors ${JSON.stringify(validator.errors)}`);
		}
	}

	await migrator(body);

	response.sendStatus(200);
};

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateFolders = async ({ body }, response) => {
	await migrateFolders(logger, body.caseReference);

	response.sendStatus(200);
};
