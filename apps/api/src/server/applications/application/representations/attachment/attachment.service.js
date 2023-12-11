import * as representationsRepository from '../../../../repositories/representation.repository.js';
import * as documentRepository from '../../../../repositories/document.repository.js';
import { DOCUMENT_TYPES } from '../../../constants.js';

/**
 * @param {number} repId
 * @param {string} documentId
 * */
export const addAttachmentRepresentation = async (repId, documentId) => {
	const result = await representationsRepository.addApplicationRepresentationAttachment(
		repId,
		documentId
	);

	await documentRepository.update(documentId, {
		documentType: DOCUMENT_TYPES.RelevantRepresentation
	});

	return result;
};

/**
 * @param {number} repId
 * @param {number} attachmentId
 * */
export const deleteAttachmentRepresentation = async (repId, attachmentId) => {
	return representationsRepository.deleteApplicationRepresentationAttachment(repId, attachmentId);
};
