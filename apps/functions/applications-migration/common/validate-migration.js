import { makeGetRequest } from '../common/back-office-api-client.js';
import { getNsipProjects } from './migrators/nsip-project-migration.js';
import { getRepresentationsForCase } from './migrators/nsip-representation-migration.js';
import { getNsipDocuments } from './migrators/nsip-document-migration.js';
import { getExamTimetable } from './migrators/exam-timetable-migration.js';
import { getNsipS51Advice } from './migrators/s51-advice-migration.js';
import { getServiceUsers } from './migrators/service-user-migration.js';
import { diff as jsonDiff } from 'json-diff';

/**
 * @typedef {Object} EntitiesObject
 * @property {Object} project
 * @property {Object} serviceUsers
 * @property {Object} documents
 * @property {Object} s51Advice
 * @property {Object} representations
 * @property {Object} examTimetableItems
 */

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 * @returns {Promise<Object>}
 */
export const validateMigration = async (log, caseReferences) => {
	log.info(`Validating migration for cases: ${JSON.stringify(caseReferences)}`);
	const odwData = await getODWData(log, caseReferences);
	const boData = await getBOData(log, caseReferences);
	const diff = getDiff(caseReferences, odwData, boData);
	log.info(diff);
	return diff;
};

/**
 * @param {string[]} caseReferences
 * @param {import('@azure/functions').Logger} log
 * @returns {Promise<Object<string, EntitiesObject>>}
 */
export const getODWData = async (log, caseReferences) => {
	log.info(`Getting ODW data for cases: ${JSON.stringify(caseReferences)}`);
	/** @type {Object<string, EntitiesObject>} */
	let data = {};
	for (const caseReference of caseReferences) {
		const allEntities = await Promise.all([
			getNsipProjects(log, caseReference, false),
			getServiceUsers(log, caseReference),
			getNsipDocuments(log, caseReference),
			getNsipS51Advice(log, caseReference),
			getRepresentationsForCase(log, caseReference),
			getExamTimetable(log, caseReference)
		]);

		const [
			[project],
			{ serviceUsers },
			documents,
			{ s51AdviceEntities: s51Advice },
			{ representationEntities: representations },
			examTimetableItems
		] = allEntities;

		data[caseReference] = {
			project,
			serviceUsers,
			documents,
			s51Advice,
			representations,
			examTimetableItems: examTimetableItems ?? {}
		};
	}
	return data;
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 * @returns {Promise<Object<string, EntitiesObject>>} */
const getBOData = async (log, caseReferences) => {
	log.info(`Getting BO data for cases: ${JSON.stringify(caseReferences)}`);
	return makeGetRequest(log, '/migration/validate', { caseReferences });
};

/**
 * @param {string[]} caseReferences
 * @param {Object<string, EntitiesObject>} odwData
 * @param {Object<string, EntitiesObject>} boData
 */
const getDiff = (caseReferences, odwData, boData) => {
	/** @type {Object<string, EntitiesObject>} */
	const diff = {};
	for (const caseReference of caseReferences) {
		const odwCaseData = odwData?.[caseReference];
		const boCaseData = boData?.[caseReference];

		diff[caseReference] = {
			project: generateDetailedDiff(jsonDiff(odwCaseData.project, boCaseData.project)),
			serviceUsers: getEntityDiffCounts(
				odwCaseData.serviceUsers,
				boCaseData.serviceUsers,
				'id',
				'id'
			),
			representations: getEntityDiffCounts(
				odwCaseData.representations,
				boCaseData.representations,
				'representationId',
				'id'
			),
			documents: getEntityDiffCounts(
				odwCaseData.documents,
				boCaseData.documents,
				'documentId',
				'documentGuid'
			),
			s51Advice: getEntityDiffCounts(odwCaseData.s51Advice, boCaseData.s51Advice, 'adviceId', 'id'),
			examTimetableItems: getEntityDiffCounts(
				odwCaseData.examTimetableItems?.events ?? [],
				boCaseData.examTimetableItems,
				'eventId',
				'id'
			)
		};
	}
	return diff;
};

/**
 *
 * @param {Object[]} odwEntities
 * @param {Object[]} boEntities
 * @param {string} comparisonKeyOdw
 * @param {string} comparisonKeyBo
 */
const getEntityDiffCounts = (
	odwEntities = [],
	boEntities = [],
	comparisonKeyOdw,
	comparisonKeyBo
) => {
	const odwEntitiesIds = odwEntities.map((entity) => entity[comparisonKeyOdw]?.toString());
	const boEntitiesIds = boEntities.map((entity) => entity[comparisonKeyBo]?.toString());

	const odwEntitiesIdsSet = new Set(odwEntitiesIds);
	const boEntitiesIdsSet = new Set(boEntitiesIds);

	const missingInBo = odwEntitiesIds.filter((id) => !boEntitiesIdsSet.has(id));
	const missingInOdw = boEntitiesIds.filter((id) => !odwEntitiesIdsSet.has(id));

	const boLength = boEntities.length;
	const odwLength = odwEntities.length;

	const message = boLength === odwLength ? '✅ Data is consistent' : '❌ Data is inconsistent';
	return {
		message,
		boLength,
		odwLength,
		missingInBo,
		missingInOdw
	};
};

/**
 * @param {Object} diff
 * @returns {Object}
 */
const generateDetailedDiff = (diff) => {
	const replaceKeys = (obj) => {
		const keys = Object.keys(obj);
		keys.forEach((key) => {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				replaceKeys(obj[key]);
			}

			let newKey = key
				.replace('__old', 'ODW')
				.replace('__new', 'BO')
				.replace('__deleted', '__missing_in_BO');

			// remove _added as we do not care about data that exists in BO but does not exist in ODW
			if (newKey.includes('__added')) {
				delete obj[key];
				return;
			}

			newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1);
			obj[newKey] = obj[key];
			if (newKey !== key) delete obj[key];
		});
	};

	replaceKeys(diff);

	return diff;
};
