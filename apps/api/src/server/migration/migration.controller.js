import { getMigratorForModel } from './migrator.service.js';

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateModel = async ({ body, params: { modelType } }, response) => {
	const migrationMap = getMigratorForModel(modelType);

	if (!migrationMap) {
		throw Error(`Unsupported model type ${modelType}`);
	}

	console.info(migrationMap);

	const { migrator, validator } = migrationMap;

	for (var i = 0; i < body.length; i++) {
		if (!validator(body[i])) {
			throw Error(`Model ${JSON.stringify(body[i])} failed model validation`);
		}
	}

	await migrator(body);

	response.sendStatus(200);
};
