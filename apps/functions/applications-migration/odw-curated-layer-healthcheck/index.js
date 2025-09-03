import { getODWData } from '../common/validate-migration.js';
import { loadAllSchemas } from '@planning-inspectorate/data-model';
import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { uniqBy } from 'lodash-es';
import { app } from '@azure/functions';

const entityMap = new Map();

app.http('odw-curated-layer-healthcheck', {
	methods: ['POST'],
	/**
	 * @param {import('@azure/functions').HttpRequest} request
	 * @param {import('@azure/functions').InvocationContext} context
	 */
	handler: async (request, context) => {
		const caseReference = request.params.caseReference;
		if (!caseReference) throw new Error('CaseReference is required');
		context.log(`Healthcheck using case ${caseReference}`);
		try {
			const data = await getODWData(context, [caseReference]);

			const errors = {};
			const entityTypes = Object.keys(data[caseReference]);
			for (const entityType of entityTypes) {
				const entityData = data[caseReference][entityType];
				const validator = await getValidatorForModel(entityType);
				errors[entityType] = [];
				// project and exam timetable are singular entities
				if (entityType === 'project' || entityType === 'examTimetableItems') {
					if (!validator(entityData)) {
						errors[entityType] = validator.errors;
					}
				} else {
					for (const entity of entityData) {
						if (!validator(entity)) {
							errors[entityType].push(validator.errors);
						}
					}
				}
			}

			const isErrors = Object.values(errors).some((error) => error.length > 0);
			if (isErrors) {
				const removeDuplicateErrors = (errors) => uniqBy(errors, 'message');
				const uniqueErrors = Object.keys(errors).reduce((acc, key) => {
					acc[key] = removeDuplicateErrors(errors[key].flat());
					return acc;
				}, {});
				context.log(`healthcheck failed`, uniqueErrors);
				return {
					status: 400,
					body: JSON.stringify(uniqueErrors, null, 2),
					headers: { 'Content-Type': 'application/json; charset=utf-8' }
				};
			} else {
				return {
					status: 200,
					body: 'ODW Curated Layer healthcheck passed',
					headers: { 'Content-Type': 'application/json; charset=utf-8' }
				};
			}
		} catch (error) {
			context.error(`failed to run healthcheck`, error);
			return {
				status: 500,
				body: JSON.stringify(error, null, 2),
				headers: { 'Content-Type': 'application/json; charset=utf-8' }
			};
		}
	}
});

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
