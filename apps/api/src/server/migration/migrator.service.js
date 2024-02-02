import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { loadAllSchemas } from 'pins-data-model';
import { migrateNsipProjects } from './migrators/nsip-project-migrator.js';
import { migrateNsipProjectUpdates } from './migrators/nsip-project-update-migrator.js';
import { migrateNsipSubscriptions } from './migrators/nsip-subscription-migrator.js';
import { migrateServiceUsers } from './migrators/service-user-migrator.js';
import { migrateExamTimetables } from './migrators/nsip-exam-timetable-migrator.js';
import { migrateS51Advice } from './migrators/s51-advice-migrator.js';

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
	const { schemas } = await loadAllSchemas();

	const ajv = new Ajv({ schemas, allErrors: true });

	addAjvFormats(ajv);

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

	migrationMap.set('service-user', {
		validator: ajv.getSchema('service-user.schema.json'),
		migrator: migrateServiceUsers
	});

	migrationMap.set('nsip-exam-timetable', {
		validator: ajv.getSchema('nsip-exam-timetable.schema.json'),
		migrator: migrateExamTimetables
	});

	migrationMap.set('s51-advice', {
		validator: ajv.getSchema('s51-advice.schema.json'),
		migrator: migrateS51Advice
	});
};
