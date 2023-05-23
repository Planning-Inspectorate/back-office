import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const updateRedactedRepresentation = async (representation, caseId, representationId) => {
	return representationsRepository.updateApplicationRepresentationRedaction(
		representation,
		caseId,
		representationId
	);
};
