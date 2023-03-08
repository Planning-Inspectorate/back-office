import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';

/** @typedef {import('apps/api/prisma/schema.js').DocumentVersionWithDocument} DocumentVersionWithDocument */
/** @typedef {import('apps/api/prisma/schema.js').IDocument} Document */
/** @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails */

/**
 *
 * @param { DocumentVersionWithDocument } documentVersion
 * @returns { DocumentDetails }
 */
export const mapSingleDocumentDetailsFromVersion = ({ Document, ...documentVersion }) => {
	return {
		documentGuid: documentVersion.documentGuid,
		documentId: documentVersion?.documentId ?? '',
		caseRef: Document?.folder?.case?.reference || null,
		documentName: Document?.name || '',
		sourceSystem: documentVersion.sourceSystem ?? 'Back Office',
		blobStorageContainer: Document?.blobStorageContainer || '',
		blobStoragePath: Document?.blobStoragePath || '',
		author: documentVersion?.author || '',
		fileName: documentVersion.fileName ?? '',
		originalFilename: documentVersion?.originalFilename || '',
		dateCreated: documentVersion?.receivedDate
			? mapDateStringToUnixTimestamp(documentVersion?.receivedDate?.toString())
			: null,

		size: documentVersion?.size || 0,

		mime: documentVersion.mime ?? '',

		publishedStatus: documentVersion.publishedStatus ?? '',
		redactedStatus: '',

		// user has to assign stage
		status: Document?.status || null,

		datePublished: documentVersion?.publishedDate
			? mapDateStringToUnixTimestamp(documentVersion?.publishedDate?.toString())
			: null,
		description: documentVersion?.description,
		version: documentVersion?.version,
		agent: documentVersion?.representative,

		stage: documentVersion?.stage || null,
		documentType: documentVersion?.documentType,
		filter1: documentVersion?.filter1 || null,
		examinationRefNo: documentVersion.examinationRefNo ?? ''
	};
};

/**
 *
 * @param { DocumentVersionWithDocument[] } documents
 * @returns { DocumentDetails[]}
 */
export const mapDocumentVersionDetails = (documents) => {
	return documents.map((document) => mapSingleDocumentDetailsFromVersion(document));
};
