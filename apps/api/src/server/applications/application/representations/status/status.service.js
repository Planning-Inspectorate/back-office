import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const updateStatusRepresentation = async (repId, action) => {
	return representationsRepository.updateApplicationRepresentationStatusById(repId, action);
};
