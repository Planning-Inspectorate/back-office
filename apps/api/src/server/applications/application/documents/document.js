import config from '#config/config.js';

/**
 * @typedef {import('../../../../message-schemas/events/nsip-document').NSIPDocument} NSIPDocument
 * @typedef {import('../../../../message-schemas/events/nsip-document').VirusCheckStatus} VirusCheckStatus
 * @typedef {import('../../../../message-schemas/events/nsip-document').RedactedStatus} RedactedStatus
 * @typedef {import('../../../../message-schemas/events/nsip-document').PublishedStatus} PublishedStatus
 * @typedef {import('../../../../message-schemas/events/nsip-document').SecurityClassification} SecurityClassification
 * @typedef {import('../../../../message-schemas/events/nsip-document').SourceSystem} SourceSystem
 * @typedef {import('../../../../message-schemas/events/nsip-document').Origin} Origin
 * @typedef {import('../../../../message-schemas/events/nsip-document').Stage} Stage
 * */

/**
 * @param {import('@pins/applications.api').Schema.DocumentVersionWithDocument} version
 * @returns {NSIPDocument}
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
		caseId: document.case?.id,
		documentReference: document.reference,
		version: version.version,
		examinationRefNo: version.examinationRefNo,
		filename: version.fileName,
		originalFilename: version.originalFilename,
		size: version.size,
		mime: version.mime,
		documentURI: buildBlobUri(version.privateBlobContainer, version.privateBlobPath),
		publishedDocumentURI: buildBlobUri(version.publishedBlobContainer, version.publishedBlobPath),
		virusCheckStatus: /** @type {VirusCheckStatus} */ (version.virusCheckStatus),
		fileMD5: version.fileMD5,
		dateCreated: version.dateCreated?.toISOString() ?? null, // TODO: Should this come from the version?
		lastModified: version.lastModified?.toISOString(),
		redactedStatus: /** @type {RedactedStatus} */ (version.redactedStatus),
		publishedStatus: /** @type {PublishedStatus} */ (version.publishedStatus),
		datePublished: version.datePublished?.toISOString(),
		documentType: version.documentType,
		securityClassification: /** @type {SecurityClassification} */ (version.securityClassification),
		sourceSystem: /** @type {SourceSystem} */ (version.sourceSystem),
		origin: /** @type {Origin} */ (version.origin),
		owner: version.owner,
		author: version.author,
		representative: version.representative,
		description: version.description,
		stage: /** @type {Stage} */ (version.stage),
		filter1: version.filter1,
		filter2: version.filter2,
		horizonFolderId: version.horizonDataID,
		transcriptId: version.transcriptGuid
	};
};

/**
 * return the document blob uri, eg config.blobStorageUrl/containerName/path
 *
 * @param {string |null} containerName
 * @param {string |null} path
 *
 * @returns {string | undefined}
 */
const buildBlobUri = (containerName, path) => {
	if (containerName && path) {
		return `${trimSlashes(config.blobStorageUrl)}/${trimSlashes(containerName)}/${trimSlashes(
			path
		)}`;
	}

	return undefined;
};

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');
