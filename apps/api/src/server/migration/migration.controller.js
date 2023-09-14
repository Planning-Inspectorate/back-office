import { getMigratorForModel } from './migrator.service.js';
import { migrateProjectUpdates } from './migrators/project-updates-migrator.js';

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const postMigrateModel = async ({ body, params: { modelType } }, response) => {
	const migrationMap = getMigratorForModel(modelType);

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

/**
 * @type {import("express").RequestHandler<{}, ?, { caseReferences: string[] }>}
 */
export const postMigrateProjectUpdates = async ({ body: { caseReferences } }, response) => {
	if (!caseReferences?.length) {
		throw Error('No case references provided');
	}

	await migrateProjectUpdates(caseReferences);

	response.sendStatus(200);
};
