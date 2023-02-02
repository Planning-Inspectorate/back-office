import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';

/** @typedef {import('@pins/api').Schema.Document} Document */
/** @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails */

/**
 *
 * @param { Document } documentDetails
 * @returns { DocumentDetails }
 */
export const mapSingleDocumentDetails = (documentDetails) => {
	// TODO: currently some fields not in DB, hence null / blank values returned
	return {
		guid: documentDetails.guid,
		documentName: documentDetails.name,
		blobStorageContainer: documentDetails.blobStorageContainer,
		blobStoragePath: documentDetails.blobStoragePath,
		from: '',
		receivedDate: mapDateStringToUnixTimestamp(documentDetails.createdAt.toString()),
		size: documentDetails.fileSize,
		type: documentDetails.fileType ?? '',
		redacted: documentDetails.redacted,
		status: documentDetails.status,
		description: '',
		documentReferenceNumber: '',
		version: 1,
		agent: '',
		caseStage: '',
		webFilter: '',
		documentType: ''
	};
};

/**
 *
 * @param { Document[] } documents
 * @returns { DocumentDetails[]}
 */
export const mapDocumentDetails = (documents) => {
	return documents.map((document) => mapSingleDocumentDetails(document));
};
