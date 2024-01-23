/**
 *
 * @param {Prisma.RepresentationSelect} representation
 * @param {string} newStatus
 * @returns {{}|{representationId, status}}
 */
export const buildNsipRepresentationStatusUpdatePayload = (representation, newStatus) => {
	if (!representation) return [];
	return [
		{
			representationId: representation.id,
			status: newStatus
		}
	];
};
