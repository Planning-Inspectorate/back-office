// @ts-check

import { some } from 'lodash-es';

/** @typedef {import('@pins/appeals').AppealStatus} AppealStatus */

/**
 * @param {Array<{ status: AppealStatus; }>} appealStatuses 
 * @param {AppealStatus[]} desiredAppealStatuses 
 * @returns {boolean}
 */
export const arrayOfStatusesContainsString = function(appealStatuses, desiredAppealStatuses) {
	return some(appealStatuses, function(status) {
		return desiredAppealStatuses.includes(status.status);
	});
};
