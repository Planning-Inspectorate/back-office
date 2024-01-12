import { pick, omitBy, isNull } from 'lodash-es';
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

	if (
		!(
			version.fileName &&
			version.originalFilename &&
			version.size &&
			version.privateBlobContainer &&
			version.privateBlobPath &&
			version.publishedBlobPath &&
			version.publishedBlobContainer &&
			version.dateCreated
		)
	) {
		throw new Error(`Missing required properties for version ${version.documentGuid}`);
	}

	return {
		documentId: document.guid,
		...(document.case?.reference ? { caseRef: document.case.reference.toString() } : {}),
		version: version.version,
		filename: version.fileName,
		originalFilename: version.originalFilename,
		size: version.size,
		documentURI: buildBlobUri(version.privateBlobContainer, version.privateBlobPath),
		publishedDocumentURI: buildBlobUri(version.publishedBlobContainer, version.publishedBlobPath),
		dateCreated: version.dateCreated?.toISOString() ?? null, // TODO: Should this come from the version?
		...(version.lastModified ? { lastModified: version.lastModified.toISOString() } : {}),
		...(version.datePublished ? { datePublished: version.datePublished.toISOString() } : {}),
		...(version.horizonDataID ? { horizonFolderId: version.horizonDataID } : {}),
		...(version.transcriptGuid ? { transcriptId: version.transcriptGuid } : {}),
		...pick(document, ['caseId', 'reference']),
		...omitBy(
			pick(version, [
				'examinationRefNo',
				'mime',
				'virusCheckStatus',
				'fileMD5',
				'redactedStatus',
				'publishedStatus',
				'documentType',
				'securityClassification',
				'sourceSystem',
				'origin',
				'owner',
				'author',
				'representative',
				'description',
				'stage',
				'filter1',
				'filter2'
			]),
			isNull
		)
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
const buildBlobUri = (containerName, path) =>
	[config.blobStorageUrl, containerName, path].map(trimSlashes).join('/');

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');
