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
		documentUrl: documentDetails.blobStoragePath,
		from: '',
		receivedDate: null,
		size: 0,
		type: '',
		redacted: false,
		status: documentDetails.status
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
