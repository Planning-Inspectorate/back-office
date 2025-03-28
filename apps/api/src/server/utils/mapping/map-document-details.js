import { mapDateStringToUnixTimestamp } from './map-date-string-to-unix-timestamp.js';
import { mapDateToUnixTimestamp } from './map-date-to-unix-timestamp.js';

/**
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@pins/applications.api').Schema.DocumentDetails} DocumentDetails
 * @typedef {import('@pins/applications.api').Schema.DocumentVersionWithDocumentAndActivityLog} DocumentVersionWithDocumentAndActivityLog
 */

/**
 * Returns a flat set of the document properties wanted by the UI
 *
 * @param { DocumentVersionWithDocumentAndActivityLog } documentVersion
 * @returns { DocumentDetails }
 */
export const mapSingleDocumentDetailsFromVersion = ({
	Document,
	publishedStatus,
	...documentVersion
}) => {
	return {
		documentGuid: documentVersion.documentGuid,
		documentId: documentVersion?.documentId ?? null,
		documentRef: Document?.documentReference ?? null,
		folderId: Document?.folder?.id ?? null,
		caseRef: Document?.folder?.case?.reference ?? null,
		sourceSystem: documentVersion.sourceSystem ?? 'Back Office',
		privateBlobContainer: documentVersion?.privateBlobContainer ?? '',
		privateBlobPath: documentVersion?.privateBlobPath ?? '',
		author: documentVersion?.author ?? '',
		authorWelsh: documentVersion?.authorWelsh,
		// MigrationAddition: can remove after
		...(documentVersion.owner && { owner: documentVersion.owner }),
		fileName: documentVersion.fileName ?? '',

		originalFilename: documentVersion?.originalFilename ?? '',

		dateCreated: documentVersion?.dateCreated
			? mapDateStringToUnixTimestamp(documentVersion?.dateCreated?.toString())
			: null,

		size: documentVersion?.size ?? 0,

		mime: documentVersion.mime ?? '',

		publishedStatus: publishedStatus ?? '',

		redactedStatus: documentVersion.redactedStatus ?? '',

		datePublished: documentVersion.datePublished
			? mapDateToUnixTimestamp(documentVersion.datePublished)
			: null,

		description: documentVersion?.description,
		descriptionWelsh: documentVersion?.descriptionWelsh ?? null,
		version: documentVersion?.version,
		representative: documentVersion?.representative,
		interestedPartyNumber: documentVersion?.interestedPartyNumber,
		stage: documentVersion?.stage,

		documentType: documentVersion?.documentType,

		filter1: documentVersion?.filter1 ?? null,
		filter2: documentVersion?.filter2 ?? null,
		filter1Welsh: documentVersion?.filter1Welsh ?? null,

		examinationRefNo: documentVersion.examinationRefNo ?? '',
		fromFrontOffice: Document?.fromFrontOffice ?? false,
		transcript: documentVersion?.transcript?.documentReference ?? ''
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
