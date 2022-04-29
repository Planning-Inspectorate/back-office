import { filter } from 'lodash-es';

export const getAppealStatusCreatedAt = function(appealStatuses, status) {
	return filter(appealStatuses, { status: status })[0].createdAt;
};
