import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const deleteContactRepresentation = async (repId, contactId) => {
	return representationsRepository.deleteApplicationRepresentationContact(repId, contactId);
};
