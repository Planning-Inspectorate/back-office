import { pick } from 'lodash-es';
import config from '#config/config.js';
import {
	mapDocumentCaseStageToSchema,
	mapProjectCaseStageToDocumentCaseStageSchema
} from '#utils/mapping/map-case-status.js';

const NSIP_CASETYPE = 'nsip';

/**
 * @typedef {import('@planning-inspectorate/data-model').Schemas.NSIPDocument} NSIPDocumentSchema
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

	const caseReference = (() => {
		if (document.case?.reference) {
			return document.case.reference;
		}

		if (document.folder?.case?.reference) {
			return document.folder.case.reference;
		}

		return null;
	})();

	const documentCaseStage = (() => {
		let docCaseStage = docVersionWithFullDetails.stage;
		if (docCaseStage) {
			return mapDocumentCaseStageToSchema(docCaseStage);
		}

		// Default to Project Case stage if document case stage was blank
		let caseStage = document.folder?.case?.CaseStatus?.find((cs) => cs.valid)?.status;
		if (!caseStage) {
			return null;
		}
		return mapProjectCaseStageToDocumentCaseStageSchema(caseStage);
	})();

	return {
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
			'authorWelsh',
			'representative',
			'description',
			'descriptionWelsh',
			'filter1',
			'filter1Welsh',
			'filter2'
		]),
		documentCaseStage
	};
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
