import { getMigratorForModel } from './migrator.service.js';

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
			throw Error(`Model ${JSON.stringify(model)} failed model validation`);
		}
	}

	await migrator(body);

	response.sendStatus(200);
};
