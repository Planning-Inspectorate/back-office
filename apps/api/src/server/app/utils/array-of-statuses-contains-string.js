// @ts-check

import { some } from 'lodash-es';

/** @typedef {import('@pins/api').Schema.AppealStatus} AppealStatus */
/** @typedef {import('@pins/api').Schema.AppealStatusType} AppealStatusType */

/**
 * @param {Array<AppealStatus>} appealStatuses 
 * @param {AppealStatusType | AppealStatusType[]} desiredAppealStatuses 
 * @returns {boolean}
 */
export const arrayOfStatusesContainsString = function(appealStatuses, desiredAppealStatuses) {
	return some(appealStatuses, function(status) {
		return desiredAppealStatuses.includes(status.status);
	});
};
