/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */

/**
 * Checks if an appeal is linked to other appeals as a parent.
 * @param {RepositoryGetByIdResultItem} appeal The appeal to check for linked appeals.
 * @returns {boolean}
 */
const isAppealLead = (appeal) => {
	const linkedAppeals = appeal.linkedAppeals || [];
	const linkedAppealsAsLead = linkedAppeals.filter((link) => link.parentRef === appeal.reference);
	return linkedAppealsAsLead.length > 0;
};

/**
 * Checks if an appeal is linked to other appeals as a child.
 * @param {RepositoryGetByIdResultItem} appeal The appeal to check for linked appeals.
 * @returns {boolean}
 */
const isAppealChild = (appeal) => {
	const linkedAppeals = appeal.linkedAppeals || [];
	const linkedAppealsAsChild = linkedAppeals.filter((link) => link.childRef === appeal.reference);
	return linkedAppealsAsChild.length > 0;
};

/**
 * Checks if an appeal can be linked, with a specific relationship type (parent/child).
 * @param {RepositoryGetByIdResultItem} appeal The appeal to check for linked appeals.
 * @param {'lead'|'child'} relationship The relationship to check for.
 * @returns {boolean}
 */
export const canLinkAppeals = (appeal, relationship) => {
	const isLead = isAppealLead(appeal);
	const isChild = isAppealChild(appeal);

	return relationship === 'lead' ? !isChild : !isChild && !isLead;
};
