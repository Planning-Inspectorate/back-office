/**
 * @param {string | Array<string>} representationIds
 * @returns {Array<number>}
 */
const formatRepresentationIds = (representationIds) =>
	[representationIds].flat().map((representationId) => Number(representationId));

export { formatRepresentationIds };
