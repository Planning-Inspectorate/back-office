import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';

/** @typedef {import('apps/api/src/database/schema.js').DocumentVersionWithDocument} DocumentVersionWithDocument */
/** @typedef {import('apps/api/src/database/schema.js').DocumentWithSubTables} Document */
/** @typedef {import('apps/api/src/database/schema.js').DocumentDetails} DocumentDetails */

/**
 *
 * @param { DocumentVersionWithDocument } documentVersion
 * @returns { DocumentDetails }
 */
export const mapSingleDocumentDetailsFromVersion = ({ Document, ...documentVersion }) => {
	return {
		documentGuid: documentVersion.documentGuid,
		documentId: documentVersion?.documentId ?? null,
		documentRef: Document?.reference ?? null,
		folderId: Document?.folder?.id ?? null,
		caseRef: Document?.folder?.case?.reference ?? null,
		sourceSystem: documentVersion.sourceSystem ?? 'Back Office',
		blobStorageContainer: documentVersion?.blobStorageContainer ?? '',
		blobStoragePath: documentVersion?.path ?? '',
		documentURI: documentVersion?.documentURI ?? '',
		author: documentVersion?.author ?? '',

		fileName: documentVersion.fileName ?? '',

		originalFilename: documentVersion?.originalFilename ?? '',

		dateCreated: documentVersion?.dateCreated
			? mapDateStringToUnixTimestamp(documentVersion?.dateCreated?.toString())
			: null,

		size: documentVersion?.size ?? 0,

		mime: documentVersion.mime ?? '',

		publishedStatus: documentVersion.publishedStatus ?? '',

		redactedStatus: documentVersion.redactedStatus ?? '',

		datePublished: documentVersion?.datePublished
			? mapDateStringToUnixTimestamp(documentVersion?.datePublished?.toString())
			: null,

		description: documentVersion?.description,
		version: documentVersion?.version,
		representative: documentVersion?.representative,
		stage: documentVersion?.stage,

		documentType: documentVersion?.documentType,

		filter1: documentVersion?.filter1 ?? null,
		filter2: documentVersion?.filter2 ?? null,
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
