import { chain, every } from 'lodash-es';

export const buildAppealCompundStatus = function (appealStatus) {
	if (appealStatus.length == 1 && appealStatus[0].subStateMachineName == undefined) {
		return appealStatus[0].status;
	} else if (appealStatus.length > 1 && every(appealStatus, function (status) {
		return status.subStateMachineName != undefined;
	})) {
		return { awaiting_lpa_questionnaire_and_statements: chain(appealStatus)
			.keyBy('subStateMachineName')
			.mapValues('status')
			.value() };
	} else {
		throw new Error('Something wrong with appeal status');
	}
};
