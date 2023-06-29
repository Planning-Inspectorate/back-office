// @ts-check

import { some } from 'lodash-es';

/** @typedef {import('@pins/applications.api').Schema.AppealStatus} AppealStatus */
/** @typedef {import('@pins/applications.api').Schema.AppealStatusType} AppealStatusType */

/**
 * @param {Array<AppealStatus>} appealStatuses
 * @param {AppealStatusType | AppealStatusType[] | string[]} desiredAppealStatuses
 * @returns {boolean}
 */
export const arrayOfStatusesContainsString = (appealStatuses, desiredAppealStatuses) => {
	return some(appealStatuses, (status) => {
		return desiredAppealStatuses.includes(status.status);
	});
};
