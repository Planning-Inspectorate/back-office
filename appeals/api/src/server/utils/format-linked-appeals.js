/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Appeals.LinkedAppeal} LinkedAppeal */

/**
 * @param {Appeal[]} linkedAppeals
 * @param {number} appealId
 * @returns {LinkedAppeal[]}
 */
const formatLinkedAppeals = (linkedAppeals, appealId) =>
	linkedAppeals
		.filter((appeal) => appeal.id !== appealId)
		.map(({ id, reference }) => ({ appealId: id, appealReference: reference }));

export default formatLinkedAppeals;
