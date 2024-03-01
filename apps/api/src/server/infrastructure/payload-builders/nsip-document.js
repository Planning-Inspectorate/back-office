import { pick } from 'lodash-es';
import config from '#config/config.js';
import { folderDocumentCaseStageMappings } from '../../applications/constants.js';

const NSIP_CASETYPE = 'nsip';

/**
 * @typedef {import('pins-data-model').Schemas.NSIPDocument} NSIPDocumentSchema
 * @typedef {import('@prisma/client').Prisma.DocumentVersionGetPayload<{include: {Document: {include: {folder: {include: {case: {include: {CaseStatus: true}}}}}}}}> } DocumentVersionWithDocumentAndFolder
 */

/**
 * Returns document in event message schema format
 *
 * @param {DocumentVersionWithDocumentAndFolder} docVersionWithFullDetails
 * @param {string} filePath
 * @returns {NSIPDocumentSchema}
 */
export const buildNsipDocumentPayload = (docVersionWithFullDetails, filePath = '') => {
	const { Document: document } = docVersionWithFullDetails;

	if (!document) {
		throw new Error(`Missing document for version ${docVersionWithFullDetails.documentGuid}`);
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
		(property) => !Object.hasOwn(docVersionWithFullDetails, property)
	);

	if (missingProperties.length) {
		throw new Error(
			`Missing required properties (${missingProperties.join(', ')}) for version ${
				docVersionWithFullDetails.documentGuid
			}`
		);
	}

	let caseReference = null;
	if (document.case?.reference) {
		caseReference = document.case.reference;
	} else if (document.folder?.case?.reference) {
		caseReference = document.folder.case.reference;
	}

	let payload = {
		documentId: document.guid,
		caseRef: caseReference,
		documentReference: document.documentReference,
		path: filePath,
		caseType: NSIP_CASETYPE,
		version: docVersionWithFullDetails.version,
		filename: docVersionWithFullDetails.fileName,
		originalFilename: docVersionWithFullDetails.originalFilename,
		size: docVersionWithFullDetails.size,
		documentURI: buildBlobUri(
			docVersionWithFullDetails.privateBlobContainer,
			docVersionWithFullDetails.privateBlobPath
		),
		publishedDocumentURI: buildBlobUri(
			docVersionWithFullDetails.publishedBlobContainer,
			docVersionWithFullDetails.publishedBlobPath
		),
		dateCreated: docVersionWithFullDetails.dateCreated?.toISOString() ?? null,
		lastModified: docVersionWithFullDetails.lastModified
			? docVersionWithFullDetails.lastModified.toISOString()
			: null,
		datePublished: docVersionWithFullDetails.datePublished
			? docVersionWithFullDetails.datePublished.toISOString()
			: null,
		horizonFolderId: docVersionWithFullDetails.horizonDataID,
		transcriptId: docVersionWithFullDetails.transcriptGuid,
		...pick(document, ['caseId', 'reference']),
		...pick(docVersionWithFullDetails, [
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
		documentCaseStage: mapDocumentCaseStageToSchema(docVersionWithFullDetails.stage)
	};

	return payload;
};

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
 * return the document blob uri, eg config.blobStorageUrl/containerName/path
 *
 * @param {string | null} containerName
 * @param {string | null} path
 *
 * @returns {string | null}
 */
const buildBlobUri = (containerName, path) => {
	if (!(config.blobStorageUrl && containerName && path)) {
		return null;
	}

	return [config.blobStorageUrl, containerName, path].map(trimSlashes).join('/');
};

/**
 *
 * @param {string} uri
 * @returns {string}
 */
const trimSlashes = (uri) => uri.replace(/^\/+|\/+$/g, '');
