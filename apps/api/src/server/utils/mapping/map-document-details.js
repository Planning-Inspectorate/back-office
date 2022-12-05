/** @typedef {import('@pins/api').Schema.Document} Document */

/** @typedef {{ guid: string, documentName: string, status: string }} DocumentDetails */

/**
 *
 * @param { Document } documentDetails
 * @returns { DocumentDetails }
 */
export const mapSingleDocumentDetails = (documentDetails) => {
	return {
		guid: documentDetails.guid,
		documentName: documentDetails.name,
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
