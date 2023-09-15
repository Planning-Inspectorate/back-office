import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'node:fs';
import { migrateNsipProjects } from './migrators/nsip-project-migrator.js';
import { migrateNsipProjectUpdates } from './migrators/nsip-project-update-migrator.js';

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

/**
 *
 * @param {string} modelType
 *
 * @returns {MigrationMap | null}
 */
export const getMigratorForModel = (modelType) => {
	if (migrationMap.size === 0) {
		initializeMapping();
	}

	if (!migrationMap.has(modelType)) {
		return null;
	}

	return migrationMap.get(modelType);
};

// the mappings are lazily initialised to improve test performance
const initializeMapping = () => {
	const schemas = readdirSync('./src/message-schemas/events')
		.filter((file) => file.endsWith('.schema.json'))
		.map((file) => {
			return JSON.parse(readFileSync(`./src/message-schemas/events/${file}`).toString());
		});

	const ajv = new Ajv({ schemas });

	addFormats(ajv);

	migrationMap.set('nsip-project', {
		validator: ajv.getSchema('nsip-project.schema.json'),
		migrator: migrateNsipProjects
	});

	migrationMap.set('nsip-project-update', {
		validator: ajv.getSchema('nsip-project-update.schema.json'),
		migrator: migrateNsipProjectUpdates
	});
};
