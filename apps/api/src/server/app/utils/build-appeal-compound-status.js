import _ from 'lodash';

export const buildAppealCompundStatus = function (appealStatus) {
	if (appealStatus.length == 1 && appealStatus[0].subStateMachineName == undefined) {
		return appealStatus[0].status;
	} else if (appealStatus.length > 1 && _.every(appealStatus, function (status) {
		return status.subStateMachineName != undefined;
	})) {
		return _.chain(appealStatus)
			.keyBy('subStateMachineName')
			.mapValues('status')
			.value();
	} else {
		throw new Error('Something wrong with appeal status');
	}
};
