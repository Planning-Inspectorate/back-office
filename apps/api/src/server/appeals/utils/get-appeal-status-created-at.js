import { filter } from 'lodash-es';

export const getAppealStatusCreatedAt = (appealStatuses, status) => {
	return filter(appealStatuses, { status })[0].createdAt;
};
