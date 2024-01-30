/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */

/**
 * Checks if an appeal is linked to other appeals.
 * @param {RepositoryGetByIdResultItem} appeal The appeal to check for linked appeals.
 * @returns
 */
export const isAppealLinked = (appeal) => {
	const linkedAppeals = appeal.linkedAppeals || [];
	return linkedAppeals.length > 0;
};
