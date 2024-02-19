import { pick, omitBy, isNull } from 'lodash-es';
import config from '#config/config.js';
import { folderDocumentCaseStageMappings } from '../../constants.js';

/**
 * @typedef {import('pins-data-model').Schemas.NSIPDocument} NSIPDocumentSchema
 * */

/**
 * convert our DB Document Version stage value into the event schema value
 *
 * @param {string |null} stage
 * @returns
 */
export const mapDocumentCaseStageToSchema = (stage) => {
	// conversion is mostly just changing to all lower case
	let schemaValue = null;

	if (stage) {
		switch (stage) {
			case folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION:
				schemaValue = 'developers_application';
				break;
			case folderDocumentCaseStageMappings.POST_DECISION:
				// note that post decision has inconsistent format in the schema, it uses underscore instead of hyphen
				// our DB 'Post-decision' maps to 'post_decision'
				schemaValue = stage.toLowerCase().replace('-', '_');
				break;
			default:
				schemaValue = stage.toLowerCase();
				break;
		}
	}

	return schemaValue;
};

/**
 * Returns document in event message schema format
 *
 * @param {import('@pins/applications.api').Schema.DocumentVersionWithDocument} version
 * @returns {NSIPDocumentSchema}
 */
export const buildNsipDocumentPayload = (version) => {
	const { Document: document } = version;

	if (!document) {
		throw new Error(`Missing document for version ${version.documentGuid}`);
	}

	const requiredProperties = [
		'fileName',
		'originalFilename',
		'size',
		'privateBlobContainer',
		'privateBlobPath',
		'dateCreated'
	];

	const missingProperties = requiredProperties.filter(
		(property) => !Object.hasOwn(version, property)
	);

	if (missingProperties.length) {
		throw new Error(
			`Missing required properties (${missingProperties.join(', ')}) for version ${
				version.documentGuid
			}`
		);
	}

	let payload = {
		documentId: document.guid,
		...(document.case?.reference ? { caseRef: document.case.reference.toString() } : {}),
		version: version.version,
		filename: version.fileName,
		originalFilename: version.originalFilename,
		size: version.size,
		documentURI: buildBlobUri(version.privateBlobContainer, version.privateBlobPath),
		publishedDocumentURI: version.publishedBlobPath
			? buildBlobUri(version.publishedBlobContainer, version.publishedBlobPath)
			: undefined,
		dateCreated: version.dateCreated?.toISOString() ?? null,
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
				'filter1',
				'filter2'
			]),
			isNull
		)
	};

	if (version.stage) {
		payload.documentCaseStage = mapDocumentCaseStageToSchema(version.stage);
	}

	return payload;
};

/**
 * return the document blob uri, eg config.blobStorageUrl/containerName/path
 *
 * @param {string |null} containerName
 * @param {string |null} path
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
