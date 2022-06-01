import { chain, every } from 'lodash-es';

export const buildAppealCompundStatus = (appealStatus) => {
	if (appealStatus.length === 1 && typeof appealStatus[0].subStateMachineName === 'undefined') {
		return appealStatus[0].status;
	}
	if (
		appealStatus.length > 1 &&
		every(appealStatus, (status) => {
			return typeof status.subStateMachineName !== 'undefined';
		})
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
