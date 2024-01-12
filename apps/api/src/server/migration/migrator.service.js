import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readdirSync, readFileSync } from 'node:fs';
import { migrateNsipProjects } from './migrators/nsip-project-migrator.js';
import { migrateNsipProjectUpdates } from './migrators/nsip-project-update-migrator.js';
import { migrateNsipSubscriptions } from './migrators/nsip-subscription-migrator.js';

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
 * @returns {Promise<MigrationMap | null>}
 */
export const getMigratorForModel = async (modelType) => {
	if (migrationMap.size === 0) {
		await initializeMapping();
	}

	if (!migrationMap.has(modelType)) {
		return null;
	}

	return migrationMap.get(modelType);
};

// the mappings are lazily initialised to improve test performance
const initializeMapping = async () => {
	const schemas = readdirSync('./src/message-schemas/events')
		.filter((file) => file.endsWith('.schema.json'))
		.map((file) => {
			return JSON.parse(readFileSync(`./src/message-schemas/events/${file}`).toString());
		});

	const ajv = new Ajv({ schemas, allErrors: true });

	addFormats(ajv);

	migrationMap.set('nsip-project', {
		validator: ajv.getSchema('nsip-project.schema.json'),
		migrator: migrateNsipProjects
	});

	migrationMap.set('nsip-project-update', {
		validator: ajv.getSchema('nsip-project-update.schema.json'),
		migrator: migrateNsipProjectUpdates
	});

	migrationMap.set('nsip-subscription', {
		validator: ajv.getSchema('nsip-subscription.schema.json'),
		migrator: migrateNsipSubscriptions
	});
};
