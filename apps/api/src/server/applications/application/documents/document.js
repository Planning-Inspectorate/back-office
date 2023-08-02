/**
 * NSIP Document
 *
 * @typedef {Object} NsipDocumentPayload
 * @property {string} documentId - The unique identifier for the file. This will be different to documentReference
 * @property {string | undefined} caseRef
 * @property {string | null | undefined} documentReference - Reference used throughout ODT <CaseRef>-<SequenceNo>
 * @property {string | null} version
 * @property {string | null} examinationRefNo
 * @property {string | null} filename - Current stored filename of the file
 * @property {string | null} originalFilename - Original filename of file
 * @property {number | null} size
 * @property {string | null} mime
 * @property {string | null} documentURI
 * @property {string | null} path
 * @property {"not_scanned" | "scanned" | "affected | null"} virusCheckStatus
 * @property {string | null} fileMD5
 * @property {string | null} dateCreated - Date format: date-time
 * @property {string | undefined} lastModified - Date format: date-time
 * @property {"submitted" | "internal" | "draft"} documentStatus
 * @property {"not_redacted" | "redacted | null"} redactedStatus
 * @property {"not_checked" | "checked" | "ready_to_publish" | "do_not_publish" | "publishing" | "published" | "archived | null"} publishedStatus
 * @property {string | undefined} datePublished - Date format: date-time
 * @property {string | null} documentType
 * @property {"public" | "official" | "secret" | "top-secret | null"} securityClassification
 * @property {"appeals" | "back_office" | "horizon" | "ni_file" | "sharepoint | null"} sourceSystem
 * @property {"pins" | "citizen" | "lpa" | "ogd | null"} origin
 * @property {string | null} owner
 * @property {string | null} author - Name of person who authored document
 * @property {string | null} representative - The on behalf of or agent submitter of document
 * @property {string | null} description
 * @property {"draft" | "pre-application" | "acceptance" | "pre-examination" | "examination" | "recommendation" | "decision" | "post_decision" | "withdrawn" | "developers_application | null"} stage
 * @property {string | null} filter1 - Filter field to provide additional filtering
 * @property {string | null} filter2 - Filter field to provide additional filtering
 */

/**
 * @param {import('apps/api/src/database/schema.js').DocumentVersionWithDocument} version
 * @returns {NsipDocumentPayload}
 */
export const buildNsipDocumentPayload = (version) => {
	const { Document: document } = version;

	if (!document) {
		throw new Error(`Missing document for version ${version.documentGuid}`);
	}
	// Since the Prisma types don't specify the set of permitted values, we have to ignore the TS errors here.
	return {
		documentId: document.guid,
		caseRef: document.case?.reference?.toString(),
		// documentReference: TODO: generate document reference
		version: version.version?.toString(),
		examinationRefNo: version.examinationRefNo,
		filename: version.fileName,
		originalFilename: version.originalFilename,
		size: version.size,
		mime: version.mime,
		documentURI: version.privateBlobPath,
		path: version.privateBlobPath, // TODO: Duplicated
		// @ts-ignore
		virusCheckStatus: version.virusCheckStatus,
		fileMD5: version.fileMD5,
		// @ts-ignore
		dateCreated: version.dateCreated?.toISOString(), // TODO: Should this come from the version?
		lastModified: version.lastModified?.toISOString(),
		//documentStatus: // TODO: Not really sure what this is
		// @ts-ignore
		redactedStatus: version.redactedStatus,
		// @ts-ignore
		publishedStatus: version.publishedStatus,
		datePublished: version.datePublished?.toISOString(),
		documentType: version.documentType,
		// @ts-ignore
		securityClassification: version.securityClassification,
		// @ts-ignore
		sourceSystem: version.sourceSystem,
		// @ts-ignore
		origin: version.origin,
		owner: version.owner,
		author: version.author,
		representative: version.representative,
		description: version.description,
		// @ts-ignore
		stage: version.stage,
		filter1: version.filter1,
		filter2: version.filter2
	};
};
