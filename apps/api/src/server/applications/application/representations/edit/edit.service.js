import * as representationsRepository from '#repositories/representation.repository.js';

export const updateEditedRepresentation = async (representation, caseId, representationId) => {
	return representationsRepository.updateApplicationRepresentationEdit(
		representation,
		caseId,
		representationId
	);
};
