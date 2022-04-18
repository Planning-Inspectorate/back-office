import _ from 'lodash';

export const arrayOfStatusesContainsString = function(appealStatuses, desiredAppealStatuses) {
	return _.some(appealStatuses, function(status) {
		return desiredAppealStatuses.includes(status.status);
	});
};
