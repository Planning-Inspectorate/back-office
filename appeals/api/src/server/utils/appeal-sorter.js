/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */

/**
 *
 * @param {AppealListResponse[]} appeals
 * @returns {AppealListResponse[]}
 */
export const sortAppeals = (appeals) => {
	return appeals.sort((a, b) => {
		if (!a.dueDate) return 1;
		if (!b.dueDate) return -1;

		return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
	});
};
