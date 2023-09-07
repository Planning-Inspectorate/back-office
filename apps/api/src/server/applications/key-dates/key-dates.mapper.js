import { pick, mapValues } from 'lodash-es';
import {
	acceptanceDateKeys,
	allDateKeys,
	decisionDateKeys,
	examinationDateKeys,
	postDecisionDateKeys,
	preApplicationDateKeys,
	preExaminationDateKeys,
	recommendationDateKeys,
	withdrawalDateKeys
} from './key-dates.utils.js';
import { mapDateToUnixTimestamp } from '#utils/mapping/map-date-to-unix-timestamp.js';

/**
 * @param {any} keyDates
 *
 * @returns {any} keyDates
 */
export const mapRequestToKeyDates = ({
	preApplication,
	preExamination,
	examination,
	recommendation,
	decision,
	postDecision,
	withdrawal
}) => {
	const allKeyDates = {
		...preApplication,
		...preExamination,
		...examination,
		...recommendation,
		...decision,
		...postDecision,
		...withdrawal
	};

	return pick(allKeyDates, allDateKeys);
};

/**
 * @param {import('@pins/applications.api').Schema.ApplicationDetails} keyDates
 *
 * @returns {any} keyDates
 */
export const mapKeyDatesToResponse = (keyDates) => {
	return {
		preApplication: {
			// 'submissionAtPublished' is a string not a date, so we don't convert to a UNIX Timestamp
			...mapValues(
				pick(
					keyDates,
					preApplicationDateKeys.filter((key) => key != 'submissionAtPublished')
				),
				mapDateToUnixTimestamp
			),
			submissionAtPublished: keyDates.submissionAtPublished
		},
		acceptance: mapValues(pick(keyDates, acceptanceDateKeys), mapDateToUnixTimestamp),
		preExamination: mapValues(pick(keyDates, preExaminationDateKeys), mapDateToUnixTimestamp),
		examination: mapValues(pick(keyDates, examinationDateKeys), mapDateToUnixTimestamp),
		recommendation: mapValues(pick(keyDates, recommendationDateKeys), mapDateToUnixTimestamp),
		decision: mapValues(pick(keyDates, decisionDateKeys), mapDateToUnixTimestamp),
		postDecision: mapValues(pick(keyDates, postDecisionDateKeys), mapDateToUnixTimestamp),
		withdrawal: mapValues(pick(keyDates, withdrawalDateKeys), mapDateToUnixTimestamp)
	};
};
