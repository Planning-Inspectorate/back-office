import { pick, mapValues } from 'lodash-es';
import {
	acceptanceDateNames,
	allKeyDateNames,
	decisionDateNames,
	examinationDateNames,
	postDecisionDateNames,
	preApplicationDateNames,
	preExaminationDateNames,
	recommendationDateNames,
	withdrawalDateNames
} from '../../applications/key-dates/key-dates.utils.js';
import { mapDateToUnixTimestamp } from '#utils/mapping/map-date-to-unix-timestamp.js';

/**
 * @param {Object<string,Object<string, any>>} keyDateRequest
 *
 * @returns {Object<string, any>} keyDates
 */
export const mapRequestToKeyDates = ({
	preApplication,
	preExamination,
	examination,
	recommendation,
	decision,
	postDecision,
	withdrawal,
	acceptance
}) => {
	const allKeyDates = {
		...preApplication,
		...preExamination,
		...examination,
		...recommendation,
		...decision,
		...postDecision,
		...withdrawal,
		...acceptance
	};

	const keyDateNames = Object.keys(allKeyDates).reduce((uniqueNames, currentName) => {
		const keyDateName = currentName.split('.')[0];

		if (allKeyDateNames.includes(keyDateName)) {
			return uniqueNames.includes(keyDateName) ? uniqueNames : [...uniqueNames, keyDateName];
		}

		return uniqueNames;
	}, []);

	return keyDateNames.reduce((keyDates, keyDateName) => {
		return { ...keyDates, [keyDateName]: allKeyDates[keyDateName] || null };
	}, {});
};

/**
 * @param {Date} value
 * @param {string} key
 *
 * @returns {string|number}
 */
const mapPreApplicationDates = (value, key) =>
	// 'submissionAtPublished' is a string not a date, so we don't convert to a UNIX Timestamp
	key === 'submissionAtPublished' ? `${value || ''}` : mapDateToUnixTimestamp(value);

/**
 * @param {Date} value
 * @param {string} key
 *
 * @returns {string|null}
 */
const mapDateToISOString = (value, key) =>
	// 'submissionAtPublished' is a string not a date, so we don't convert to a UNIX Timestamp
	key === 'submissionAtPublished' ? `${value || null}` : value ? value.toISOString() : null;

/**
 * @param {import('@pins/applications.api').Schema.ApplicationDetails} keyDates
 *
 * @returns {Object<string,Object<string, any>>} keyDateResponse
 */
export const mapKeyDatesToResponse = (keyDates) => {
	return {
		preApplication: mapValues(pick(keyDates, preApplicationDateNames), mapPreApplicationDates),
		acceptance: mapValues(pick(keyDates, acceptanceDateNames), mapDateToUnixTimestamp),
		preExamination: mapValues(pick(keyDates, preExaminationDateNames), mapDateToUnixTimestamp),
		examination: mapValues(pick(keyDates, examinationDateNames), mapDateToUnixTimestamp),
		recommendation: mapValues(pick(keyDates, recommendationDateNames), mapDateToUnixTimestamp),
		decision: mapValues(pick(keyDates, decisionDateNames), mapDateToUnixTimestamp),
		postDecision: mapValues(pick(keyDates, postDecisionDateNames), mapDateToUnixTimestamp),
		withdrawal: mapValues(pick(keyDates, withdrawalDateNames), mapDateToUnixTimestamp)
	};
};

/**
 * Convert all key dates into ISO Strings - eg for schema compatibility
 *
 * @param {import('@pins/applications.api').Schema.ApplicationDetails} keyDates
 * @returns {*} keyDateResponse
 */
export const mapKeyDatesToISOStrings = (keyDates) => {
	let allKeyDatesConverted = {};
	const allDates = {
		preApplication: mapValues(pick(keyDates, preApplicationDateNames), mapDateToISOString),
		acceptance: mapValues(pick(keyDates, acceptanceDateNames), mapDateToISOString),
		preExamination: mapValues(pick(keyDates, preExaminationDateNames), mapDateToISOString),
		examination: mapValues(pick(keyDates, examinationDateNames), mapDateToISOString),
		recommendation: mapValues(pick(keyDates, recommendationDateNames), mapDateToISOString),
		decision: mapValues(pick(keyDates, decisionDateNames), mapDateToISOString),
		postDecision: mapValues(pick(keyDates, postDecisionDateNames), mapDateToISOString),
		withdrawal: mapValues(pick(keyDates, withdrawalDateNames), mapDateToISOString)
	};

	Object.assign(
		allKeyDatesConverted,
		allDates.preApplication,
		allDates.acceptance,
		allDates.preExamination,
		allDates.examination,
		allDates.recommendation,
		allDates.decision,
		allDates.postDecision,
		allDates.withdrawal
	);

	return allKeyDatesConverted;
};
