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

	return pick(allKeyDates, allKeyDateNames);
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
