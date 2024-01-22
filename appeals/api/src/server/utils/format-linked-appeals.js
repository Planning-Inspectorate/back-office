/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Appeals.LinkedAppeal} LinkedAppeal */

/**
 * @param {import('./db-client/index.js').AppealRelationship[]} linkedAppeals
 * @param {string} reference
 * @returns {LinkedAppeal[]}
 */
const formatLinkedAppeals = (linkedAppeals, reference) => {
	const childRelationships = linkedAppeals.filter((link) => link.parentRef === reference);
	const parentRelationship = linkedAppeals.find((link) => link.childRef === reference);

	if (childRelationships.length) {
		return childRelationships.map((rel) => {
			return {
				appealId: rel.childId,
				appealReference: rel.childRef,
				isParentAppeal: false,
				linkingDate: rel.linkingDate
			};
		});
	} else if (parentRelationship) {
		return [
			{
				appealId: parentRelationship.parentId,
				appealReference: parentRelationship.parentRef,
				isParentAppeal: true,
				linkingDate: parentRelationship.linkingDate
			}
		];
	}

	return [];
};

export default formatLinkedAppeals;
