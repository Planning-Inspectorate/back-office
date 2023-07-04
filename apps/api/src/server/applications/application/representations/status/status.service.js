import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const updateStatusRepresentation = async (repId, action) => {
	return representationsRepository.updateApplicationRepresentationStatus(repId, action);
};
