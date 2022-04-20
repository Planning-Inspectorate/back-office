import { some } from 'lodash-es';

export const arrayOfStatusesContainsString = function(appealStatuses, desiredAppealStatuses) {
	return some(appealStatuses, function(status) {
		return desiredAppealStatuses.includes(status.status);
	});
};
