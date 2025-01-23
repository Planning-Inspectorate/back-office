import * as representationsRepository from '#repositories/representation.repository.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import { DOCUMENT_TYPES, folderDocumentCaseStageMappings } from '../../../constants.js';
import { getOrgNameOrName } from '../download/utils/map-rep-to-csv.js';

/**
 * @param {number} repId
 * @param {string} documentId
 * */
export const addAttachmentRepresentation = async (repId, documentId) => {
	const result = await representationsRepository.addApplicationRepresentationAttachment(
		repId,
		documentId
	);

	const document = await documentRepository.update(documentId, {
		documentType: DOCUMENT_TYPES.RelevantRepresentation
	});

	const representation = await representationsRepository.getById(Number(repId));
	await documentVersionRepository.updateDocumentVersion(documentId, document.latestVersionId, {
		author: getOrgNameOrName({
			organisationName: representation.represented.organisationName,
			firstName: representation.represented.firstName,
			lastName: representation.represented.lastName
		}),
		filter1: folderDocumentCaseStageMappings.RELEVANT_REPRESENTATIONS
	});

	return result;
};

/**
 * Soft deletes an attached document on a representation.
 *
 * @param {number} repId
 * @param {number} attachmentId
 * */
export const deleteAttachmentRepresentation = async (repId, attachmentId) => {
	return representationsRepository.deleteApplicationRepresentationAttachment(repId, attachmentId);
};
