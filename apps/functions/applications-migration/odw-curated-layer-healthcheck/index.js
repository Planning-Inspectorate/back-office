import { getODWData } from '../common/validate-migration.js';
import { loadAllSchemas } from 'pins-data-model';
import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { uniqBy } from 'lodash-es';

/**
 * @param {import("@azure/functions").Context} context
 * @param {import("@azure/functions").HttpRequest} req
 */
export default async function (context, { body: { caseReference } }) {
	if (!caseReference) throw new Error('CaseReference is required');
	context.log.info(`Healthcheck using case ${caseReference}`);
	try {
		const data = await getODWData(context.log, [caseReference]);

		const errors = {};
		const entityTypes = Object.keys(data[caseReference]);
		for (const entityType of entityTypes) {
			const validator = await getValidatorForModel(entityType);
			errors[entityType] = [];
			if (entityType !== 'project') {
				for (const entity of data[caseReference][entityType]) {
					if (!validator(entity)) {
						errors[entityType].push(validator.errors);
					}
				}
			} else {
				if (!validator(data[caseReference][entityType])) {
					errors[entityType] = validator.errors;
				}
			}
		}

		if (Object.keys(errors).length > 0) {
			const removeDuplicateErrors = (errors) => uniqBy(errors, 'message');
			const uniqueErrors = Object.keys(errors).reduce((acc, key) => {
				acc[key] = removeDuplicateErrors(errors[key].flat());
				return acc;
			}, {});
			context.log(`healthcheck failed`, uniqueErrors);
			context.res = {
				status: 400,
				body: JSON.stringify(uniqueErrors, null, 2),
				headers: { 'Content-Type': 'application/json; charset=utf-8' }
			};
		} else {
			context.res = {
				status: 200,
				body: 'ODW Curated Layer healthcheck passed',
				headers: { 'Content-Type': 'application/json; charset=utf-8' }
			};
		}
	} catch (error) {
		context.log.error(`failed to run healthcheck`, error);
		context.res = {
			status: 500,
			body: JSON.stringify(error, null, 2),
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		};
	}
}

const entityMap = new Map();

/**
 *
 * @param {string} modelType
 *
 * @returns {Promise<MigrationMap | null>}
 */
export const getValidatorForModel = async (modelType) => {
	if (entityMap.size === 0) {
		await initializeMapping();
	}

	if (!entityMap.has(modelType)) {
		return null;
	}

	return entityMap.get(modelType);
};

// the mappings are lazily initialised to improve test performance
const initializeMapping = async () => {
	const { schemas } = await loadAllSchemas();

	const ajv = new Ajv({ schemas, allErrors: true });

	addAjvFormats(ajv);

	entityMap.set('project', ajv.getSchema('nsip-project.schema.json'));
	entityMap.set('serviceUsers', ajv.getSchema('service-user.schema.json'));
	entityMap.set('examTimetableItems', ajv.getSchema('nsip-exam-timetable.schema.json'));
	entityMap.set('s51Advice', ajv.getSchema('s51-advice.schema.json'));
	entityMap.set('representations', ajv.getSchema('nsip-representation.schema.json'));
	entityMap.set('documents', ajv.getSchema('nsip-document.schema.json'));
};