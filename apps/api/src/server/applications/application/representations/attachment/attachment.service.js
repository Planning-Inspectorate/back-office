import * as representationsRepository from '../../../../repositories/representation.repository.js';

export const addAttachmentRepresentation = async (repId, documentId) => {
	return representationsRepository.addApplicationRepresentationAttachment(repId, documentId);
};

export const deleteAttachmentRepresentation = async (repId, attachmentId) => {
	return representationsRepository.deleteApplicationRepresentationAttachment(repId, attachmentId);
};
