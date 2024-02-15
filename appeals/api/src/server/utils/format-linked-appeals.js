/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Appeals.LinkedAppeal} LinkedAppeal */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */

/**
 * @param {import('./db-client/index.js').AppealRelationship[]} linkedAppeals
 * @param {string} reference
 * @param { RepositoryGetAllResultItem[] | null} formattedAppealWithLinkedTypes
 * @returns {LinkedAppeal[]}
 */
const formatLinkedAppeals = (linkedAppeals, reference, formattedAppealWithLinkedTypes) => {
	const childRelationships = linkedAppeals.filter((link) => link.parentRef === reference);
	const parentRelationship = linkedAppeals.find((link) => link.childRef === reference);

	if (childRelationships.length) {
		return childRelationships.map((rel) => {
			return {
				appealId: rel.childId,
				appealReference: rel.childRef,
				isParentAppeal: false,
				linkingDate: rel.linkingDate,
				appealType: assignAppealType(formattedAppealWithLinkedTypes, rel.childId),
				relationshipId: rel.id
			};
		});
	} else if (parentRelationship) {
		return [
			{
				appealId: parentRelationship.parentId,
				appealReference: parentRelationship.parentRef,
				isParentAppeal: true,
				linkingDate: parentRelationship.linkingDate,
				appealType: assignAppealType(formattedAppealWithLinkedTypes, parentRelationship.parentId),
				relationshipId: parentRelationship.id
			}
		];
	}

	return [];
};

/**
 * @param {RepositoryGetAllResultItem[] | null} formattedAppealWithLinkedTypes
 * @param {number| null} appealId
 * @returns {string}
 */
const assignAppealType = (formattedAppealWithLinkedTypes, appealId) => {
	if (formattedAppealWithLinkedTypes) {
		const matchedAppeal = formattedAppealWithLinkedTypes.find((appeal) => appeal.id === appealId);

		if (matchedAppeal && matchedAppeal.appealType) {
			return matchedAppeal.appealType.type;
		}
	}

	return 'Unknown';
};

export default formatLinkedAppeals;
