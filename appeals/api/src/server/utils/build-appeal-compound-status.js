import { chain, every } from 'lodash-es';

/**
 *
 * @param {import('@pins/appeals.api').Schema.AppealStatus[] | import('@pins/appeals.api').Schema.CaseStatus[] | null} appealStatus
 * @returns {object | string}
 */
export const buildAppealCompundStatus = (appealStatus) => {
	if (typeof appealStatus === 'undefined' || appealStatus === null) {
		throw new TypeError('No Status Provided');
	}
	if (appealStatus.length === 1 && !appealStatus[0].subStateMachineName) {
		return appealStatus[0].status;
	}
	if (
		appealStatus.length > 1 &&
		every(appealStatus, (status) => Boolean(status.subStateMachineName))
	) {
		return {
			awaiting_lpa_questionnaire_and_statements: chain(appealStatus)
				.keyBy('subStateMachineName')
				.mapValues('status')
				.value()
		};
	}
	throw new Error('Something wrong with appeal status');
};
