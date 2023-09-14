import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'node:fs';
import { migrateNsipProjects } from './migrators/nsip-project-migrator.js';

const schemas = readdirSync('./src/message-schemas/events')
	.filter((file) => file.endsWith('.schema.json'))
	.map((file) => {
		console.info('adding', file);
		return JSON.parse(readFileSync(`./src/message-schemas/events/${file}`).toString());
	});

const ajv = new Ajv({ schemas });

addFormats(ajv);

/**
 * @callback Migrator
 * @param {any[]} models
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} MigrationMap
 * @property {import('ajv/dist/types/index.js').AnyValidateFunction<unknown>} validator
 * @property {Migrator} migrator
 */

const migrationMap = new Map();

// TODO: Configure mappings for all models
migrationMap.set('nsip-project', {
	validator: ajv.getSchema('nsip-project.schema.json'),
	migrator: migrateNsipProjects
});

/**
 *
 * @param {string} modelType
 *
 * @returns {MigrationMap | null}
 */
export const getMigratorForModel = (modelType) => {
	if (!migrationMap.has(modelType)) {
		return null;
	}

	return migrationMap.get(modelType);
};
