import config from '#config/config.js';

/**
 * @param {import('@pins/applications.api').Schema.DocumentVersionWithDocument} version
 * @returns {import('../../../../message-schemas/events/nsip-document').NSIPDocument}
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
		internalDocumentType: document.documentType,
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
