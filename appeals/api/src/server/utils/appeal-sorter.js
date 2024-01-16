/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */

/**
 *
 * @param {AppealListResponse[]} appeals
 * @returns {AppealListResponse[]}
 */
export const sortAppeals = (appeals) => {
	// @ts-ignore
	return appeals.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};
