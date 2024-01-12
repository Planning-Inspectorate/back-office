import config from '#config/config.js';

/**
 * @typedef {import('pins-data-model').Schemas.NSIPDocument} NSIPDocument
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

  if (!(
    version.fileName &&
    version.originalFilename &&
    version.size &&
    version.privateBlobContainer &&
    version.privateBlobPath &&
    version.publishedBlobPath &&
    version.publishedBlobContainer &&
    version.dateCreated
  )) {
    throw new Error(`Missing required properties for version ${version.documentGuid}`);
  }

	return {
		documentId: document.guid,
		caseRef: document.case?.reference?.toString(),
		caseId: document.case?.id,
		documentReference: document.reference ?? undefined,
		version: version.version,
		examinationRefNo: version.examinationRefNo ?? undefined,
		filename: version.fileName,
		originalFilename: version.originalFilename,
		size: version.size,
		mime: version.mime ?? undefined,
		documentURI: buildBlobUri(version.privateBlobContainer, version.privateBlobPath),
		publishedDocumentURI: buildBlobUri(version.publishedBlobContainer, version.publishedBlobPath),
    /** @ts-ignore */
		virusCheckStatus: version.virusCheckStatus ?? undefined,
		fileMD5: version.fileMD5 ?? undefined,
		dateCreated: version.dateCreated?.toISOString() ?? null, // TODO: Should this come from the version?
		lastModified: version.lastModified?.toISOString(),
    /** @ts-ignore */
		redactedStatus: version.redactedStatus ?? undefined,
    /** @ts-ignore */
		publishedStatus: version.publishedStatus ?? undefined,
		datePublished: version.datePublished?.toISOString(),
		documentType: version.documentType ?? undefined,
    /** @ts-ignore */
		securityClassification: version.securityClassification ?? undefined,
    /** @ts-ignore */
		sourceSystem: version.sourceSystem,
    /** @ts-ignore */
		origin: version.origin ?? undefined,
		owner: version.owner ?? undefined,
		author: version.author ?? undefined,
		representative: version.representative ?? undefined,
		description: version.description ?? undefined,
    /** @ts-ignore */
		stage: version.stage ?? undefined,
		filter1: version.filter1 ?? undefined,
		filter2: version.filter2 ?? undefined,
		horizonFolderId: version.horizonDataID,
		transcriptId: version.transcriptGuid
	};
};

/**
 * return the document blob uri, eg config.blobStorageUrl/containerName/path
 *
 * @param {string} containerName
 * @param {string} path
 *
 * @returns {string}
 */
const buildBlobUri = (containerName, path) => `${trimSlashes(config.blobStorageUrl)}/${trimSlashes(containerName)}/${trimSlashes(path)}`;

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');
