import { filter } from 'lodash-es';

/**
 *
 * @param {{createdAt: any}[]} appealStatuses
 * @param {string} status
 * @returns {any}
 */
export const getAppealStatusCreatedAt = (appealStatuses, status) => {
	return filter(appealStatuses, { status })[0].createdAt;
};
