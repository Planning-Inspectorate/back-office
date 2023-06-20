import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const addAttachmentRepresentation = async (repId, documentId) => {
	return representationsRepository.addApplicationRepresentationAttachment(repId, documentId);
};
